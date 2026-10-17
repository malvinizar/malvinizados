import type { Metadata, Viewport } from "next";
import { Lilita_One, Nunito } from "next/font/google";
import { Background } from "@/components/layout/Background";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const lilita = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lilita",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MalvinizAR · La trivia de Malvinas",
  description: "Trivia educativa sobre Malvinas para estudiantes secundarios. Girá la ruleta, respondé y llená el Malvinómetro.",
};

export const viewport: Viewport = {
  themeColor: "#0f2550",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${lilita.variable} ${nunito.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <Background />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
