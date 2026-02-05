"use server"
// Components
import SkillList from "@/components/Layout/SkillList"
// Constants
import { SkillInfo } from "@/constants/types/skills"

export default async function DrowSpells() {
  const data = await fetch("http://localhost:3000/json/drow/skills.json")
  if (!data.ok) {
    throw new Error("Failed to fetch data")
  }
  const skills = (await data.json()) as SkillInfo[]
  return <SkillList skills={skills} />
}
