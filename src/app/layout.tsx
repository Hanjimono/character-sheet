// components
import Initializer from "@/components/Helpers/Initializer"
import TRPCWrapper from "@/components/Helpers/TRPCWrapper"
// constants
import { openSans } from "@/constants/fonts"
// ui
import Foundation from "@/ui/Layout/Foundation"
import Beam from "@/ui/Layout/Beam"
import Frame from "@/ui/Layout/Frame"
// types and styles
import "./global.css"
import Header from "@/components/Layout/Header"
import Stack from "@/ui/Layout/Stack"

export const metadata = {
  title: "DnD character sheet",
  description: "A simple DnD character sheet"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/fontawesome.min.css"
          integrity="sha512-B46MVOJpI6RBsdcU307elYeStF2JKT87SsHZfRSkjVi4/iZ3912zXi45X5/CBr/GbCyLx6M1GQtTKYRd52Jxgw=="
        />
      </head>
      <body className={openSans.className}>
        <TRPCWrapper>
          <Foundation>
            <Stack className="overflow-hidden h-full" gap="none">
              <Frame className="main-content">
                <Header />
                {children}
              </Frame>
            </Stack>
          </Foundation>
          <Initializer />
        </TRPCWrapper>
      </body>
    </html>
  )
}
