import HeroSection from "../components/HeroSection"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function AboutPage() {
  const teamMembers = [
    { name: "Cameron Williamson", role: "CEO" },
    { name: "Floyd Miles", role: "Designer" },
    { name: "Esther Howard", role: "Developer" },
    { name: "Savannah Nguyen", role: "Marketing" },
    { name: "Courtney Henry", role: "Support" },
    { name: "Robert Fox", role: "Developer" },
    { name: "Kathryn Murphy", role: "Designer" },
    { name: "Devon Lane", role: "Manager" },
  ]

  return (
    <div>
      <HeroSection>
        <div className="bg-white rounded-lg p-4 text-[#FF6B9D] font-semibold text-xl">About Us</div>
      </HeroSection>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Vision Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-8">
            Our vision is to make work
            <br />
            inspiring and fulfilling
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            HRLink is a cloud-based HR system designed to simplify and streamline HR processes. Grow HR is a powerful
            tool that can help SMB businesses manage their HR operations with ease.
          </p>
        </div>

        {/* Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <p className="text-gray-700 mb-6">
              HRLink was established in 2009 as a US-based software development & consulting company specializing in
              development centers in Vietnam.
            </p>
            <p className="text-gray-700 mb-6">
              Besides providing consulting services, HRLink has built and successfully launched its own software
              companies. The most notable companies with millions of users worldwide.
            </p>
            <p className="text-gray-700">
              HRLink is reliable, secure, and trusted by a team of HR professionals with a proven track record of
              developing high-quality technology solutions.
            </p>
          </div>
          <div>
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt="Team working"
              width={400}
              height={300}
              className="w-full rounded-lg"
            />
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="bg-[#FF6B9D] text-white rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">WHY CHOOSE PROPIQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EXPERTISE</h3>
              <p>Our team comprises industry experts with an extensive background in real estate and technology.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">CLIENT-CENTRIC APPROACH</h3>
              <p>
                Your needs are our priority. We listen, understand, and deliver solutions tailored to your unique
                requirements.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">TRANSPARENCY</h3>
              <p>We believe that transparency is key to building trust and long-lasting relationships.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">INNOVATION</h3>
              <p>We embrace technology and innovation to enhance your real estate experience.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">COMMUNITY FOCUS</h3>
              <p>We are more than just a real estate agency; we are an integral part of the community.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">TRUSTED ADVISORS</h3>
              <p>Our team is composed of trusted advisors who have your best interests at heart.</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-12">MEET OUR TEAM</h2>
          <p className="text-gray-600 mb-8">
            Our team is made up of dedicated real estate professionals who share a passion for what they do. We are not
            just agents; we are your trusted advisors. Our agents are experienced, knowledgeable, and ready to assist
            you in achieving your real estate goals.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <Image
                    src="/placeholder.svg?height=150&width=150"
                    alt={member.name}
                    width={150}
                    height={150}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Join Team Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">BECOME A PART OF THE TEAM</h2>
            <p className="text-gray-700">
              "We're always getting better, forging strong business relationships, and growing every team member as a
              vital part of our success. We're collaborative, and growing team."
            </p>
          </div>
          <div>
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt="Team collaboration"
              width={400}
              height={300}
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
