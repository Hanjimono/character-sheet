import { Open_Sans, Roboto } from "next/font/google"

export const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"]
})

export const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"]
})
