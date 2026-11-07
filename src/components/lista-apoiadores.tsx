import Link from "next/link"
import { liga, type Marca } from "@/lib/liga"

/*
 * Apoiadores como placas de beira de pista: placa clara, larga e baixa, logo no centro e
 * zebra vermelha/branca no pé. Sem texto visível — o nome vai no alt/title.
 * Logo precisa funcionar em fundo claro (por isso a db.app usa a versão azul).
 */
const PLACA = "flex h-full flex-col overflow-hidden rounded-lg bg-[#f4f2ea] shadow-[0_10px_20px_-12px_rgba(0,0,0,0.8)]"

/** "5551996071459" → "(51) 99607-1459" */
function formatarTelefone(t: string) {
  const d = t.replace(/^55/, "")
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : t
}

/** Placa com o cartão inteiro e frase, nome e contatos embaixo — mesmo tamanho das outras (4 por linha). */
function PlacaCartao({ a }: { a: Marca }) {
  return (
    <div title={a.descricao ? `${a.nome} — ${a.descricao}` : a.nome} className={PLACA}>
      {/* Mesma altura em todos, na proporção da arte da BiehlBier (a mais larga), que aparece
          inteira. As outras encolhem para caber, sem corte, sobre fundo preto. */}
      <span className="block aspect-[1067/475] w-full bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a.cartao} alt={a.nome} className="size-full object-contain" />
      </span>
      <span className="zebra block h-2.5" aria-hidden />
      <div className="flex flex-1 flex-col items-center px-2 py-2 text-center leading-snug text-[#121216]">
        {a.frase && <span className="w-full whitespace-pre-line text-xs font-semibold italic text-[#55555f]">{a.frase}</span>}
        {!a.ocultarNome && (
          <span className="w-full truncate font-display text-sm font-black uppercase italic leading-tight">{a.nome}</span>
        )}
        {a.telefone && (
          <a href={`https://wa.me/${a.telefone}`} target="_blank" rel="noreferrer" className="text-xs font-semibold hover:underline">
            {formatarTelefone(a.telefone)}
          </a>
        )}
        {a.email && (
          <a href={`mailto:${a.email}`} className="w-full truncate text-xs font-semibold hover:underline">
            {a.email}
          </a>
        )}
        {a.instagram && (
          <span className="flex flex-wrap justify-center gap-x-2">
            {[a.instagram].flat().map((ig) => (
              <a
                key={ig}
                href={`https://instagram.com/${ig}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold hover:underline"
              >
                @{ig}
              </a>
            ))}
          </span>
        )}
      </div>
    </div>
  )
}

function Placa({ a }: { a: Marca }) {
  if (a.cartao) return <PlacaCartao a={a} />
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
