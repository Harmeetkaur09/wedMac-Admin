import HeroSection from "../components/HeroSection"

export default function TermsPage() {
  return (
    <div>
      <HeroSection>
        <div className="bg-white rounded-lg p-4 text-[#FF6B9D] font-semibold text-xl">Terms and Conditions</div>
      </HeroSection>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-8">
            Your use of our website is governed by the following terms and conditions ("Terms of Use"), as well as the
            CARDONE CAPITAL Privacy Policy and other operating rules, minimum qualifications and cautions posted
            throughout the website or presented to you individually during the course of your use of the website
            (collectively, the "Terms"). The Terms govern your use of the website and CARDONE CAPITAL reserves the right
            to update or replace the Terms at any time without notice. You are responsible for reviewing these Terms on
            a regular basis. Your continued use of the website following the posting of any changes to the Terms
            constitutes acceptance of those changes. If at any time you do not want to be bound by these Terms, you must
            immediately discontinue use of the website and close your account.
          </p>

          <h2 className="text-2xl font-bold mb-4">Intended Use of Website</h2>
          <p className="text-gray-700 mb-6">
            CARDONE CAPITAL is not a dealer or placement agent. At no time does CARDONE CAPITAL offer, broker, advise,
            purchase, sell or otherwise transact in securities regulated by the SEC or federal or state law. CARDONE
            CAPITAL does not accept, hold or transfer cash or securities. CARDONE CAPITAL does not guarantee any Company
            or investment vehicle will achieve any level of success or that any proposed investment will achieve any
            level of success.
          </p>

          <h2 className="text-2xl font-bold mb-4">User Registration</h2>
          <p className="text-gray-700 mb-6">
            If you are accepting the Terms on behalf of an organization or entity, rather than in an individual
            capacity, you represent and warrant that you are authorized to accept the Terms on behalf of that
            organization or entity and to bind them to these Terms (in which case, the references to "you" and "your" in
            these Terms, except for in this sentence, refer to that organization or entity).
          </p>

          <h2 className="text-2xl font-bold mb-4">Registered Account Obligations</h2>
          <p className="text-gray-700 mb-6">
            The registered user account is personal to the person that may use the account and it may not be transferred
            to anyone else.
          </p>

          <h2 className="text-2xl font-bold mb-4">Content Use Limitations</h2>
          <p className="text-gray-700 mb-6">
            Your use of the website and its videos, webinars, images, infographics, alerts, text, articles, assessments,
            checklists, forms, ratings, design, data, software, sound, photographs, graphics, applications, interactive
            features, and all other content or materials available on or through the website ("Content") may only be
            used for the purposes expressly authorized by CARDONE CAPITAL.
          </p>

          <h2 className="text-2xl font-bold mb-4">Prospective Investor Accounts</h2>
          <p className="text-gray-700 mb-6">
            Any person or entity that is considering making an investment with a Company that posts its fundraising
            plans on the website, or after the fundraising plan becomes available through the website, becomes an
            investor, does so at their own risk and such investment carries risk that you may lose your entire
            investment.
          </p>
        </div>
      </div>
    </div>
  )
}
