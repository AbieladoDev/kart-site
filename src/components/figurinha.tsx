import { UserRound } from "lucide-react"
import { liga } from "@/lib/liga"
import { voltaCurta, type PilotoNoGrid } from "@/lib/campeonato"
import { SeloLiga } from "./logo"

/*
 * Figurinha de colecionar. Tudo é medido em `cqi` (largura do próprio cartão),
 * então a mesma figurinha serve no álbum (pequena) e na página do piloto (grande).
 * Proporção 5:7. Borda no tom pastel do piloto, foto de pista ao fundo, foto do piloto por cima.
 * O número grande é o KART DA ÚLTIMA CORRIDA — muda a cada sessão.
 * Versão PNG (compartilhar) em src/lib/figurinha-imagem.tsx — mudou aqui, conferir lá.
 */

export const FUNDO_FIGURINHA = "/fotos/velocidade-card.jpg"

/** Todas as figurinhas são douradas (igual em src/lib/figurinha-imagem.tsx). */
export const OURO = "#d9b45a"
export const OURO_BORDA = "linear-gradient(135deg, #f6e3a1 0%, #c8973a 30%, #f3d98c 55%, #a8772a 80%, #e9c977 100%)"

function Papel({ cor, children }: { cor: string; children: React.ReactNode }) {
  // O container fica num wrapper: `cqi` usado no PRÓPRIO elemento container é medido contra o
  // container de fora (ou a tela), não contra ele.
  return (
    <div className="@container w-full">
      <div
        className="relative aspect-[5/7] w-full rounded-[2.4cqi] p-[0.6cqi] shadow-[0_22px_40px_-18px_rgba(0,0,0,0.9)]"
        style={{ background: cor }}
      >
        {children}
      </div>
    </div>
  )
}

const nomeEmDuas = (nome: string) => {
  const [primeiro, ...resto] = nome.split(" ")
  return { primeiro, resto: resto.join(" ") }
}

function Numero({
  rotulo,
  valor,
  cor = "#ffffff",
  tamanho = "text-[11cqi]",
}: {
  rotulo: string
  valor: React.ReactNode
  cor?: string
  tamanho?: string
}) {
  return (
    <div className="leading-none">
      <div className="text-[2.8cqi] font-bold tracking-[0.16em] text-white/60 uppercase">{rotulo}</div>
      <div className={`mt-[1cqi] font-num ${tamanho} leading-[0.85] font-black italic tabular-nums`} style={{ color: cor }}>
        {valor}
      </div>
    </div>
  )
}

export function FigurinhaFrente({ p }: { p: PilotoNoGrid }) {
  const { primeiro, resto } = nomeEmDuas(p.nome)
  const u = p.ultima

  return (
    <Papel cor={OURO_BORDA}>
      <div className="relative size-full overflow-hidden rounded-[1.8cqi] bg-page">
        {/* pista ao fundo, tingida com o tom do piloto */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FUNDO_FIGURINHA} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 mix-blend-color" style={{ background: OURO, opacity: 0.55 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-page/30 via-page/40 to-page/95" />

        {/* foto do piloto (sangrando) ou ícone */}
        {p.foto ? (
          <div className="absolute inset-x-0 top-0 bottom-[22cqi]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.foto} alt={p.nome} className="size-full object-cover object-[50%_25%]" />
            <div className="absolute inset-x-0 top-0 h-[34cqi] bg-gradient-to-b from-page/75 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[40cqi] bg-gradient-to-t from-page to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-x-0 top-[24cqi] flex justify-center">
            <span
              className="flex size-[52cqi] items-center justify-center rounded-full border-[1cqi] border-white/25"
              style={{ background: `${OURO}cc` }}
            >
              <UserRound aria-label={`${p.nome} (sem foto)`} className="size-[62%] text-page/60" strokeWidth={1.6} />
            </span>
          </div>
        )}

        {/* topo: kart da sessão + selo */}
        <div className="absolute inset-x-[5cqi] top-[5cqi] flex items-start justify-between">
          <div className="leading-none">
            <div className="text-[3cqi] font-bold tracking-[0.2em] text-white/80 uppercase">Kart</div>
            <div className="font-num text-[19cqi] leading-[0.85] font-black text-brand italic drop-shadow-[0_0.6cqi_0_rgba(0,0,0,0.5)]">
              {u.kart}
            </div>
            <div className="mt-[1cqi] text-[3cqi] font-semibold text-white/80">Corrida de {u.etapa.data}</div>
          </div>
          <SeloLiga title={false} className="w-[19cqi] -rotate-12 drop-shadow-[0_1cqi_1cqi_rgba(0,0,0,0.5)]" />
        </div>

        {/* nome e resultado */}
        <div className="absolute inset-x-[5cqi] bottom-[5cqi]">
          <div className="truncate text-[11cqi] leading-[0.95] font-extrabold tracking-tight text-white">{primeiro}</div>
          {resto && <div className="truncate text-[5cqi] font-semibold text-white/75">{resto}</div>}
          {/* números lado a lado, sem fundo, na fonte do kart */}
          <div className="mt-[4cqi] grid grid-cols-3 items-end border-t border-white/15 pt-[3cqi] text-center">
            <Numero rotulo={`Etapa ${u.etapa.numero}`} valor={`P${u.posicao}`} cor={OURO} />
            <Numero rotulo="Pontos" valor={p.pontos} />
            <Numero rotulo="Melhor volta" valor={voltaCurta(u.melhorVolta)} />
          </div>
        </div>

        <div className="holo absolute inset-0" />
      </div>
    </Papel>
  )
}

