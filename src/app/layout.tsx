import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "INIA — Instituto Nacional de Identificação Acadêmica", template: "%s · INIA" },
  description:
    "Plataforma independente e demonstrativa para gerenciamento e visualização de carteirinhas estudantis digitais. Projeto fictício, sem validade oficial.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#060A13", viewportFit: "cover", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
