import type { Metadata } from "next"
import { liga } from "@/lib/liga"
import { equipes, totalPilotos } from "@/lib/pilotos"
import { etapas } from "@/lib/campeonato"
import { FigurinhaIlustrativa } from "@/components/figurinha"
import { ListaApoiadores } from "@/components/lista-apoiadores"

export const metadata: Metadata = { title: "Apoie a temporada" }

// Cotas: o que cada apoiador recebe. Valores combinados direto com a organização.
const cotas = [
  {
    nome: "Patrocinador master",
    vagas: "1 vaga",
    itens: [
      `Marca em todas as ${totalPilotos} figurinhas, ao lado do selo do campeonato`,
      "Marca no topo da página de apoiadores",
      `Presença nas ${etapas.length} etapas da temporada`,
    ],
  },
  {
    nome: "Patrocinador de equipe",
    vagas: `${equipes.length} vagas, uma por equipe`,
    itens: [
      "Marca na placa de nome das figurinhas da equipe",
      "Nome da marca na página da equipe",
      "Ideal para quem já tem um amigo no grid",
    ],
  },
  {
    nome: "Apoiador",
    vagas: "Sem limite",
    itens: ["Logo na página de apoiadores", "Link direto para o site ou Instagram da marca"],
  },
]

export default function Apoiadores() {
  const zap = liga.whatsapp
    ? `https://wa.me/${liga.whatsapp}?text=${encodeURIComponent(`Olá! Quero apoiar a temporada ${liga.temporada} da ${liga.nome}.`)}`
    : undefined

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <section className="grid items-center gap-12 md:grid-cols-[1fr_minmax(0,300px)]">
        <div>
          <h1 className="font-display text-5xl font-black uppercase italic leading-[0.9] sm:text-6xl">
            Apoie a temporada {liga.temporada}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            A {liga.nome} é um campeonato de kart entre {totalPilotos} amigos, em {equipes.length} equipes. O apoio
            ajuda a bancar a estrutura da temporada — e a sua marca vai junto em cada figurinha.
          </p>
          {zap ? (
            <a
              href={zap}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded-full bg-brand px-6 py-3 font-display text-lg font-extrabold uppercase italic text-brand-fg transition hover:brightness-110"
            >
              Falar com a organização
            </a>
          ) : (
            <p className="mt-8 font-semibold">Fale com qualquer piloto do grid para combinar o apoio.</p>
          )}
        </div>
        <div className="mx-auto w-full max-w-[300px] rotate-3">
          <FigurinhaIlustrativa e={equipes[0]} />
        </div>
      </section>

      <section className="mt-20">
        <h2 className="mb-6 font-display text-3xl font-black uppercase italic">Cotas</h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {cotas.map((c, i) => (
            <li
              key={c.nome}
              className={`flex flex-col rounded-2xl border p-6 ${i === 0 ? "border-brand bg-brand/10" : "border-line bg-surface"}`}
            >
              <h3 className="font-display text-2xl font-black uppercase italic leading-tight">{c.nome}</h3>
              <p className="mt-1 text-sm text-muted">{c.vagas}</p>
              <ul className="mt-5 space-y-2.5">
                {c.itens.map((item) => (
                  <li key={item} className="flex gap-2.5 leading-snug">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20">
        <h2 className="mb-6 font-display text-3xl font-black uppercase italic">Quem já apoia</h2>
        {liga.master && (
          <p className="mb-4 text-muted">
            Patrocinador master: <span className="font-semibold text-ink">{liga.master.nome}</span>
          </p>
        )}
        <ListaApoiadores />
      </section>
    </div>
  )
}
