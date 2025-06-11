import HeroSection from "../components/HeroSection"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"

export default function MakeupArtistsPage() {
  return (
    <div>
      <HeroSection>
        <div className="bg-white rounded-lg p-4 text-[#FF6B9D] font-semibold text-xl">Make Up Artists</div>
      </HeroSection>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[#FF6B9D] mb-6">Filters</h3>

                {/* Location */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Location</h4>
                  <input type="text" placeholder="Enter Your Location" className="w-full p-2 border rounded" />
                </div>

                {/* Budget */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Budget</h4>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>₹ 500</span>
                    <span>₹ 50,000</span>
                  </div>
                  <Slider defaultValue={[5000]} max={50000} min={500} step={100} />
                </div>

                {/* Makeup Type */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Makeup Type</h4>
                  <div className="space-y-2">
                    {[
                      "Natural makeup",
                      "Airbrush makeup",
                      "Party makeup",
                      "Bridal makeup",
                      "HD makeup",
                      "Minimal makeup",
                      "Eye makeup",
                      "Nude makeup",
                      "Engagement makeup",
                    ].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={type} />
                        <label htmlFor={type} className="text-sm">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ratings */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Ratings</h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={`rating-${rating}`} />
                        <label htmlFor={`rating-${rating}`} className="text-sm">
                          {rating} Star{rating > 1 ? "s" : ""}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Artists Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src="/placeholder.svg?height=250&width=300"
                        alt="Makeup work"
                        width={300}
                        height={250}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white rounded px-2 py-1 text-xs">4.5 ⭐</div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        <Image
                          src="/placeholder.svg?height=40&width=40"
                          alt="Artist"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <h3 className="font-semibold">Avneet Kaur</h3>
                          <p className="text-sm text-gray-600">📍 Delhi</p>
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

            {/* Pagination */}
            <div className="flex justify-center items-center mt-8 space-x-2">
              <Button variant="outline" size="sm">
                ← Back
              </Button>
              <Button size="sm" className="bg-[#FF6B9D] text-white">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                4
              </Button>
              <Button variant="outline" size="sm">
                5
              </Button>
              <Button variant="outline" size="sm">
                Next →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
