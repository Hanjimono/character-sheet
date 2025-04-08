"use client"
import WallDecorated from "@/ui/Layout/Decorators/WallDecorated"
import Text from "@/ui/Presentation/Text"
import Title from "@/ui/Presentation/Title"

export default function MainPage() {
  return (
    <WallDecorated>
      <Title size={1} uppercase>
        Ui-boilerplate
      </Title>
      <Text type="paragraph">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
        turpis sit amet nunc consectetur ultricies. Sed et eros eget orci
        tristique ultricies. Donec auctor, nunc nec ultricies ultrices, nunc
        libero fermentum ex, nec ultricies nunc libero at nulla. Nulla facilisi.
        Proin in nisi nec nunc scelerisque ultricies. Nullam nec turpis sit amet
        nunc consectetur ultricies. Sed et eros eget or
      </Text>
    </WallDecorated>
  )
}
