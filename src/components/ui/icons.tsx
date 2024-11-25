import { Loader2, Github, LightbulbIcon, ChromeIcon as Google } from 'lucide-react'
export const Icons = {
    spinner: Loader2,
    gitHub: Github,
    google: Google,
    lightbulb: LightbulbIcon, // Instead of LightbulbIcon as LucideProps
}

export type Icon = keyof typeof Icons