/** Verso: mesmo fundo e mesmo estilo de número da frente — sem caixas, só números e linhas finas. */
export function FigurinhaVerso({ p }: { p: PilotoNoGrid }) {
  const u = p.ultima
  const ficha = [
    { rotulo: "Apelido", valor: p.apelido },
    { rotulo: "Cidade", valor: p.cidade },
  ].filter((f) => f.valor)

  return (
    <Papel cor={OURO_BORDA}>
      <div className="relative flex size-full flex-col overflow-hidden rounded-[1.8cqi] bg-page text-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FUNDO_FIGURINHA} alt="" className="absolute inset-0 size-full scale-x-[-1] object-cover" />
        <div className="absolute inset-0 mix-blend-color" style={{ background: OURO, opacity: 0.55 }} />
        <div className="absolute inset-0 bg-page/85" />

        <div className="relative flex flex-1 flex-col px-[5cqi] pt-[5cqi] pb-[5cqi]">
          <div className="flex items-start justify-between gap-[3cqi]">
            <div className="min-w-0">
              <div className="text-[3cqi] font-bold tracking-[0.18em] uppercase" style={{ color: OURO }}>
                {p.posicao}º na temporada
              </div>
              <div className="mt-[1cqi] truncate text-[9cqi] leading-none font-extrabold tracking-tight">{p.nome.split(" ")[0]}</div>
              <div className="truncate text-[4.4cqi] font-semibold text-white/70">{p.nome.split(" ").slice(1).join(" ")}</div>
            </div>
            <SeloLiga title={false} className="w-[16cqi] shrink-0 -rotate-12" />
          </div>

          <div className="mt-[6cqi] text-center text-[3cqi] font-bold tracking-[0.18em] text-white/60 uppercase">
            Corrida de {u.etapa.data} · kart <span className="text-brand">{u.kart}</span>
          </div>
          <div className="mt-[3cqi] grid grid-cols-2 gap-y-[4cqi] border-y border-white/15 py-[4cqi] text-center">
            <Numero rotulo="Chegada" valor={`P${u.posicao}`} cor={OURO} tamanho="text-[12cqi]" />
            <Numero rotulo="Melhor volta" valor={voltaCurta(u.melhorVolta)} tamanho="text-[12cqi]" />
            <Numero rotulo="Voltas" valor={u.voltas} tamanho="text-[12cqi]" />
            <Numero rotulo="Vel. máx" valor={Math.round(u.velocidade)} tamanho="text-[12cqi]" />
          </div>

          <div className="mt-[5cqi] text-center text-[3cqi] font-bold tracking-[0.18em] text-white/60 uppercase">
            Temporada {liga.temporada}
          </div>
          <div className="mt-[3cqi] grid grid-cols-3 text-center">
            <Numero rotulo="Pontos" valor={p.pontos} cor={OURO} />
            <Numero rotulo="Vitórias" valor={p.vitorias} />
            <Numero rotulo="Pódios" valor={p.podios} />
          </div>

          <div className="mt-auto text-center text-[3.2cqi] leading-snug text-white/70">
            {ficha.map((f) => (
              <div key={f.rotulo}>
                {f.rotulo}: <span className="font-semibold text-ink">{f.valor}</span>
              </div>
            ))}
            {p.frase && <p className="italic">“{p.frase}”</p>}
            <div className="mt-[1cqi] text-[2.8cqi] font-bold tracking-[0.18em] text-white/40 uppercase">
              {liga.nome} · {liga.temporada}
            </div>
          </div>
        </div>
      </div>
    </Papel>
  )
}
