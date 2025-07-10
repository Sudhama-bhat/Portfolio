import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sudhama Bhat - Full Stack Developer | DevOps Enthusiast",
  description:
    "Portfolio of Sudhama Bhat, a passionate Full Stack Developer and DevOps enthusiast from Kundapur, Karnataka, India. Specializing in React.js, Node.js, and modern web technologies.",
  keywords: "Sudhama Bhat, Full Stack Developer, DevOps, React.js, Node.js, Portfolio, Web Developer",
  authors: [{ name: "Sudhama Bhat" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Sudhama Bhat - Full Stack Developer",
    description: "Portfolio of Sudhama Bhat, a passionate Full Stack Developer and DevOps enthusiast.",
    type: "website",
    locale: "en_US",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
