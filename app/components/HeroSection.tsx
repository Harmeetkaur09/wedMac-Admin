import type { ReactNode } from "react"

interface HeroSectionProps {
  children: ReactNode
}

export default function HeroSection({ children }: HeroSectionProps) {
  return (
    <div className="relative h-96 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{
          backgroundImage: `url('/placeholder.svg?height=400&width=800')`,
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Make Your Interior More
          <br />
          Minimalistic & Modern
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Turn your room with panto into a lot more minimalist
          <br />
          and modern with ease and speed
        </p>
        {children}
      </div>
    </div>
  )
}
