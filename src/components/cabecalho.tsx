"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { liga } from "@/lib/liga"
import { LogoLiga } from "./logo"

const links = [
  { href: "/", rotulo: "Início" },
  { href: "/pilotos", rotulo: "Álbum" },
  { href: "/classificacao", rotulo: "Classificação" },
  { href: "/calendario", rotulo: "Calendário" },
  { href: "/fotos", rotulo: "Fotos" },
  { href: "/apoiadores", rotulo: "Apoie" },
]

const ativo = (atual: string, href: string) => (href === "/" ? atual === "/" : atual === href || atual.startsWith(`${href}/`))

/**
 * Desktop: barra flutuante em vidro escuro com os links.
 * Celular: logo grande no canto + botão de menu que abre a tela cheia.
 * Na página do piloto o celular não tem cabeçalho (a página usa a tela inteira e traz os próprios botões).
 */
export function Cabecalho() {
  const atual = usePathname()
  const [aberto, setAberto] = useState(false)
  const paginaPiloto = /^\/pilotos\/[^/]+$/.test(atual)

  // Fecha ao navegar e trava a rolagem enquanto o menu está aberto.
  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [aberto])

  return (
    <>
      <header className={`sticky top-0 z-40 px-3 pt-3 ${paginaPiloto ? "max-md:hidden" : ""}`}>
        <div className={`vidro-claro ${paginaPiloto ? "vidro-escuro" : ""} mx-auto flex max-w-6xl items-center gap-4 rounded-lg py-2 pr-2 pl-3 md:py-1 md:pr-5`}>
          <Link href="/" aria-label="Início" className="shrink-0">
            <LogoLiga className="h-11 text-xl md:h-10 md:text-xl" />
          </Link>

          <nav aria-label="Principal" className="ml-auto hidden md:block">
            <ul className="flex gap-7 whitespace-nowrap">
              {links.slice(1).map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={ativo(atual, l.href) ? "page" : undefined}
                    className={`relative block py-2 text-[0.62rem] font-bold tracking-[0.16em] uppercase transition-colors ${
                      ativo(atual, l.href)
                        ? "text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {l.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setAberto(true)}
            aria-label="Abrir menu"
            aria-expanded={aberto}
            className="ml-auto flex size-11 items-center justify-center rounded-xl bg-white/10 text-ink transition hover:bg-white/15 md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {/* Menu do celular: tela cheia */}
      {aberto && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col bg-page md:hidden">
          <div className="flex items-center justify-between px-6 pt-6">
            <Link href="/" onClick={() => setAberto(false)} aria-label="Início">
              <LogoLiga className="h-11 text-xl" />
            </Link>
            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar menu"
              className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-ink"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav aria-label="Principal" className="flex-1 px-6 pt-10">
            <ul>
              {links.map((l, i) => (
                <li key={l.href} className="border-b border-line">
                  <Link
                    href={l.href}
                    onClick={() => setAberto(false)}
                    aria-current={ativo(atual, l.href) ? "page" : undefined}
                    className={`flex items-baseline gap-4 py-4 text-3xl font-extrabold tracking-tight ${
                      ativo(atual, l.href) ? "text-brand" : "text-ink"
                    }`}
                  >
                    <span className="font-num text-sm font-black text-muted tabular-nums">0{i + 1}</span>
                    {l.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-6 pb-8 text-sm text-muted">
            <p>
              {liga.nome} · Temporada {liga.temporada}
            </p>
            <a href="https://db.app.br" target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs">
              Desenvolvido por db.app <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      )}
    </>
  )
}
