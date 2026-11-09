/* eslint-disable @next/next/no-img-element -- fotos vêm do R2 já no tamanho certo; sem otimização da Vercel */
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, ChevronLeft, ChevronRight, LayoutDashboard, LayoutGrid, LoaderCircle, Plus, RectangleHorizontal, Trash2, X } from "lucide-react"

type Foto = { chave: string; url: string; miniatura: string; enviadaEm: number; largura?: number; altura?: number }

/** Formas de ver o álbum. Mosaico = cada foto na proporção dela (padrão). */
const VISUALIZACOES = [
  { id: "mosaico", rotulo: "Mosaico", icone: LayoutDashboard },
  { id: "grade", rotulo: "Grade", icone: LayoutGrid },
  { id: "grande", rotulo: "Grande", icone: RectangleHorizontal },
] as const
type Visualizacao = (typeof VISUALIZACOES)[number]["id"]
const CHAVE_VISUALIZACAO = "fotos-visualizacao"

/** Proporção real da foto (quando gravada no nome), para o espaço já nascer certo antes de carregar. */
const proporcao = (f: Foto) => (f.largura && f.altura ? { aspectRatio: `${f.largura} / ${f.altura}` } : undefined)

const CHAVE_ADMIN = "fotos-admin"
/** { [chave]: segredo } das fotos enviadas deste aparelho — quem mandou pode apagar. */
const CHAVE_MINHAS = "fotos-minhas"

function lerMinhas(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_MINHAS) ?? "{}")
  } catch {
    return {}
  }
}

function guardarMinha(chave: string, segredo: string) {
  try {
    localStorage.setItem(CHAVE_MINHAS, JSON.stringify({ ...lerMinhas(), [chave]: segredo }))
  } catch {
    // sem localStorage: a foto vai, só não dá para apagar depois deste aparelho
  }
}

/** Redimensiona no navegador (lado maior = `max`). webp quando o navegador gera; senão jpg (Safari). */
async function comprimir(arquivo: File, max: number, qualidade: number, so?: "jpg") {
  const img = await createImageBitmap(arquivo)
  const escala = Math.min(1, max / Math.max(img.width, img.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(img.width * escala)
  canvas.height = Math.round(img.height * escala)
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height)
  img.close()
  const gerar = (tipo: string) => new Promise<Blob | null>((ok) => canvas.toBlob(ok, tipo, qualidade))
  if (!so) {
    const webp = await gerar("image/webp")
    if (webp?.type === "image/webp") return { blob: webp, formato: "webp" as const, largura: canvas.width, altura: canvas.height }
  }
  const jpg = await gerar("image/jpeg")
  if (!jpg) throw new Error("não deu para ler a imagem")
  return { blob: jpg, formato: "jpg" as const, largura: canvas.width, altura: canvas.height }
}

async function enviar(arquivo: File, etapa: number) {
  const foto = await comprimir(arquivo, 1920, 0.82)
  // a miniatura sai no mesmo formato da foto (a chave das duas só muda o "-p")
  const mini = await comprimir(arquivo, 480, 0.75, foto.formato === "jpg" ? "jpg" : undefined)
  const r = await fetch("/api/fotos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      etapa,
      formato: foto.formato,
      tamanho: foto.blob.size,
      tamanhoMiniatura: mini.blob.size,
      largura: foto.largura,
      altura: foto.altura,
    }),
  })
  if (!r.ok) throw new Error((await r.json().catch(() => null))?.erro ?? "falhou")
  const urls: { chave: string; segredo: string; foto: string; miniatura: string } = await r.json()
  const tipo = foto.formato === "webp" ? "image/webp" : "image/jpeg"
  const subir = (url: string, blob: Blob) =>
    fetch(url, { method: "PUT", headers: { "Content-Type": tipo }, body: blob }).then((x) => {
      if (!x.ok) throw new Error("R2 recusou")
    })
  // miniatura antes: quando a foto aparece na lista, a miniatura já existe
  await subir(urls.miniatura, mini.blob)
  await subir(urls.foto, foto.blob)
  guardarMinha(urls.chave, urls.segredo)
}

