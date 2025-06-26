import type { ReactNode } from "react"
import { Brain, Dna, Zap, Network, Cpu, Microscope } from "lucide-react"

export interface Topic {
  title: string
  description: string
  icon: ReactNode
  href: string
}

export const topics: Topic[] = [
  {
    title: "Artificial Intelligence",
    description: "Exploring how AI is reshaping human cognition, society, and our evolutionary trajectory.",
    icon: <Brain className="h-5 w-5 text-primary" />,
    href: "/topics/ai",
  },
  {
    title: "Biotechnology",
    description: "From CRISPR to synthetic biology, how we're rewriting the code of life and human potential.",
    icon: <Dna className="h-5 w-5 text-primary" />,
    href: "/topics/biotech",
  },
  {
    title: "Transhumanism",
    description: "The philosophical and practical movement toward transcending biological limitations.",
    icon: <Zap className="h-5 w-5 text-primary" />,
    href: "/topics/transhumanism",
  },
  {
    title: "Neural Interfaces",
    description: "Direct brain-computer connections that are revolutionizing how we interact with technology.",
    icon: <Network className="h-5 w-5 text-primary" />,
    href: "/topics/neural-interfaces",
  },
  {
    title: "Quantum Computing",
    description: "How quantum technologies will transform computation and unlock new possibilities.",
    icon: <Cpu className="h-5 w-5 text-primary" />,
    href: "/topics/quantum-computing",
  },
  {
    title: "Longevity Science",
    description: "Research and breakthroughs in extending human healthspan and lifespan.",
    icon: <Microscope className="h-5 w-5 text-primary" />,
    href: "/topics/longevity",
  },
]
