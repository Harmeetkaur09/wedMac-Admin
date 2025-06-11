"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./contexts/AuthContext"
import HeroSection from "./components/HeroSection"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#FF6B9D] border-t-transparent"></div>
          <p className="text-gray-600 animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div>
      {/* Hero Section */}
      <HeroSection>
        <div className="bg-white rounded-lg p-6 text-black max-w-4xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Makeup Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bridal">Bridal Makeup</SelectItem>
                <SelectItem value="party">Party Makeup</SelectItem>
                <SelectItem value="casual">Casual Makeup</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Under $100</SelectItem>
                <SelectItem value="mid">$100-$300</SelectItem>
                <SelectItem value="high">$300+</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C] text-white">SEARCH</Button>
          </div>
        </div>
      </HeroSection>

      {/* Makeup Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Bridal Makeup", image: "/placeholder.svg?height=200&width=200" },
              { name: "Party Makeup", image: "/placeholder.svg?height=200&width=200" },
              { name: "Casual Makeup", image: "/placeholder.svg?height=200&width=200" },
              { name: "Special Makeup", image: "/placeholder.svg?height=200&width=200" },
              { name: "Engagement", image: "/placeholder.svg?height=200&width=200" },
              { name: "Pre Wedding", image: "/placeholder.svg?height=200&width=200" },
              { name: "Reception", image: "/placeholder.svg?height=200&width=200" },
              { name: "Cocktail Makeup", image: "/placeholder.svg?height=200&width=200" },
            ].map((category, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 text-center">
                    <h3 className="font-semibold">{category.name}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Profiles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Artist Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((artist) => (
              <Card key={artist} className="overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Artist work"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <Image
                        src="/placeholder.svg?height=50&width=50"
                        alt="Artist"
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="font-semibold">Avneet Kaur</h3>
                        <p className="text-gray-600">Delhi</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Book Now
                      </Button>
                      <Button size="sm" className="flex-1 bg-[#FF6B9D] hover:bg-[#FF5A8C]">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Deals Of The Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </p>
              <div className="flex gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">02</div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">06</div>
                  <div className="text-sm text-gray-600">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">05</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">30</div>
                  <div className="text-sm text-gray-600">Seconds</div>
                </div>
              </div>
              <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C]">Shop Now</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="/placeholder.svg?height=250&width=200"
                alt="Deal 1"
                width={200}
                height={250}
                className="w-full h-64 object-cover rounded-lg"
              />
              <Image
                src="/placeholder.svg?height=250&width=200"
                alt="Deal 2"
                width={200}
                height={250}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
