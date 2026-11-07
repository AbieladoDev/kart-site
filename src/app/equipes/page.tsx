import type { Metadata } from "next"
import Link from "next/link"
import { classificacaoEquipes, temResultado } from "@/lib/campeonato"
import { corTexto, pilotos, pintura, slugify } from "@/lib/pilotos"
import { FigurinhaFrente } from "@/components/figurinha"
import { FigurinhaViva } from "@/components/figurinha-viva"

export const metadata: Metadata = { title: "Equipes" }

export default function Equipes() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <h1 className="font-display text-5xl font-black uppercase italic leading-none sm:text-6xl">Equipes</h1>
      <p className="mt-3 max-w-xl text-muted">
        Cada equipe tem pintura, cores e emblema próprios — é o que vai estampado nas figurinhas. A pontuação da
        equipe é a soma dos seus pilotos.
      </p>

      <div className="mt-12 space-y-10">
        {classificacaoEquipes.map(({ equipe: e, pontos, posicao }) => {
          const Emblema = e.emblema
          const doTime = pilotos.filter((p) => p.equipe === e)
          const tinta = corTexto(e.cor1)
          return (
            <section
              key={e.nome}
              id={slugify(e.nome)}
              className="scroll-mt-24 overflow-hidden rounded-3xl border border-line bg-surface"
            >
              <div className="relative h-24 sm:h-28" style={{ background: pintura(e) }}>
                <div className="absolute inset-0 flex items-end justify-between gap-4 p-4 sm:p-6">
                  <div className="flex items-center gap-3" style={{ color: tinta }}>
                    <span
                      className="flex size-12 items-center justify-center rounded-xl border-2"
                      style={{ background: e.cor1, borderColor: e.cor3, color: e.cor3 }}
                    >
                      <Emblema className="size-6" />
                    </span>
                    <h2
                      className="font-display text-2xl font-black uppercase italic leading-none sm:text-4xl"
                      style={{ textShadow: `2px 2px 0 ${e.cor2}` }}
                    >
                      {e.nome}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="grid gap-8 p-4 sm:p-6 md:grid-cols-[1fr_auto] md:items-center">
                <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:max-w-2xl">
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
                <dl className="flex gap-8 md:flex-col md:gap-4 md:text-right">
                  <div>
                    <dt className="text-sm text-muted">Pontos</dt>
                    <dd className="font-display text-5xl font-black italic tabular-nums">{pontos}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted">Posição</dt>
                    <dd className="font-display text-5xl font-black italic tabular-nums">
                      {temResultado ? `${posicao}º` : "—"}
                    </dd>
                  </div>
                </dl>
              </div>
              {e.patrocinador && (
                <p className="border-t border-line px-6 py-3 text-sm text-muted">
                  Patrocínio: <span className="font-semibold text-ink">{e.patrocinador.nome}</span>
                </p>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
