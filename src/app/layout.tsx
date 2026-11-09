import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Saira_Condensed, Yellowtail } from "next/font/google"
import Link from "next/link"
import { liga } from "@/lib/liga"
import { Cabecalho } from "@/components/cabecalho"
import { LogoLiga } from "@/components/logo"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
})

const saira = Saira_Condensed({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
  variable: "--font-saira",
})

const yellowtail = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yellowtail",
})

export const metadata: Metadata = {
  title: {
    default: `${liga.nome} — Temporada ${liga.temporada}`,
    template: `%s · ${liga.nome}`,
  },
  description: `Temporada ${liga.temporada} do campeonato de kart da galera: resultados, figurinhas, classificação e calendário.`,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
}

export const viewport: Viewport = {
  themeColor: "#0e0f12",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${saira.variable} ${yellowtail.variable}`}>
      <body className="min-h-screen bg-page font-sans text-ink antialiased">
        <Cabecalho />
        <main>{children}</main>
        <footer className="mt-24 bg-black">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <LogoLiga className="h-9 text-lg text-ink" />
            <p>
              {liga.nome} — campeonato de {liga.modalidade.toLowerCase()} entre amigos, temporada {liga.temporada}.
            </p>
            <Link href="/apoiadores" className="font-semibold text-ink hover:text-brand">
              Quero apoiar a temporada
            </Link>
          </div>
          <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-white/10 px-5 py-5 text-xs text-muted sm:flex-row sm:justify-between">
            <p>
              © {new Date().getFullYear()} {liga.nome} · Fotos de pista: Unsplash
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
