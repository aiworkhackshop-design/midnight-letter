export interface Character {
  id: string
  name: string
  nameEn: string
  age: number
  personality: string
  description: string
  greeting: string
  avatarColor: string
}

export interface Message {
  id: string
  content: string
  sender: "user" | "character"
  timestamp: Date
}

export interface ChatState {
  messages: Message[]
  remainingMessages: number
  isPremium: boolean
}
