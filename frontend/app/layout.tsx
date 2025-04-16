import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agenda • Web",
  description: "Sistema de agendamento online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
          type="image/x-icon"
          sizes="any"
        />
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
