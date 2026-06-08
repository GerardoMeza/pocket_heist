const ADJECTIVES = [
  "Crimson", "Shadow", "Silver", "Phantom", "Iron",
  "Onyx", "Cobalt", "Scarlet", "Obsidian", "Amber",
  "Ivory", "Jade", "Rogue", "Stealth", "Neon",
]

const NOUNS = [
  "Wolf", "Fox", "Vault", "Blade", "Ghost",
  "Hawk", "Viper", "Cipher", "Nova", "Wraith",
  "Storm", "Raven", "Cobra", "Lynx", "Specter",
]

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateCodename(): string {
  const wordCount = Math.random() < 0.5 ? 2 : 3
  if (wordCount === 2) {
    return pick(ADJECTIVES) + pick(NOUNS)
  }
  return pick(ADJECTIVES) + pick(NOUNS) + pick(NOUNS)
}
