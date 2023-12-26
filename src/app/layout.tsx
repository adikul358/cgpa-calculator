import "./globals.css"
import type { Metadata } from "next"
import StyledComponentsRegistry from "@/lib/AntdRegistry"

export const metadata: Metadata = {
  title: "CGPA Calculator",
  description: "Calculate your 10-point CGPA using this tool",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
