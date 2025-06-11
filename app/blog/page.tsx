import HeroSection from "../components/HeroSection"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

export default function BlogPage() {
  return (
    <div>
      <HeroSection>
        <div className="bg-white rounded-lg p-4 text-[#FF6B9D] font-semibold text-xl">Blog</div>
      </HeroSection>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Blog Post */}
            <Card className="mb-8">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-2 text-sm text-gray-500">
                      <span>👁️ 100</span>
                      <span>❤️ 50</span>
                      <span>💬 25</span>
                      <span>👤 10</span>
                    </div>
                  </div>

                  <h1 className="text-2xl font-bold mb-4">Growing a distributed product design team.</h1>

                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <span>Jon Blomqvist</span>
                    <span className="mx-2">•</span>
                    <span>25 Jan 2022</span>
                  </div>

                  <p className="text-gray-700 mb-6">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit porttitor, felis lorem suscipit aliquam sit
                    non sed eleifend faucibus, sapien elementum facilisis nunc magna vehicula est. Massa Lorem bibendum
                    mauris magna lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris
                    lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem
                    bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris.
                  </p>

                  <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <p className="italic">
                      "Ullamcorper interdum tortor gravida semectus turpis vulputate semper eu, vel convallis class
                      imperdiet hac dictum convallis cursus, phasellus odio cubilia facilisis magna et sodales."
                    </p>
                    <p className="text-sm text-gray-600 mt-2">- Great Awesome CEO</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Interior design"
                      width={300}
                      height={200}
                      className="w-full rounded-lg"
                    />
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Modern room"
                      width={300}
                      height={200}
                      className="w-full rounded-lg"
                    />
                  </div>

                  <p className="text-gray-700 mb-6">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit porttitor, felis lorem suscipit aliquam sit
                    non sed eleifend faucibus, sapien elementum facilisis nunc magna vehicula est. Massa Lorem bibendum
                    mauris magna lorem bibendum mauris lorem bibendum mauris lorem bibendum mauris lorem bibendum
                    mauris.
                  </p>

                  {/* Tags */}
                  <div className="flex gap-2 mb-6">
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Design</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Research</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Presentation</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Data</span>
                  </div>

                  {/* Social Share */}
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-sm text-gray-600">Share:</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        👍
                      </Button>
                      <Button size="sm" variant="outline">
                        💬
                      </Button>
                      <Button size="sm" variant="outline">
                        🔗
                      </Button>
                      <Button size="sm" variant="outline">
                        📧
                      </Button>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center border-t pt-6">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" />
                      <AvatarFallback>JB</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Jon Blomqvist</h3>
                      <p className="text-sm text-gray-600">Product Designer at Webflow Designer</p>
                      <Button size="sm" className="mt-2 bg-[#FF6B9D] hover:bg-[#FF5A8C]">
                        Follow
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">3 comments</h3>

                {/* Comments */}
                <div className="space-y-6">
                  {[
                    {
                      name: "Jason",
                      date: "25 Jan 2022",
                      comment:
                        "Lorem ipsum dolor sit amet consectetur adipiscing elit porttitor, felis lorem suscipit aliquam sit non sed eleifend faucibus, sapien elementum facilisis nunc magna vehicula est.",
                    },
                    {
                      name: "Mathew",
                      date: "25 Jan 2022",
                      comment:
                        "Lorem ipsum dolor sit amet consectetur adipiscing elit porttitor, felis lorem suscipit aliquam sit non sed eleifend faucibus, sapien elementum facilisis nunc magna vehicula est.",
                    },
                    {
                      name: "Andrew",
                      date: "25 Jan 2022",
                      comment:
                        "Lorem ipsum dolor sit amet consectetur adipiscing elit porttitor, felis lorem suscipit aliquam sit non sed eleifend faucibus, sapien elementum facilisis nunc magna vehicula est.",
                    },
                  ].map((comment, index) => (
                    <div key={index} className="border-b pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{comment.name}</h4>
                        <span className="text-sm text-gray-500">{comment.date}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Add comment</h4>
                  <textarea className="w-full p-3 border rounded-lg" rows={4} placeholder="Write your comment..." />
                  <Button className="mt-3 bg-[#FF6B9D] hover:bg-[#FF5A8C]">Post Comment</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Popular Topics</h3>
                <div className="space-y-2">
                  {["Life Style", "Healthy", "Technology", "Education", "Politics", "Design"].map((topic) => (
                    <Button key={topic} variant="outline" size="sm" className="w-full justify-start">
                      {topic}
                    </Button>
                  ))}
                </div>

                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Increased Range, Faster Charge</h4>
                  <Image
                    src="/placeholder.svg?height=150&width=200"
                    alt="Featured post"
                    width={200}
                    height={150}
                    className="w-full rounded-lg mb-4"
                  />
                  <p className="text-sm text-gray-600">Increased Range, Faster Charge</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
