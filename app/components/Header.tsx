import Link from "next/link"

export default function Header() {
  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#FF6B9D] text-white text-center py-2 text-sm">
        Get $20 Off Your First Purchase - Shop Now & Save!
      </div>

      {/* Main Navigation */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <div className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-[#FF6B9D] px-3 py-2 text-sm font-medium">
                Service
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-[#FF6B9D] px-3 py-2 text-sm font-medium">
                About Us
              </Link>
              <Link href="/portfolio" className="text-gray-700 hover:text-[#FF6B9D] px-3 py-2 text-sm font-medium">
                Portfolio
              </Link>
              <Link href="/makeup-artists" className="text-gray-700 hover:text-[#FF6B9D] px-3 py-2 text-sm font-medium">
                Makeup Artist Pages
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-[#FF6B9D] px-3 py-2 text-sm font-medium">
                Contact
              </Link>
              <Link href="/faq" className="text-gray-700 hover:text-[#FF6B9D] px-3 py-2 text-sm font-medium">
                Faq
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
