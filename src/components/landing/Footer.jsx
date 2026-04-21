import { Wallet, Heart } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Updates', href: '#updates' },
  ],
  Company: [
    { label: 'About', href: '#about' },
    { label: 'Blog', href: '#blog' },
    { label: 'Careers', href: '#careers' },
  ],
  Support: [
    { label: 'Help Center', href: '#help' },
    { label: 'Contact', href: '#contact' },
    { label: 'Privacy', href: '#privacy' },
  ],
}

function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl">ExpenseTracker</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Smart financial tracking for better money management.
            </p>
            <p className="text-gray-500 text-sm">
              Made with{' '}
              <Heart className="w-4 h-4 inline text-red-500 fill-current" />{' '}
              in Rwanda
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ExpenseTracker. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms
              </a>
              <span className="text-gray-700">•</span>
              <a href="#privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy
              </a>
              <span className="text-gray-700">•</span>
              <a href="#cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer