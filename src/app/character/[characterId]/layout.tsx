import Header from "@/components/Layout/Header"

const THEMES = {
  "1": "warlock",
  "2": "wizard"
}

export default function layout({
  children,
  params
}: {
  children: React.ReactNode
  params: { characterId: string }
}) {
  return (
    <div
      className="w-full h-full character-sheet"
      data-theme={THEMES[params.characterId as keyof typeof THEMES]}
    >
      <Header characterId={Number(params.characterId)} />
      {children}
    </div>
  )
}
