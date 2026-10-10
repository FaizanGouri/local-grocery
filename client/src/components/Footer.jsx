import { motion } from 'framer-motion';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLeaf,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from 'react-icons/fa';

const footerLinks = {
  Company: ['About Us', 'Careers', 'Blog', 'Press'],
  Support: ['Help Center', 'Safety', 'Cancellation', 'Contact Us'],
  Legal: ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Licenses'],
  Categories: ['Fruits & Vegetables', 'Dairy & Eggs', 'Meat & Seafood', 'Bakery'],
};

const socials = [
  { icon: <FaFacebookF />, href: '#', label: 'Facebook' },
  { icon: <FaTwitter />, href: '#', label: 'Twitter' },
  { icon: <FaInstagram />, href: '#', label: 'Instagram' },
  { icon: <FaYoutube />, href: '#', label: 'YouTube' },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <FaLeaf className="text-white text-lg" />
              </div>
              <span className="text-white text-xl font-bold">GreenCart</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Fresh groceries delivered to your doorstep. Quality produce from
              local farms, available at the tap of a button.
            </p>

            {/* Contact info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-400">
                <FaMapMarkerAlt className="text-green-500 flex-shrink-0" />
                <span>123 Fresh Street, Green City, GC 10001</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FaPhoneAlt className="text-green-500 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FaEnvelope className="text-green-500 flex-shrink-0" />
                <span>hello@greencart.com</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="bg-gray-800/50 rounded-2xl p-8 md:p-10 mb-16 border border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-xl font-bold mb-1">
                Stay Fresh with Our Newsletter
              </h3>
              <p className="text-gray-400 text-sm">
                Weekly deals, seasonal recipes, and new arrivals straight to
                your inbox.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              />
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} GreenCart. All rights reserved.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map((s, i) => (
                <motion.a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:border-green-500 hover:text-white transition-colors duration-300"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>

            {/* Payment icons placeholder */}
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <span className="bg-gray-800 border border-gray-700 rounded px-2 py-1">
                Visa
              </span>
              <span className="bg-gray-800 border border-gray-700 rounded px-2 py-1">
                Mastercard
              </span>
              <span className="bg-gray-800 border border-gray-700 rounded px-2 py-1">
                PayPal
              </span>
              <span className="bg-gray-800 border border-gray-700 rounded px-2 py-1">
                Apple Pay
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;