/**
 * Álbum de uma etapa: grade de fotos, botões flutuantes para mandar fotos (câmera e +)
 * e visualização em tela cheia.
 * Apagar (lixeira na foto, toque duplo para confirmar): quem mandou, do mesmo aparelho; ou o administrador —
 * abrir uma vez /fotos?admin=<FOTOS_ADMIN_TOKEN> no aparelho para poder apagar qualquer uma.
 */
export function AlbumFotos({ numero, rotulo, fotos }: { numero: number; rotulo: string; fotos: Foto[] }) {
  const router = useRouter()
  const [aberta, setAberta] = useState<number | null>(null)
  const [envio, setEnvio] = useState<{ feitas: number; total: number } | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [admin, setAdmin] = useState<string | null>(null)
  const [minhas, setMinhas] = useState<Record<string, string>>({})
  const [confirmando, setConfirmando] = useState<string | null>(null)
  const [visualizacao, setVisualizacao] = useState<Visualizacao>("mosaico")
  const entrada = useRef<HTMLInputElement>(null)
  const camera = useRef<HTMLInputElement>(null)

  function trocarVisualizacao(v: Visualizacao) {
    setVisualizacao(v)
    try {
      localStorage.setItem(CHAVE_VISUALIZACAO, v)
    } catch {
      // sem localStorage: vale só até recarregar
    }
  }

  // Código de administrador: chega pela URL uma vez e fica guardado neste aparelho.
  useEffect(() => {
    try {
      const url = new URL(window.location.href)
      const doLink = url.searchParams.get("admin")
      if (doLink) {
        localStorage.setItem(CHAVE_ADMIN, doLink)
        url.searchParams.delete("admin")
        window.history.replaceState(null, "", url.pathname + url.search)
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única do localStorage após montar
      setAdmin(localStorage.getItem(CHAVE_ADMIN))
      setMinhas(lerMinhas())
      const salva = localStorage.getItem(CHAVE_VISUALIZACAO)
      if (VISUALIZACOES.some((v) => v.id === salva)) setVisualizacao(salva as Visualizacao)
    } catch {
      // sem localStorage (aba anônima etc.): só não mostra o botão de apagar e abre no mosaico
    }
  }, [])

  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(null), 4000)
    return () => clearTimeout(t)
  }, [aviso])

  async function aoEscolher(lista: FileList | null) {
    const arquivos = [...(lista ?? [])].filter((a) => a.type.startsWith("image/") || /\.(heic|heif)$/i.test(a.name))
    for (const el of [entrada.current, camera.current]) if (el) el.value = ""
    if (!arquivos.length) return
    let falhas = 0
    setEnvio({ feitas: 0, total: arquivos.length })
    for (const [i, arquivo] of arquivos.entries()) {
      try {
        await enviar(arquivo, numero)
      } catch {
        falhas++
      }
      setEnvio({ feitas: i + 1, total: arquivos.length })
    }
    setEnvio(null)
    setMinhas(lerMinhas())
    const ok = arquivos.length - falhas
    setAviso(
      falhas === 0
        ? ok === 1 ? "Foto enviada!" : `${ok} fotos enviadas!`
        : `${ok} de ${arquivos.length} enviadas. ${falhas === 1 ? "Uma foto" : `${falhas} fotos`} não ${falhas === 1 ? "foi" : "foram"}.`,
    )
    router.refresh()
  }

  const fechar = useCallback(() => setAberta(null), [])
  const passar = useCallback(
    (d: number) => setAberta((i) => (i === null || !fotos.length ? i : (i + d + fotos.length) % fotos.length)),
    [fotos.length],
  )

  useEffect(() => {
    if (aberta === null) return
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar()
      if (e.key === "ArrowRight") passar(1)
      if (e.key === "ArrowLeft") passar(-1)
    }
    document.addEventListener("keydown", tecla)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", tecla)
      document.body.style.overflow = ""
    }
  }, [aberta, fechar, passar])

  // Primeiro toque arma ("Apagar?"), o segundo apaga. Desarma sozinho em 3 s.
  useEffect(() => {
    if (!confirmando) return
    const t = setTimeout(() => setConfirmando(null), 3000)
    return () => clearTimeout(t)
  }, [confirmando])

  const podeApagar = (f: Foto) => !!admin || !!minhas[f.chave]

  async function apagar(foto: Foto) {
    if (!podeApagar(foto)) return
    if (confirmando !== foto.chave) {
      setConfirmando(foto.chave)
      return
    }
    setConfirmando(null)
    const r = await fetch("/api/fotos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...(admin ? { "x-admin-token": admin } : {}) },
      body: JSON.stringify({ chave: foto.chave, segredo: minhas[foto.chave] }),
    })
    if (!r.ok) {
      setAviso((await r.json().catch(() => null))?.erro ?? "Não deu para apagar.")
      return
    }
    setAberta(null)
    setAviso("Foto apagada.")
    router.refresh()
  }

  const fotoAberta = aberta !== null ? fotos[aberta] : undefined

  return (
    <>
      <div>
        {fotos.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <Camera className="size-10 text-muted" strokeWidth={1.5} />
            <p className="mt-4 text-lg font-bold">Nenhuma foto da {rotulo} ainda</p>
            <p className="mt-1 text-sm text-muted">Tire uma foto ou toque no + e seja o primeiro a mandar.</p>
          </div>
        ) : (
          <>
            {/* Formas de visualização, em etiquetas */}
            <div role="radiogroup" aria-label="Visualização" className="mb-6 flex gap-2">
              {VISUALIZACOES.map(({ id, rotulo: nome, icone: Icone }) => {
                const ativa = visualizacao === id
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={ativa}
                    onClick={() => trocarVisualizacao(id)}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition ${
                      ativa ? "border-ink bg-ink text-page" : "vidro border-white/15 text-ink hover:border-white/40"
                    }`}
                  >
                    <Icone className="size-4" />
                    {nome}
                  </button>
                )
              })}
            </div>

            {visualizacao === "mosaico" && (
              // cada foto na proporção dela, em colunas — fica solto, de propósito
              <ul className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4">
                {fotos.map((f, i) => (
                  <li key={f.chave} className="group relative mb-2 break-inside-avoid overflow-hidden rounded-xl bg-surface sm:mb-3">
                    <button type="button" onClick={() => setAberta(i)} className="block w-full" aria-label={`Abrir foto ${i + 1}`}>
                      <img src={f.miniatura} alt="" loading="lazy" style={proporcao(f)} className="block w-full transition duration-300 group-hover:scale-[1.03]" />
                    </button>
                    {podeApagar(f) && <BotaoApagar armado={confirmando === f.chave} onClick={() => apagar(f)} className="absolute top-2 right-2" />}
                  </li>
                ))}
              </ul>
            )}

            {visualizacao === "grade" && (
              // grade regular: todas no mesmo formato (recorte central), linhas alinhadas
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                {fotos.map((f, i) => (
                  <li key={f.chave} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-surface">
                    <button type="button" onClick={() => setAberta(i)} className="block size-full" aria-label={`Abrir foto ${i + 1}`}>
                      <img src={f.miniatura} alt="" loading="lazy" className="size-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                    </button>
                    {podeApagar(f) && <BotaoApagar armado={confirmando === f.chave} onClick={() => apagar(f)} className="absolute top-2 right-2" />}
                  </li>
                ))}
              </ul>
            )}

            {visualizacao === "grande" && (
              // uma por linha, inteira, no tamanho bom de ver
              <ul className="mx-auto max-w-3xl space-y-4">
                {fotos.map((f, i) => (
                  <li key={f.chave} className="relative overflow-hidden rounded-2xl bg-surface">
                    <button type="button" onClick={() => setAberta(i)} className="block w-full" aria-label={`Abrir foto ${i + 1}`}>
                      <img src={f.url} alt="" loading="lazy" style={proporcao(f)} className="block w-full" />
                    </button>
                    {podeApagar(f) && <BotaoApagar armado={confirmando === f.chave} onClick={() => apagar(f)} className="absolute top-3 right-3" />}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* Botões flutuantes: câmera (só celular) e + (galeria / arquivos) */}
      <input
        ref={entrada}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => aoEscolher(e.target.files)}
      />
      {/* abre direto a câmera traseira do celular (no computador o `capture` é ignorado — por isso o botão some lá) */}
      <input
        ref={camera}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => aoEscolher(e.target.files)}
      />
      <div className="fixed right-5 bottom-5 z-30 flex items-center gap-3 sm:right-8 sm:bottom-8">
        {(envio || aviso) && (
          <p role="status" className="vidro rounded-full border border-white/10 px-4 py-2 text-sm font-semibold">
            {envio ? `Enviando ${Math.min(envio.feitas + 1, envio.total)} de ${envio.total}…` : aviso}
          </p>
        )}
        {!envio && (
          <button
            type="button"
            onClick={() => camera.current?.click()}
            aria-label={`Tirar foto para a ${rotulo}`}
            className="flex size-14 items-center justify-center rounded-full bg-ink text-page shadow-[0_10px_30px_rgb(0_0_0/0.45)] transition hover:brightness-95 md:hidden"
          >
            <Camera className="size-6" strokeWidth={2.25} />
          </button>
        )}
        <button
          type="button"
          onClick={() => entrada.current?.click()}
          disabled={!!envio}
          aria-label={`Mandar fotos para a ${rotulo}`}
          className="flex size-16 items-center justify-center rounded-full bg-brand text-brand-fg shadow-[0_10px_30px_rgb(0_0_0/0.45)] transition hover:brightness-110 disabled:opacity-80"
        >
          {envio ? <LoaderCircle className="size-7 animate-spin" /> : <Plus className="size-8" strokeWidth={2.5} />}
        </button>
      </div>

      {/* Tela cheia */}
      {fotoAberta && (
        <div role="dialog" aria-modal="true" aria-label="Foto" className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={fechar}>
          <img
            src={fotoAberta.url}
            alt=""
            className="max-h-[100dvh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute top-4 right-4 flex gap-2">
            {podeApagar(fotoAberta) && (
              <BotaoApagar
                armado={confirmando === fotoAberta.chave}
                onClick={(e) => {
                  e.stopPropagation()
                  apagar(fotoAberta)
                }}
                grande
              />
            )}
            <button type="button" onClick={fechar} aria-label="Fechar" className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-ink hover:bg-white/15">
              <X className="size-5" />
            </button>
          </div>
          {fotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  passar(-1)
                }}
                aria-label="Foto anterior"
                className="absolute top-1/2 left-3 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-ink hover:bg-white/15"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  passar(1)
                }}
                aria-label="Próxima foto"
                className="absolute top-1/2 right-3 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-ink hover:bg-white/15"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-num text-sm font-bold text-muted tabular-nums">
            {aberta! + 1} / {fotos.length}
          </p>
        </div>
      )}
    </>
  )
}

/** Lixeira. Armado = segundo toque apaga (fica vermelho e escreve "Apagar?"). */
function BotaoApagar({
  armado,
  onClick,
  grande = false,
  className = "",
}: {
  armado: boolean
  onClick: (e: React.MouseEvent) => void
  grande?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={armado ? "Confirmar: apagar foto" : "Apagar foto"}
      className={`flex items-center justify-center gap-1.5 rounded-full font-bold backdrop-blur transition ${
        grande ? "h-11 min-w-11 px-3 text-sm" : "h-9 min-w-9 px-2.5 text-xs"
      } ${armado ? "bg-hot text-page" : "bg-black/55 text-ink hover:bg-black/75"} ${className}`}
    >
      <Trash2 className={grande ? "size-5" : "size-4"} />
      {armado && "Apagar?"}
    </button>
  )
}
