// Álbum de fotos das etapas, guardado no Cloudflare R2 (bucket em R2_BUCKET). SÓ SERVIDOR — usa as chaves.
// Sem banco: a etapa é o prefixo da chave e a ordem vem do horário gravado no nome.
//   etapa-1/<ms>-<id>-<L>x<A>.webp     foto (até 1920px) — .jpg quando o navegador não gera webp (Safari)
//   etapa-1/<ms>-<id>-<L>x<A>-p.webp   miniatura (até 480px), usada na grade
// <L>x<A> = largura x altura da foto: o mosaico reserva a proporção antes de a imagem carregar.
import { DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { createHmac, timingSafeEqual } from "node:crypto"
import { etapasDoAlbum } from "./campeonato"

/** Teto por arquivo, já comprimido no navegador (a foto sai com ~300 KB; o teto é folga). */
export const TAMANHO_MAX = 5 * 1024 * 1024

export type Foto = {
  chave: string
  etapa: number
  url: string
  miniatura: string
  enviadaEm: number
  largura?: number
  altura?: number
}

const medidaOk = (n: unknown): n is number => Number.isInteger(n) && (n as number) > 0 && (n as number) <= 10000

export type Formato = "webp" | "jpg"
const MIME: Record<Formato, string> = { webp: "image/webp", jpg: "image/jpeg" }
export const formatoValido = (f: unknown): f is Formato => f === "webp" || f === "jpg"

// medidas opcionais (fotos sem elas também valem)
const RE_FOTO = /^etapa-(\d+)\/(\d{13})-([a-z0-9]+)(?:-(\d{1,5})x(\d{1,5}))?\.(webp|jpg)$/
const miniaturaDe = (chave: string) => chave.replace(/\.(webp|jpg)$/, "-p.$1")

const bucket = () => process.env.R2_BUCKET!
const urlPublica = (chave: string) => `${process.env.NEXT_PUBLIC_FOTOS_URL}/${chave}`

let cliente: S3Client | undefined
function r2() {
  cliente ??= new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
  })
  return cliente
}

export const etapaValida = (n: number) => etapasDoAlbum.some((e) => e.numero === n)

/** Fotos de uma etapa, da mais nova para a mais antiga. */
export async function fotosDaEtapa(numero: number): Promise<Foto[]> {
  const fotos: Foto[] = []
  let token: string | undefined
  do {
    const r = await r2().send(
      new ListObjectsV2Command({ Bucket: bucket(), Prefix: `etapa-${numero}/`, ContinuationToken: token }),
    )
    for (const o of r.Contents ?? []) {
      const m = o.Key && RE_FOTO.exec(o.Key)
      if (!m) continue // miniaturas e qualquer outra coisa
      fotos.push({
        chave: o.Key!,
        etapa: numero,
        url: urlPublica(o.Key!),
        miniatura: urlPublica(miniaturaDe(o.Key!)),
        enviadaEm: Number(m[2]),
        ...(m[4] && m[5] ? { largura: Number(m[4]), altura: Number(m[5]) } : {}),
      })
    }
    token = r.IsTruncated ? r.NextContinuationToken : undefined
  } while (token)
  return fotos.sort((a, b) => b.enviadaEm - a.enviadaEm)
}

/** As `n` fotos mais novas de todas as etapas. Se o R2 falhar, volta vazio (quem chama não pode quebrar). */
export async function ultimasFotos(n: number): Promise<Foto[]> {
  try {
    const porEtapa = await Promise.all(etapasDoAlbum.map((e) => fotosDaEtapa(e.numero)))
    return porEtapa.flat().sort((a, b) => b.enviadaEm - a.enviadaEm).slice(0, n)
  } catch {
    return []
  }
}

/**
 * URLs assinadas (10 min) para o navegador subir a foto e a miniatura direto no R2.
 * Tipo e tamanho entram na assinatura: o R2 recusa arquivo diferente do declarado.
 */
export async function urlsDeEnvio(
  numero: number,
  formato: Formato,
  tamanhoFoto: number,
  tamanhoMiniatura: number,
  largura?: unknown,
  altura?: unknown,
) {
  const id = Math.random().toString(36).slice(2, 10)
  const medidas = medidaOk(largura) && medidaOk(altura) ? `-${largura}x${altura}` : ""
  const chave = `etapa-${numero}/${Date.now()}-${id}${medidas}.${formato}`
  const assinar = (Key: string, ContentLength: number) =>
    getSignedUrl(r2(), new PutObjectCommand({ Bucket: bucket(), Key, ContentType: MIME[formato], ContentLength }), {
      expiresIn: 600,
      signableHeaders: new Set(["content-type", "content-length"]),
    })
  return {
    chave,
    segredo: segredoDe(chave),
    foto: await assinar(chave, tamanhoFoto),
    miniatura: await assinar(miniaturaDe(chave), tamanhoMiniatura),
  }
}

/**
 * Segredo de cada foto, devolvido só para quem enviou (fica no aparelho dele): com ele, quem mandou pode apagar.
 * HMAC da chave com FOTOS_ADMIN_TOKEN — sem banco; trocar o token invalida os segredos antigos.
 */
export function segredoDe(chave: string) {
  const token = process.env.FOTOS_ADMIN_TOKEN
  if (!token) throw new Error("FOTOS_ADMIN_TOKEN não definido")
  return createHmac("sha256", token).update(chave).digest("base64url")
}

export function segredoConfere(chave: string, segredo: unknown) {
  if (typeof segredo !== "string" || !process.env.FOTOS_ADMIN_TOKEN) return false
  const a = Buffer.from(segredoDe(chave))
  const b = Buffer.from(segredo)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function apagarFoto(chave: string) {
  if (!RE_FOTO.test(chave)) throw new Error("chave inválida")
  await r2().send(
    new DeleteObjectsCommand({ Bucket: bucket(), Delete: { Objects: [{ Key: chave }, { Key: miniaturaDe(chave) }] } }),
  )
}
