import { UserRound } from "lucide-react"
import { liga } from "@/lib/liga"
import { corTexto, pintura, type PilotoNoGrid } from "@/lib/pilotos"
import { estatisticas, posicaoDe } from "@/lib/campeonato"
import { SeloLiga } from "./logo"

/*
 * Figurinha de colecionar. Tudo é medido em `cqi` (largura do próprio cartão),
 * então a mesma figurinha serve no álbum (pequena) e na página do piloto (grande).
 * Proporção 5:7, papel branco com borda de corte, pintura da equipe por baixo.
 */


function Papel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  // O container fica num wrapper: `cqi` usado no PRÓPRIO elemento container é medido contra o
  // container de fora (ou a tela), não contra ele — a moldura virava uma pílula gigante.
  return (
    <div className={`@container w-full ${className}`}>
      <div className="relative aspect-[5/7] w-full rounded-[7cqi] bg-[#f4f2ea] p-[3.5cqi] shadow-[0_18px_30px_-14px_rgba(0,0,0,0.85)]">
        {children}
      </div>
    </div>
  )
}

function MarcaPatrocinio({ nome, logo }: { nome: string; logo?: string }) {
  return logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logo} alt={nome} className="h-[5.5cqi] w-auto max-w-[30cqi] object-contain" />
  ) : (
    <span className="text-[3.6cqi] font-bold uppercase tracking-wider">{nome}</span>
  )
}

