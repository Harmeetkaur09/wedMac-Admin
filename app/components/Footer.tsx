export default function Footer() {
  return (
    <footer className="bg-[#FF6B9D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <span className="mr-2">📞</span>
                619-393-4981 Ext. 101
              </p>
              <p className="flex items-center">
                <span className="mr-2">✉️</span>
                Invest@AtlasPS.Com
              </p>
              <p className="flex items-center">
                <span className="mr-2">📍</span>
                501 West Broadway, Suite 800,
                <br />
                San Diego, CA 92101
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <div className="space-y-2">
              <p>
                <a href="/faq" className="hover:underline">
                  FAQs
                </a>
              </p>
              <p>
                <a href="/disclosures" className="hover:underline">
                  Disclosures
                </a>
              </p>
              <p>
                <a href="/terms" className="hover:underline">
                  Terms And Conditions
                </a>
              </p>
              <p>
                <a href="/privacy" className="hover:underline">
                  Privacy Policy
                </a>
              </p>
              <p>
                <a href="/submit-deals" className="hover:underline">
                  Submit Deals
                </a>
              </p>
              <p>
                <a href="/media-kit" className="hover:underline">
                  Media Kit
                </a>
              </p>
            </div>
          </div>

          {/* Investment Disclosure */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Investment Disclosure</h3>
            <p className="text-sm">
              When you invest with Atlas, you are more than a number, you are a partner. As a partner with us, you can
              access opportunities usually reserved only for the largest institutional investors. You can access a team
              driven only by excellence and results. You can access real estate investment opportunities designed with
              you in mind.
            </p>
          </div>
        </div>

        <div className="border-t border-pink-400 mt-8 pt-8 text-center">
          <p>&copy; ATLAS 2022 All Right Reserved</p>
        </div>
      </div>
    </footer>
  )
}
