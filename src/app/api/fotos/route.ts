import { NextResponse } from "next/server"
import { apagarFoto, etapaValida, formatoValido, segredoConfere, TAMANHO_MAX, urlsDeEnvio } from "@/lib/fotos"

const erro = (mensagem: string, status = 400) => NextResponse.json({ erro: mensagem }, { status })

const tamanhoOk = (n: unknown): n is number => Number.isInteger(n) && (n as number) > 0 && (n as number) <= TAMANHO_MAX

/**
 * POST { etapa, formato, tamanho, tamanhoMiniatura, largura?, altura? } → URLs assinadas para subir a foto direto no R2
 * + o `segredo` que deixa quem enviou apagar depois. Livre, sem login.
 */
export async function POST(req: Request) {
  const corpo = await req.json().catch(() => null)
  const etapa = Number(corpo?.etapa)
  if (!etapaValida(etapa)) return erro("Etapa inválida.")
  if (!formatoValido(corpo?.formato)) return erro("Formato inválido.")
  if (!tamanhoOk(corpo?.tamanho) || !tamanhoOk(corpo?.tamanhoMiniatura)) return erro("Foto grande demais.")
  return NextResponse.json(await urlsDeEnvio(etapa, corpo.formato, corpo.tamanho, corpo.tamanhoMiniatura, corpo.largura, corpo.altura))
}

/**
 * DELETE { chave, segredo? } — apaga quem enviou a foto (segredo dela) ou o administrador
 * (cabeçalho x-admin-token = FOTOS_ADMIN_TOKEN).
 */
export async function DELETE(req: Request) {
  const token = process.env.FOTOS_ADMIN_TOKEN
  const corpo = await req.json().catch(() => null)
  const chave = String(corpo?.chave ?? "")
  const admin = !!token && req.headers.get("x-admin-token") === token
  if (!admin && !segredoConfere(chave, corpo?.segredo)) return erro("Você só pode apagar as fotos que mandou.", 401)
  try {
    await apagarFoto(chave)
  } catch {
    return erro("Foto inválida.")
  }
  return NextResponse.json({ ok: true })
}
