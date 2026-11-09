import type { Metadata } from "next"
import { liga } from "@/lib/liga"
import { etapas, totalPilotos } from "@/lib/campeonato"
import { FotoFundo } from "@/components/visual"
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
    <>
      <section className="relative mx-3 mt-4 overflow-hidden rounded-[2rem]">
        <FotoFundo src="/fotos/turma.jpg" veu="bg-gradient-to-r from-page/95 via-page/80 to-page/30" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <p className="text-[0.7rem] font-bold tracking-[0.2em] text-muted uppercase">Temporada {liga.temporada}</p>
          <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Apoie a <span className="text-hot">temporada</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/75">
            A {liga.nome} é um campeonato de kart entre {totalPilotos} amigos, cada um por si. O apoio ajuda a bancar a
            estrutura da temporada — e a sua marca vai junto em cada figurinha.
          </p>
          {zap ? (
            <a
              href={zap}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-page transition hover:bg-brand"
            >
              Falar com a organização
            </a>
          ) : (
            <p className="mt-8 font-semibold">Fale com qualquer piloto do grid para combinar o apoio.</p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
      <section className="mt-20">
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight">Cotas</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {cotas.map((c, i) => (
            <li
              key={c.nome}
              className={`flex flex-col rounded-2xl border p-6 ${i === 0 ? "border-brand bg-brand/10" : "border-line bg-surface"}`}
            >
              <h3 className="text-xl font-extrabold leading-tight">{c.nome}</h3>
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
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight">Quem já apoia</h2>
        {liga.master && (
          <p className="mb-4 text-muted">
            Patrocinador master: <span className="font-semibold text-ink">{liga.master.nome}</span>
          </p>
        )}
        <ListaApoiadores />
      </section>
      </div>
    </>
  )
}
