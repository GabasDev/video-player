// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Carrega fontes com variáveis CSS
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap", // melhora performance e evita flash de fontes
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

// Metadados para SEO e usabilidade
export const metadata: Metadata = {
  title: {
    default: "Nome do seu Projeto",
    template: "%s | Nome do seu Projeto",
  },
  description: "Aplicativo moderno construído com Next.js 14 e Tailwind CSS.",
  authors: [{ name: "Seu Nome ou Empresa", url: "https://seudominio.com" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          bg-white 
          text-black 
          dark:bg-[#111] 
          dark:text-white
        `}
      >
        {children}
      </body>
    </html>
  );
}
