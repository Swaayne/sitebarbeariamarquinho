import type { Metadata } from "next";
import "./globals.css";
import { assetPath } from "@/lib/asset-path";
import { site } from "@/content/site";
export const metadata: Metadata = {
  title: "Barbearia do Marquinhos | Corte e Barba em Indaiatuba",
  description: "Conheça a Barbearia do Marquinhos, no centro de Indaiatuba. Confira os serviços, veja como chegar e agende seu horário pelo WhatsApp.",
  robots: site.draft ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: { title: "Barbearia do Marquinhos — Seu próximo estilo", description: "Corte, barba e personalidade no centro de Indaiatuba. Agende pelo WhatsApp.", type: "website", locale: "pt_BR", siteName: site.name },
  icons: { icon: assetPath("favicon.svg"), shortcut: assetPath("favicon.svg") },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
