import { Ban, Clock, Flag, MapPin, UserRound } from "lucide-react"
import { corTexto, corrida, equipes, pintura, totalPilotos } from "@/lib/pilotos"
import { Contagem } from "./contagem"
import { Campeonato } from "./campeonato"
import { Logo } from "./logo"

const giro = [-2, 1.5, -1, 2, -1.5, 1]

export default function Home() {
  const infos = [
    { icone: MapPin, titulo: "Local", valor: corrida.local, cor: "#ec4899" },
    { icone: Clock, titulo: "Chegar até", valor: corrida.chegada, cor: "#3b82f6" },
    { icone: Flag, titulo: "Largada", valor: corrida.largada, cor: "#22c55e" },
    { icone: Ban, titulo: "Álcool", valor: "Só depois!", cor: "#f97316" },
  ]

  return (
    <main className="fundo min-h-screen">
      <div className="xadrez h-6" />

      <section className="mx-auto max-w-5xl px-4 pt-10">
        <Logo />
        <p className="mt-10 text-center text-xs font-bold uppercase tracking-[0.4em] text-muted sm:text-sm">
          Falta para a largada
        </p>
        <div className="mt-4">
          <Contagem alvo={corrida.largadaISO} />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-14 pb-10">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand">
          {corrida.diaSemana}, {corrida.data}
        </p>
        <h1 className="mt-2 text-5xl font-black uppercase italic leading-none sm:text-7xl">
          Kart <span className="titulo-arcoiris pr-2">P1000</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          {totalPilotos} pilotos em {equipes.length} equipes no {corrida.local}. Largada às{" "}
          {corrida.largada} — estar no local às {corrida.chegada}, sem consumir álcool antes da corrida.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {infos.map(({ icone: Icone, titulo, valor, cor }) => (
            <div
              key={titulo}
              className="vidro rounded-xl border p-4"
              style={{ borderColor: `${cor}66`, backgroundImage: `linear-gradient(135deg, ${cor}33, transparent 70%)` }}
            >
              <Icone className="size-5" style={{ color: cor }} />
              <div className="mt-3 text-xs uppercase tracking-widest text-muted">{titulo}</div>
              <div className="text-xl font-bold leading-tight">{valor}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="mb-8 text-2xl font-black uppercase italic">Álbum das equipes</h2>

        <div className="grid gap-10 md:grid-cols-2">
          {equipes.map((e, ie) => {
            const Emblema = e.emblema
            const tinta = corTexto(e.cor1)
            return (
              <article key={e.nome} className={e.pilotos.length > 2 ? "md:col-span-2" : undefined}>
                <header className="mb-4 flex items-center gap-3">
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-lg border-2"
                    style={{ background: e.cor1, borderColor: e.cor2, color: e.cor2 }}
                  >
                    <Emblema className="size-6" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-xl font-black uppercase italic leading-tight">{e.nome}</h3>
                    <div className="mt-1 flex h-1.5 w-28 overflow-hidden rounded-full">
                      <span className="flex-1" style={{ background: e.cor1 }} />
                      <span className="flex-1" style={{ background: e.cor2 }} />
                      <span className="flex-1" style={{ background: e.cor3 }} />
                    </div>
                  </div>
                </header>

                <ul className="flex flex-wrap gap-4">
                  {e.pilotos.map((p, ip) => (
                    <li
                      key={p.nome}
                      className="relative w-[calc(50%-0.5rem)] max-w-40 rounded-xl bg-white p-1.5 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.6)] transition duration-300 hover:z-10 hover:scale-105 hover:rotate-0"
                      style={{ rotate: `${giro[(ie * 2 + ip) % giro.length]}deg` }}
                    >
                      <div
                        className="relative flex aspect-[3/4] flex-col overflow-hidden rounded-lg"
                        style={{ background: pintura(e) }}
                      >
                        <div className="flex items-center justify-between px-2 pt-1.5">
                          <span
                            className="text-2xl font-black italic leading-none"
                            style={{ color: tinta, textShadow: `2px 2px 0 ${e.cor2}` }}
                          >
                            {p.numero}
                          </span>
                          <span
                            className="flex size-6 items-center justify-center rounded"
                            style={{ background: e.cor2, color: e.cor1 }}
                          >
                            <Emblema className="size-4" />
                          </span>
                        </div>

                        {/* Foto: public/pilotos/<arquivo>, definida em pilotos.ts */}
                        <div className="flex flex-1 items-center justify-center px-2 py-1.5">
                          <div
                            className="relative aspect-square w-full overflow-hidden rounded-md border-2 bg-black/30"
                            style={{ borderColor: e.cor3 }}
                          >
                            {p.foto ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.foto} alt={p.nome} className="size-full object-cover" />
                            ) : (
                              <div className="flex size-full flex-col items-center justify-end">
                                <UserRound
                                  className="size-4/5 translate-y-[12%]"
                                  strokeWidth={1.5}
                                  style={{ color: e.cor3 }}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="px-1.5 py-1.5 text-center" style={{ background: e.cor2 }}>
                          <div
                            className="truncate text-xs font-black uppercase tracking-wide"
                            style={{ color: corTexto(e.cor2) }}
                          >
                            {p.nome}
                          </div>
                          <div
                            className="truncate text-[8px] font-bold uppercase tracking-[0.15em] opacity-80"
                            style={{ color: corTexto(e.cor2) }}
                          >
                            {e.nome}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </section>

      <div className="zebra h-3" />
      <Campeonato />

      <div className="xadrez h-6" />
    </main>
  )
}
