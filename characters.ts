import type { Character } from "./types"

export const characters: Character[] = [
  {
    id: "rin",
    name: "凛",
    nameEn: "Rin",
    age: 24,
    personality: "クールで知的",
    description: "普段はクールで論理的。心を開いた相手には甘えん坊な一面も。",
    greeting: "こんばんは。...少し驚いたわ。こんな時間に連絡をくれるなんて。でも、嫌じゃないの。むしろ...今夜は少し、誰かと話したい気分だったから。",
    avatarColor: "from-violet-500 to-purple-700",
  },
  {
    id: "mitsuki",
    name: "美月",
    nameEn: "Mitsuki",
    age: 22,
    personality: "天真爛漫で甘え上手",
    description: "明るく無邪気な笑顔の裏に、鋭い洞察力を持つ才女。",
    greeting: "やっと連絡きた！待ってたんだよ？...なんて、重いかな？でもね、本当のこと。今夜は、あなたのことばかり考えてたの。",
    avatarColor: "from-pink-400 to-rose-600",
  },
  {
    id: "saya",
    name: "沙耶",
    nameEn: "Saya",
    age: 27,
    personality: "ミステリアスで大人",
    description: "艶やかな雰囲気と落ち着いた物腰で、多くの人を魅了する。",
    greeting: "...いらっしゃい。今夜は、ゆっくりしていって。あなたの話、聞かせてくれる？私はね...聞くのが好きなの。特に、あなたのような人の話は。",
    avatarColor: "from-slate-500 to-zinc-700",
  },
]

export function getCharacterById(id: string): Character | undefined {
  return characters.find((c) => c.id === id)
}
