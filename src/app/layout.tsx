import type { Metadata, Viewport } from "next"
import { Barlow, Saira_Condensed } from "next/font/google"
import Link from "next/link"
import { liga } from "@/lib/liga"
import { Cabecalho } from "@/components/cabecalho"
import { LogoLiga } from "@/components/logo"
import "./globals.css"

const saira = Saira_Condensed({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
  variable: "--font-saira",
})

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
})

export const metadata: Metadata = {
  title: {
    default: `${liga.nome} — Temporada ${liga.temporada}`,
    template: `%s · ${liga.nome}`,
  },
  description: `Temporada ${liga.temporada} do campeonato de kart da galera: pilotos, equipes, classificação e calendário.`,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
}

export const viewport: Viewport = {
  themeColor: "#121216",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${saira.variable} ${barlow.variable}`}>
      <body className="fundo min-h-screen font-sans text-ink antialiased">
        <div className="xadrez h-2" />
        <Cabecalho />
        <main>{children}</main>
        <footer className="mt-24 border-t border-line">
          <div className="zebra h-1.5" />
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <LogoLiga className="h-9 text-lg text-ink" />
            <p>
              {liga.nome} — campeonato de {liga.modalidade.toLowerCase()} entre amigos, temporada {liga.temporada}.
            </p>
            <Link href="/apoiadores" className="font-semibold text-ink hover:text-brand">
              Quero apoiar a temporada
            </Link>
          </div>
          <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-line px-4 py-5 text-xs text-muted sm:flex-row sm:justify-between">
            <p>
              © {new Date().getFullYear()} {liga.nome}
            </p>
            <p>
              Desenvolvido por{" "}
              <a
                href="https://db.app.br"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ink transition-colors hover:text-brand"
              >
                db.app
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
