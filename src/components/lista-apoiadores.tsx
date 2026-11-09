/* eslint-disable @next/next/no-img-element -- artes dos apoiadores em public/, já no tamanho certo */
import Link from "next/link"
import { AtSign, Globe, Mail, Phone, Plus } from "lucide-react"
import { liga, type Marca } from "@/lib/liga"

/*
 * Apoiadores em cards: arte da marca em cima (proporção 1067/475, a das artes em public/apoiadores),
 * nome e ramo embaixo e, separados por linha fina, os contatos com ícone.
 * Fecha com um card "Sua marca aqui" que leva para /apoiadores.
 */

/** "5551996071459" → "(51) 99607-1459" */
function formatarTelefone(t: string) {
  const d = t.replace(/^55/, "")
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : t
}

const site = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "")

function Contato({ href, icone: Icone, children }: { href: string; icone: typeof Globe; children: React.ReactNode }) {
  const externo = href.startsWith("http")
  return (
    <li>
      <a
        href={href}
        {...(externo ? { target: "_blank", rel: "noreferrer" } : {})}
        className="flex min-w-0 items-center gap-2 text-xs text-muted transition-colors hover:text-ink"
      >
        <Icone className="size-3.5 shrink-0 text-hot" strokeWidth={2.25} />
        <span className="truncate">{children}</span>
      </a>
    </li>
  )
}

function CardApoiador({ a }: { a: Marca }) {
  const contatos = [
    a.link && <Contato key="site" href={a.link} icone={Globe}>{site(a.link)}</Contato>,
    a.telefone && (
      <Contato key="tel" href={`https://wa.me/${a.telefone}`} icone={Phone}>
        {formatarTelefone(a.telefone)}
      </Contato>
    ),
    a.email && <Contato key="mail" href={`mailto:${a.email}`} icone={Mail}>{a.email}</Contato>,
    ...[a.instagram ?? []].flat().map((ig) => (
      <Contato key={ig} href={`https://instagram.com/${ig}`} icone={AtSign}>
        {ig}
      </Contato>
    )),
  ].filter(Boolean)

  return (
    <article
      title={a.descricao ? `${a.nome} — ${a.descricao}` : a.nome}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-white/25"
    >
      <div className="aspect-[1067/475] overflow-hidden bg-black">
        {a.cartao ? (
          <img src={a.cartao} alt={a.nome} className="size-full object-cover" />
        ) : a.logo ? (
          <img src={a.logo} alt={a.nome} className="size-full bg-[#f4f2ea] object-contain p-6" />
        ) : (
          <span className="flex size-full items-center justify-center font-display text-xl font-black uppercase italic">{a.nome}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4">
          <h3 className="leading-tight font-bold">{a.nome}</h3>
          {a.ramo && <p className="mt-1 text-xs leading-snug text-muted">{a.ramo}</p>}
        </div>
        {/* mt-auto: contatos alinhados no pé, mesmo com nomes de alturas diferentes */}
        {contatos.length > 0 && <ul className="mt-auto space-y-1.5 border-t border-line pt-3">{contatos}</ul>}
      </div>
    </article>
  )
}

/** Cards dos apoiadores + "Sua marca aqui" no fim. */
export function ListaApoiadores() {
  return (
    // 4 apoiadores + "Sua marca aqui" = uma linha de 5 no desktop; ao entrar apoiador novo, rever as colunas
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
      {liga.apoiadores.map((a) => (
        <li key={a.nome}>
          <CardApoiador a={a} />
        </li>
      ))}
      <li>
        <Link
          href="/apoiadores"
          className="flex h-full min-h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line px-4 text-center text-muted transition hover:border-brand hover:text-brand"
        >
          <Plus className="size-6" strokeWidth={2} />
          <span className="text-sm font-bold">Sua marca aqui</span>
          <span className="text-xs">Apoie a temporada {liga.temporada}</span>
        </Link>
      </li>
    </ul>
  )
}
