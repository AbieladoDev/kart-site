import type { Metadata } from "next"
import Link from "next/link"
import { grid, totalPilotos, ultimaEtapa } from "@/lib/campeonato"
import { liga } from "@/lib/liga"
import { FigurinhaFrente } from "@/components/figurinha"
import { FigurinhaViva } from "@/components/figurinha-viva"
import { CompartilharWhats } from "@/components/compartilhar-whats"
import { FotoFundo } from "@/components/visual"

export const metadata: Metadata = { title: "Álbum de figurinhas" }

export default function Album() {
  return (
    <>
      <section className="relative mx-3 mt-4 overflow-hidden rounded-[2rem]">
        <FotoFundo src="/fotos/capacete.jpg" posicao="50% 30%" veu="bg-gradient-to-r from-page/95 via-page/75 to-page/20" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <p className="text-[0.7rem] font-bold tracking-[0.2em] text-muted uppercase">Temporada {liga.temporada}</p>
          <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Álbum de <span className="text-hot">figurinhas</span>
          </h1>
          <p className="mt-4 max-w-md text-ink/75">
            {totalPilotos} pilotos, na ordem da classificação. O número grande é o kart de cada um
            {ultimaEtapa ? ` na corrida de ${ultimaEtapa.data}` : ""} — muda a cada sessão. Toque numa figurinha para
            ver os números e baixar.
          </p>
          <CompartilharWhats
            className="mt-6"
            rotulo="Mandar o álbum no WhatsApp"
            texto={`Álbum de figurinhas da ${liga.nome} ${liga.temporada}: ${totalPilotos} pilotos 🏁`}
          />
        </div>
      </section>

      <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-x-4 gap-y-8 px-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {grid.map((p) => (
          <li key={p.slug}>
            <Link href={`/pilotos/${p.slug}`} aria-label={`Figurinha de ${p.nome}`} className="block">
              <FigurinhaViva>
                <FigurinhaFrente p={p} />
              </FigurinhaViva>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
