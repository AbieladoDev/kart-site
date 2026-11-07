import Link from "next/link"
import { liga, type Marca } from "@/lib/liga"

/*
 * Apoiadores como placas de beira de pista: placa clara, larga e baixa, logo no centro e
 * zebra vermelha/branca no pé. Sem texto visível — o nome vai no alt/title.
 * Logo precisa funcionar em fundo claro (por isso a db.app usa a versão azul).
 */
const PLACA = "flex h-full flex-col overflow-hidden rounded-lg bg-[#f4f2ea] shadow-[0_10px_20px_-12px_rgba(0,0,0,0.8)]"

function Placa({ a }: { a: Marca }) {
  const titulo = a.descricao ? `${a.nome} — ${a.descricao}` : a.nome
  const conteudo = (
    <>
      <span className="flex h-28 items-center justify-center p-2">
        {a.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.logo} alt={a.nome} className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="font-display text-2xl font-black uppercase italic text-[#121216]">{a.nome}</span>
        )}
      </span>
      <span className="zebra mt-auto block h-2.5" aria-hidden />
    </>
  )

  return a.link ? (
    <a href={a.link} target="_blank" rel="noreferrer" title={titulo} className={`${PLACA} transition hover:-translate-y-0.5`}>
      {conteudo}
    </a>
  ) : (
    <div title={titulo} className={PLACA}>
      {conteudo}
    </div>
  )
}

/** Placas dos apoiadores; completa com "espaço livre" até fechar a linha de 4. */
export function ListaApoiadores() {
  const n = liga.apoiadores.length
  const livres = n === 0 ? 4 : (4 - (n % 4)) % 4

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {liga.apoiadores.map((a) => (
        <li key={a.nome}>
          <Placa a={a} />
        </li>
      ))}
      {Array.from({ length: livres }, (_, i) => (
        <li key={`livre-${i}`}>
          <Link
            href="/apoiadores"
            className="flex h-full min-h-[7.6rem] items-center justify-center rounded-lg border-2 border-dashed border-line px-3 text-center text-sm font-semibold text-muted transition hover:border-brand hover:text-brand"
          >
            Sua marca aqui
          </Link>
        </li>
      ))}
    </ul>
  )
}
