import type { Metadata } from "next"
import Link from "next/link"
import { equipes, pilotos, totalPilotos } from "@/lib/pilotos"
import { liga } from "@/lib/liga"
import { FigurinhaFrente } from "@/components/figurinha"
import { FigurinhaViva } from "@/components/figurinha-viva"

export const metadata: Metadata = { title: "Álbum de figurinhas" }

export default function Album() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <h1 className="font-display text-5xl font-black uppercase italic leading-none sm:text-6xl">Álbum</h1>
      <p className="mt-3 max-w-xl text-muted">
        {totalPilotos} figurinhas da temporada {liga.temporada}, equipe por equipe. Toque numa figurinha para ver o
        verso com atributos e números do campeonato.
      </p>

      <div className="mt-12 space-y-16">
        {equipes.map((e) => {
          const Emblema = e.emblema
          const doTime = pilotos.filter((p) => p.equipe === e)
          return (
            <section key={e.nome} aria-labelledby={`eq-${doTime[0].slug}`}>
              <header className="mb-6 flex items-center gap-3 border-b border-line pb-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg border-2"
                  style={{ background: e.cor1, borderColor: e.cor2, color: e.cor2 }}
                >
                  <Emblema className="size-5" />
                </span>
                <h2 id={`eq-${doTime[0].slug}`} className="font-display text-2xl font-black uppercase italic">
                  {e.nome}
                </h2>
                <span className="ml-auto text-sm tabular-nums text-muted">
                  nº {String(doTime[0].figurinha).padStart(2, "0")}–{String(doTime.at(-1)!.figurinha).padStart(2, "0")}
                </span>
              </header>
              <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
                {doTime.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/pilotos/${p.slug}`} aria-label={`Figurinha de ${p.nome}`} className="block">
                      <FigurinhaViva>
                        <FigurinhaFrente p={p} />
                      </FigurinhaViva>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
