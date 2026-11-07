import type { Metadata } from "next"
import Link from "next/link"
import { classificacaoEquipes, temResultado } from "@/lib/campeonato"
import { pilotos, pintura, slugify } from "@/lib/pilotos"
import { FigurinhaFrente } from "@/components/figurinha"
import { FigurinhaViva } from "@/components/figurinha-viva"
import { KartEquipe } from "@/components/kart-equipe"

export const metadata: Metadata = { title: "Equipes" }

export default function Equipes() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <h1 className="font-display text-5xl font-black uppercase italic leading-none sm:text-6xl">Equipes</h1>
      <p className="mt-3 max-w-xl text-muted">
        Cada equipe tem pintura, cores e emblema próprios — é o que vai estampado nas figurinhas. A pontuação da
        equipe é a soma dos seus pilotos.
      </p>

      {/* Uma linha por equipe: nome e números à esquerda, figurinhas lado a lado à direita. */}
      <div className="mt-12 border-t border-line">
        {classificacaoEquipes.map(({ equipe: e, pontos, posicao }) => {
          const Emblema = e.emblema
          const doTime = pilotos.filter((p) => p.equipe === e)
          return (
            <section
              key={e.nome}
              id={slugify(e.nome)}
              className="grid scroll-mt-24 gap-6 border-b border-line py-6 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center md:gap-10"
            >
              <div className="flex items-center gap-5">
                <span className="w-1.5 shrink-0 rounded-full" style={{ background: pintura(e) }} />
                <div className="min-w-0">
                  <span
                    className="flex size-9 items-center justify-center rounded-lg border-2"
                    style={{ background: e.cor1, borderColor: e.cor2, color: e.cor2 }}
                  >
                    <Emblema className="size-5" />
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-black uppercase italic leading-[0.9] sm:text-3xl">
                    {e.nome}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{doTime.map((p) => p.nome).join(" e ")}</p>
                  <dl className="mt-4 flex gap-8">
                    <div>
                      <dt className="text-xs text-muted">Pontos</dt>
                      <dd className="font-display text-2xl font-black italic tabular-nums">{pontos}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">Posição</dt>
                      <dd className="font-display text-2xl font-black italic tabular-nums">
                        {temResultado ? `${posicao}º` : "—"}
                      </dd>
                    </div>
                  </dl>
                  {e.patrocinador && (
                    <p className="mt-4 text-sm text-muted">
                      Patrocínio: <span className="font-semibold text-ink">{e.patrocinador.nome}</span>
                    </p>
                  )}
                </div>
              </div>

              <KartEquipe e={e} className="w-44 lg:w-56" />

              <ul className="flex gap-3 sm:gap-4">
                {doTime.map((p) => (
                  <li key={p.slug} className="w-32 min-w-0 sm:w-36">
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
