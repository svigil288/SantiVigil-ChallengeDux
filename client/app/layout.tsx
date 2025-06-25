import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import "primeflex/primeflex.css"
import "./globals.css"
import { PrimeReactProvider } from "primereact/api"
import { Sidebar } from "../components/molecules/Sidebar"
import { AppHeader } from "../components/molecules/AppHeader"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ABM Usuarios - Dux Challenge",
  description: "Sistema de gestión de usuarios",
  keywords: ["usuarios", "gestión", "ABM", "admin", "dashboard", "CRUD", "React", "Next.js"],
  authors: [{ name: "Santiago Vigil" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <PrimeReactProvider>
          <div className="h-screen flex flex-column">
            <AppHeader />
            <div className="flex-1 flex overflow-hidden">
              <Sidebar />
              <main className="flex-1 bg-white overflow-hidden">{children}</main>
            </div>
          </div>
        </PrimeReactProvider>
      </body>
    </html>
  )
}
