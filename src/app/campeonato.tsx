import { CalendarDays, Handshake, MapPin, Medal, Trophy } from "lucide-react"
import { apoiadores, etapas, pontos } from "@/lib/campeonato"
import { equipes } from "@/lib/pilotos"

function Titulo({ icone: Icone, children }: { icone: typeof Trophy; children: React.ReactNode }) {
  return (
    <h2 className="mb-6 flex items-center gap-3 text-2xl font-black uppercase italic">
      <Icone className="size-6 text-brand" />
      {children}
    </h2>
  )
}

export function Campeonato() {
  const temResultado = Object.keys(pontos).length > 0

  const ranking = equipes
    .flatMap((e) => e.pilotos.map((p) => ({ ...p, equipe: e, pts: pontos[p.nome] ?? 0 })))
    .sort((a, b) => b.pts - a.pts || a.nome.localeCompare(b.nome, "pt-BR"))

  const medalha = ["#facc15", "#cbd5e1", "#d97706"]

  return (
    <div className="mx-auto max-w-5xl space-y-16 px-4 py-16">
      {/* Próximas etapas */}
      <section>
        <Titulo icone={CalendarDays}>Próximas etapas</Titulo>
        <ol className="grid gap-3 sm:grid-cols-3">
          {etapas.map((et, i) => {
            const proxima = i === 0
            return (
              <li
                key={et.numero}
                className={`rounded-xl border p-5 ${proxima ? "border-brand bg-brand text-brand-fg" : "border-line bg-surface"}`}
              >
                <div className={`text-xs font-bold uppercase tracking-[0.3em] ${proxima ? "" : "text-muted"}`}>
                  Etapa {et.numero}
                  {proxima && " · próxima"}
                </div>
                <div className="mt-2 text-3xl font-black italic">{et.data}</div>
                <div className={`mt-3 flex items-center gap-2 text-sm font-semibold ${proxima ? "" : "text-muted"}`}>
                  <MapPin className="size-4" />
                  {et.local}
                  {et.hora && ` · ${et.hora}`}
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {/* Ranking */}
      <section>
        <Titulo icone={Trophy}>Ranking</Titulo>
        {!temResultado && (
          <p className="mb-4 text-sm text-muted">Todo mundo zerado — o ranking começa a valer depois da 1ª etapa.</p>
        )}
        <ol className="overflow-hidden rounded-xl border border-line bg-surface">
          {ranking.map((p, i) => (
            <li
              key={p.nome}
              className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0"
            >
              <span className="w-7 text-center text-lg font-black italic tabular-nums text-muted">
                {temResultado && i < 3 ? (
                  <Medal className="mx-auto size-5" style={{ color: medalha[i] }} />
                ) : (
                  i + 1
                )}
              </span>
              <span
                className="flex h-7 w-10 shrink-0 items-center justify-center rounded text-sm font-black italic"
                style={{ background: p.equipe.cor1, color: p.equipe.cor2 }}
              >
                {p.numero}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold">{p.nome}</div>
                <div className="truncate text-xs text-muted">{p.equipe.nome}</div>
              </div>
              <span className="text-lg font-black tabular-nums">
                {p.pts} <span className="text-xs font-bold text-muted">pts</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Apoiadores */}
      <section>
        <Titulo icone={Handshake}>Apoiadores</Titulo>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {apoiadores.length > 0
            ? apoiadores.map((a) => (
                <a
                  key={a.nome}
                  href={a.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-24 items-center justify-center rounded-xl border border-line bg-surface p-4 text-center font-bold"
                >
                  {a.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.logo} alt={a.nome} className="max-h-full max-w-full object-contain" />
                  ) : (
                    a.nome
                  )}
                </a>
              ))
            : Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-line text-center text-xs font-bold uppercase tracking-widest text-muted"
                >
                  Sua marca aqui
                </div>
              ))}
        </div>
      </section>
    </div>
  )
}
