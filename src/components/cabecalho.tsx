"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoAmigos } from "./logo"

const links = [
  { href: "/pilotos", rotulo: "Álbum" },
  { href: "/equipes", rotulo: "Equipes" },
  { href: "/classificacao", rotulo: "Classificação" },
  { href: "/calendario", rotulo: "Calendário" },
  { href: "/apoiadores", rotulo: "Apoie" },
]

export function Cabecalho() {
  const atual = usePathname()
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2.5">
        <Link href="/" aria-label="Início" className="shrink-0">
          <LogoAmigos className="h-10 text-xl" />
        </Link>
        <nav aria-label="Principal" className="-mr-4 ml-auto overflow-x-auto pr-4">
          <ul className="flex gap-1 whitespace-nowrap">
            {links.map((l) => {
              const ativo = atual === l.href || atual.startsWith(`${l.href}/`)
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={ativo ? "page" : undefined}
                    className={`block rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                      ativo ? "bg-brand text-brand-fg" : "text-muted hover:text-ink"
                    }`}
                  >
                    {l.rotulo}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
