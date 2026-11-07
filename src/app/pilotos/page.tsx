import type { Metadata } from "next"
import Link from "next/link"
import { equipes, pilotos, totalPilotos } from "@/lib/pilotos"
import { liga } from "@/lib/liga"
import { FigurinhaFrente } from "@/components/figurinha"
import { FigurinhaViva } from "@/components/figurinha-viva"
import { CompartilharWhats } from "@/components/compartilhar-whats"

export const metadata: Metadata = { title: "Álbum de figurinhas" }

export default function Album() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <h1 className="font-display text-5xl font-black uppercase italic leading-none sm:text-6xl">Álbum</h1>
      <p className="mt-3 max-w-xl text-muted">
        {totalPilotos} figurinhas da temporada {liga.temporada}, equipe por equipe. Toque numa figurinha para ver o
        verso com atributos e números do campeonato.
      </p>
      <CompartilharWhats
        className="mt-6"
        rotulo="Mandar o álbum no WhatsApp"
        texto={`Álbum de figurinhas da ${liga.nome} ${liga.temporada}: ${totalPilotos} pilotos, ${equipes.length} equipes 🏁`}
      />

      {/* Cada equipe é um bloco: as figurinhas da dupla lado a lado e o nome da equipe embaixo. */}
      <div className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {equipes.map((e) => {
          const Emblema = e.emblema
          const doTime = pilotos.filter((p) => p.equipe === e)
          return (
            <section key={e.nome} aria-labelledby={`eq-${doTime[0].slug}`}>
              <ul className="flex gap-4">
                {doTime.map((p) => (
                  <li key={p.slug} className="min-w-0 flex-1">
                    <Link href={`/pilotos/${p.slug}`} aria-label={`Figurinha de ${p.nome}`} className="block">
                      <FigurinhaViva>
                        <FigurinhaFrente p={p} />
                      </FigurinhaViva>
                    </Link>
                  </li>
                ))}
              </ul>
              <footer className="mt-5 flex items-center gap-3">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg border-2"
                  style={{ background: e.cor1, borderColor: e.cor2, color: e.cor2 }}
                >
                  <Emblema className="size-5" />
                </span>
                <h2 id={`eq-${doTime[0].slug}`} className="min-w-0 flex-1 truncate font-display text-xl font-black uppercase italic">
                  {e.nome}
                </h2>
                <span className="text-sm tabular-nums text-muted">
                  nº {String(doTime[0].figurinha).padStart(2, "0")}–{String(doTime.at(-1)!.figurinha).padStart(2, "0")}
                </span>
              </footer>
              <div className="mt-3 flex h-1 overflow-hidden rounded-full">
                <span className="flex-1" style={{ background: e.cor1 }} />
                <span className="flex-1" style={{ background: e.cor2 }} />
                <span className="flex-1" style={{ background: e.cor3 }} />
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
