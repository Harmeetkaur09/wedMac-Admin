import HeroSection from "../../components/HeroSection"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"

export default function ArtistProfilePage() {
  return (
    <div>
      <HeroSection>
        <div className="bg-white rounded-lg p-4 text-[#FF6B9D] font-semibold text-xl">Make Up Artists</div>
      </HeroSection>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Artist Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-1/3">
            <Image
              src="/placeholder.svg?height=400&width=300"
              alt="Avneet Kaur"
              width={300}
              height={400}
              className="w-full rounded-lg"
            />
          </div>

          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">Avneet Kaur</h1>
            <p className="text-gray-600 mb-4">Beauty Therapist</p>
            <p className="text-gray-600 mb-4">📍 Delhi</p>
            <div className="flex items-center mb-6">
              <span className="bg-[#FF6B9D] text-white px-2 py-1 rounded text-sm mr-2">4.5</span>
              <span className="text-gray-600">⭐⭐⭐⭐⭐</span>
            </div>

            {/* Social Media Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button variant="outline" className="border-[#FF6B9D] text-[#FF6B9D]">
                📷 Instagram
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600">
                📘 Facebook
              </Button>
              <Button variant="outline" className="border-green-600 text-green-600">
                📱 WhatsApp
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-600">
                📞 Call
              </Button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">
              Your use of our website is governed by the following terms and conditions ("Terms of Use"), as well as the
              CARDONE CAPITAL Privacy Policy and other operating rules, minimum qualifications and cautions posted
              throughout the website or presented to you individually during the course of your use of the website
              (collectively, the "Terms"). The Terms govern your use of the website and CARDONE CAPITAL reserves the
              right to update or replace the Terms at any time without notice.
            </p>
          </CardContent>
        </Card>

        {/* Reviews Gallery */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Image
                  key={index}
                  src="/placeholder.svg?height=150&width=150"
                  alt={`Review ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Pricing</h2>
            <Accordion type="single" collapsible>
              {Array.from({ length: 5 }).map((_, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>Bridal HD Makeup / ₹ 12,000 per function</AccordionTrigger>
                  <AccordionContent>
                    Detailed pricing information for bridal HD makeup services including preparation, application, and
                    touch-ups.
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Policies and Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Payment Policy</h3>
              <p>Accept Online Payment</p>

              <h3 className="text-xl font-bold mb-4 mt-6">Travel Policy</h3>
              <p>Only Travel Locally</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Products Use</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  "MAC",
                  "Huda Beauty",
                  "Estee Lauder",
                  "Inglot",
                  "NARS",
                  "Charlotte Tilbury",
                  "Color Pop",
                  "Smashbox",
                  "Maybelline",
                  "Makeup Forever",
                  "Loreal",
                  "ColorBar",
                  "PAC",
                  "Laura Mercier",
                  "Too Faced",
                  "Kylie Cosmetics",
                  "LAGirl",
                  "Nykaa",
                  "ELF",
                  "Tarte",
                ].map((brand) => (
                  <div key={brand} className="flex items-center">
                    <span className="text-[#FF6B9D] mr-2">✓</span>
                    {brand}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
