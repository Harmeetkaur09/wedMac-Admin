import HeroSection from "../components/HeroSection"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

export default function ContactPage() {
  return (
    <div>
      <HeroSection>
        <div className="bg-white rounded-lg p-4 text-[#FF6B9D] font-semibold text-xl">Contact Us</div>
      </HeroSection>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contact Form */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">First name</label>
                <Input placeholder="First name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last name</label>
                <Input placeholder="Last name" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input type="email" placeholder="Ex JohnDoe214@gmail.com" />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">What can we help you with ?</label>
              <Textarea placeholder="Type here your message" rows={4} />
            </div>

            <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C] text-white px-8 py-3">join mailing list</Button>
          </div>

          {/* Customer Service Representatives */}
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-8 relative">
              <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm">Hello There !</div>
              <h3 className="text-xl font-semibold mb-6">We are always here to help</h3>
              <div className="flex justify-center space-x-4">
                <Image
                  src="/placeholder.svg?height=150&width=120"
                  alt="Customer service representative"
                  width={120}
                  height={150}
                  className="rounded-lg"
                />
                <Image
                  src="/placeholder.svg?height=150&width=120"
                  alt="Customer service representative"
                  width={120}
                  height={150}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
