import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HelloDoc",
  description: "Sistema de agendamento médico",
  icons: {
    icon: '/favicon.svg'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* Script para verificar a URL da API */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Garantir que requisições não vão para localhost
              window.NEXT_PUBLIC_API_URL = "https://nextjs-calendar-production.up.railway.app";
              // Verificar localStorage e restaurar configuração se necessário
              try {
                if (localStorage.getItem('api_url')) {
                  console.log("Restaurando URL da API salva:", localStorage.getItem('api_url'));
                }
              } catch (e) {
                console.error("Erro ao acessar localStorage:", e);
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