export function FigurinhaFrente({ p }: { p: PilotoNoGrid }) {
  const e = p.equipe
  const Emblema = e.emblema
  const tinta = corTexto(e.cor1)
  const tintaPlaca = corTexto(e.cor2)

  return (
    <Papel>
      <div className="relative size-full overflow-hidden rounded-[3.5cqi] shadow-[0_0_0_0.4cqi_rgba(0,0,0,0.14)]" style={{ background: pintura(e) }}>
        <div className="reticula absolute inset-0 opacity-40" />

        {/* número gigante ao fundo */}
        <div
          aria-hidden
          className="absolute -right-[6cqi] top-[8cqi] font-display text-[78cqi] font-black italic leading-none tracking-tighter"
          style={{ color: e.cor3, opacity: 0.2 }}
        >
          {p.numero}
        </div>

        {/* foto: ocupa a figurinha inteira, sem moldura, e se funde na pintura em cima e embaixo */}
        {p.foto ? (
          <div className="absolute inset-x-0 top-0 bottom-[16cqi]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.foto} alt={p.nome} className="size-full object-cover object-[50%_20%]" />
            <div
              className="absolute inset-x-0 top-0 h-[42cqi]"
              style={{ background: `linear-gradient(to bottom, ${e.cor1}e6, ${e.cor1}80 45%, transparent)` }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-[24cqi]"
              style={{ background: `linear-gradient(to top, ${e.cor2}, transparent)` }}
            />
          </div>
        ) : (
          <div className="absolute inset-x-[6cqi] bottom-[26cqi] top-[20cqi] flex items-end justify-center">
            <UserRound
              aria-label={`${p.nome} (sem foto)`}
              className="h-full w-auto translate-y-[8%]"
              strokeWidth={1.25}
              style={{ color: e.cor3, opacity: 0.85 }}
            />
          </div>
        )}

        {/* topo: número à esquerda, selo do grupo à direita */}
        <div className="absolute inset-x-[4.5cqi] top-[4cqi] flex items-start justify-between">
          <div>
            <div
              className="font-display text-[20cqi] font-black italic leading-[0.8] tracking-tight"
              style={{ color: tinta, textShadow: `0.8cqi 0.8cqi 0 ${e.cor2}` }}
            >
              {p.numero}
            </div>
          </div>
          <SeloLiga title={false} className="w-[21cqi] -rotate-12 drop-shadow-[0_1cqi_1cqi_rgba(0,0,0,0.5)]" />
        </div>

        {/* patrocinador master, se houver */}
        {liga.master && (
          <div className="absolute left-1/2 top-[4.5cqi] -translate-x-1/2 rounded-[1.5cqi] bg-white/90 px-[2cqi] py-[1cqi] text-[#121216]">
            <MarcaPatrocinio {...liga.master} />
          </div>
        )}

        {/* placa do nome */}
        <div
          className="absolute inset-x-0 bottom-0 px-[5cqi] pb-[4.5cqi] pt-[8cqi]"
          style={{ background: e.cor2, color: tintaPlaca, clipPath: "polygon(0 22%, 100% 0, 100% 100%, 0 100%)" }}
        >
          <div className="flex items-center gap-[3cqi]">
            <span
              className="flex size-[12cqi] shrink-0 items-center justify-center rounded-[2cqi] border-[0.8cqi]"
              style={{ background: e.cor1, borderColor: e.cor3, color: e.cor3 }}
            >
              <Emblema className="size-[7cqi]" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-[10cqi] font-black uppercase italic leading-[0.95]">
                {p.nome}
              </div>
              <div className="mt-[0.6cqi] truncate text-[3.8cqi] font-semibold uppercase tracking-[0.12em] opacity-85">
                {e.nome}
              </div>
            </div>
          </div>
          {e.patrocinador && (
            <div className="mt-[1.5cqi] flex items-center gap-[1.5cqi] text-[3.2cqi] opacity-85">
              patrocínio <MarcaPatrocinio {...e.patrocinador} />
            </div>
          )}
        </div>

        <div className="holo absolute inset-0" />
      </div>
    </Papel>
  )
}

function Dado({ rotulo, valor, grande = false }: { rotulo: string; valor: React.ReactNode; grande?: boolean }) {
  return (
    <div>
      <div className="text-[3.4cqi] font-semibold uppercase tracking-[0.14em] text-[#9a9aa6]">{rotulo}</div>
      <div className={`font-display font-black italic leading-none tabular-nums ${grande ? "text-[10cqi]" : "text-[7cqi]"}`}>
        {valor}
      </div>
    </div>
  )
}

export function FigurinhaVerso({ p }: { p: PilotoNoGrid }) {
  const e = p.equipe
  const s = estatisticas(p.slug)
  const pos = posicaoDe(p.slug)
  const ficha = [
    { rotulo: "Apelido", valor: p.apelido },
    { rotulo: "Cidade", valor: p.cidade },
  ].filter((f) => f.valor)

  return (
    <Papel>
      <div className="relative flex size-full flex-col overflow-hidden rounded-[3.5cqi] shadow-[0_0_0_0.4cqi_rgba(0,0,0,0.14)] bg-[#1c1c22] text-[#ecebe6]">
        <div className="h-[9cqi] shrink-0" style={{ background: pintura(e) }} />

        <div className="flex flex-1 flex-col gap-[4.5cqi] px-[5cqi] pt-[4cqi] pb-[4cqi]">
          <div className="flex items-end justify-between gap-[3cqi] border-b border-white/10 pb-[3cqi]">
            <div className="min-w-0">
              <div className="truncate font-display text-[9cqi] font-black uppercase italic leading-none">{p.nome}</div>
              <div className="mt-[1cqi] truncate text-[3.8cqi] text-[#9a9aa6]">{e.nome}</div>
            </div>
            <div className="font-display text-[12cqi] font-black italic leading-none" style={{ color: e.cor1 === "#0a0a0a" ? e.cor2 : e.cor1 }}>
              {p.numero}
            </div>
          </div>

          <div className="rounded-[2.5cqi] bg-black/30 p-[3.5cqi]">
            <div className="mb-[2cqi] text-[3.6cqi] font-semibold text-[#ffd400]">Temporada {liga.temporada}</div>
            <div className="grid grid-cols-3 gap-y-[3cqi]">
              <Dado rotulo="Posição" valor={pos ? `${pos}º` : "—"} grande />
              <Dado rotulo="Pontos" valor={s.pontos} grande />
              <Dado rotulo="Vitórias" valor={s.vitorias} grande />
              <Dado rotulo="Pódios" valor={s.podios} />
              <Dado rotulo="Corridas" valor={s.corridas} />
              <Dado rotulo="Melhor volta" valor={s.melhorVolta ?? "—"} />
            </div>
          </div>

          <div className="min-h-0 flex-1 text-[3.8cqi] leading-snug">
            {ficha.length > 0 || p.frase ? (
              <>
                {ficha.map((f) => (
                  <div key={f.rotulo}>
                    <span className="text-[#9a9aa6]">{f.rotulo}: </span>
                    <span className="font-semibold">{f.valor}</span>
                  </div>
                ))}
                {p.frase && <p className="mt-[1.5cqi] italic text-[#cfcdc6]">“{p.frase}”</p>}
              </>
            ) : (
              <p className="text-[#9a9aa6]">Ficha do piloto ainda não preenchida.</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-[3cqi]">
            <SeloLiga title={false} className="w-[13cqi]" />
            <div className="text-right text-[3.4cqi] text-[#9a9aa6]">
              {liga.nome} · {liga.temporada}
            </div>
          </div>
        </div>
      </div>
    </Papel>
  )
}
