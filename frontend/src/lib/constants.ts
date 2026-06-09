export const AGENT_CONFIG = {
  advocate: {
    label: "The Advocate",
    subtitle: "Visionary Investor",
    color: "#00E5FF",
    colorMuted: "rgba(0, 229, 255, 0.1)",
    borderColor: "border-[#00E5FF]/30",
    textColor: "text-[#00E5FF]",
    bgGlow: "shadow-[0_0_60px_-15px_rgba(0,229,255,0.3)]",
  },
  inquisitor: {
    label: "The Inquisitor",
    subtitle: "Forensic Analyst",
    color: "#FF2A2A",
    colorMuted: "rgba(255, 42, 42, 0.1)",
    borderColor: "border-[#FF2A2A]/30",
    textColor: "text-[#FF2A2A]",
    bgGlow: "shadow-[0_0_60px_-15px_rgba(255,42,42,0.3)]",
  },
  arbitrator: {
    label: "The Arbitrator",
    subtitle: "Managing Partner",
    color: "#D4AF37",
    colorMuted: "rgba(212, 175, 55, 0.1)",
    borderColor: "border-[#D4AF37]/30",
    textColor: "text-[#D4AF37]",
    bgGlow: "shadow-[0_0_60px_-15px_rgba(212,175,55,0.3)]",
  },
} as const;

export const EXAMPLE_PROPOSALS = [
  {
    title: "AI-Powered Legal Assistant",
    text: "A SaaS platform that uses GPT-4 to automate contract review for small law firms. We charge $299/month per seat. Our target market is 50,000 small law firms in the US. We believe we can capture 5% market share within 2 years with a 3-person team.",
  },
  {
    title: "Subscription Ice Cubes",
    text: "A direct-to-consumer subscription service delivering locally sourced, artisanal ice cubes to premium cocktail enthusiasts. $29/month for 20 cubes. We believe the $180B global spirits market is underserved in the ice category and high-end consumers will pay a premium for crystal-clear, slow-melting cubes.",
  },
  {
    title: "Decentralized Social Network",
    text: "A blockchain-based social media platform where users own their data and earn tokens for engagement. We'll use Ethereum L2 for transactions and target Gen Z users frustrated with Meta's privacy policies. Revenue comes from a 2% fee on creator transactions. We need $5M seed to build the initial platform.",
  },
] as const;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
