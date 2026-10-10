import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaApple, FaGooglePlay, FaStar, FaShieldAlt, FaBolt } from 'react-icons/fa';

const AppDownload = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const badges = [
    { icon: <FaStar />, label: '4.9 Rating' },
    { icon: <FaBolt />, label: '10-min Delivery' },
    { icon: <FaShieldAlt />, label: '100% Secure' },
  ];

  return (
    <section
      ref={sectionRef}
      id="download"
      className="py-20 px-4 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-white/15 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              📱 Available Now
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Shop Smarter with
              <br />
              the <span className="text-emerald-300">GreenCart</span> App
            </h2>

            <p className="text-green-100/80 text-lg mb-8 max-w-md leading-relaxed">
              Get exclusive app-only deals, real-time order tracking, and
              personalized recommendations — all in your pocket.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-4 mb-10">
              {badges.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  <span className="text-emerald-300">{b.icon}</span>
                  {b.label}
                </motion.div>
              ))}
            </div>

            {/* Store Buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="#"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center gap-3 bg-white text-gray-800 px-6 py-3.5 rounded-2xl hover:shadow-xl hover:shadow-white/20 transition-all duration-300 group"
              >
                <FaApple className="text-2xl group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 leading-none">
                    Download on the
                  </p>
                  <p className="font-bold text-base leading-tight">App Store</p>
                </div>
              </motion.a>

              <motion.a
                href="#"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3.5 rounded-2xl hover:bg-white/20 transition-all duration-300 group"
              >
                <FaGooglePlay className="text-2xl group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-green-200 leading-none">
                    Get it on
                  </p>
                  <p className="font-bold text-base leading-tight">
                    Google Play
                  </p>
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* Right — phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: 30 }}
            animate={isVisible ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 bg-emerald-400/20 rounded-[3rem] blur-2xl scale-110" />

              {/* Phone frame */}
              <div className="relative w-64 md:w-72 bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl border border-white/10">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-20" />

                {/* Screen */}
                <div className="bg-gradient-to-b from-green-50 to-white rounded-[2rem] overflow-hidden aspect-[9/19]">
                  {/* Status bar */}
                  <div className="flex justify-between items-center px-6 pt-8 pb-2 text-[10px] text-gray-500 font-medium">
                    <span>9:41</span>
                    <div className="flex gap-1 items-center">
                      <div className="w-4 h-2 border border-gray-400 rounded-sm relative">
                        <div className="absolute inset-0.5 bg-green-500 rounded-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* App header */}
                  <div className="px-5 pt-2 pb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      🥬 GreenCart
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Fresh groceries, fast delivery
                    </p>
                  </div>

                  {/* Search bar */}
                  <div className="mx-5 mb-4 bg-gray-100 rounded-xl px-3 py-2 text-[11px] text-gray-400">
                    🔍 Search for groceries...
                  </div>

                  {/* Category pills */}
                  <div className="flex gap-2 px-5 mb-4 overflow-hidden">
                    {['🍎 Fruits', '🥦 Veggies', '🥛 Dairy'].map((c, i) => (
                      <div
                        key={i}
                        className={`whitespace-nowrap text-[10px] px-3 py-1.5 rounded-full font-medium ${
                          i === 0
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {c}
                      </div>
                    ))}
                  </div>

                  {/* Product cards */}
                  <div className="grid grid-cols-2 gap-2 px-5 pb-6">
                    {[
                      { emoji: '🍎', name: 'Apples', price: '$4.99' },
                      { emoji: '🥑', name: 'Avocados', price: '$6.49' },
                      { emoji: '🫐', name: 'Blueberries', price: '$5.99' },
                      { emoji: '🥕', name: 'Carrots', price: '$2.99' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100"
                      >
                        <div className="text-2xl text-center mb-1">
                          {item.emoji}
                        </div>
                        <p className="text-[10px] font-semibold text-gray-800 text-center">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-green-600 font-bold text-center">
                          {item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-green-100"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">
                  🚚
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-800">
                    Order Delivered!
                  </p>
                  <p className="text-[9px] text-gray-400">Just now</p>
                </div>
              </motion.div>

              {/* Floating discount badge */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="absolute -bottom-2 -left-6 bg-yellow-400 text-yellow-900 rounded-2xl shadow-lg px-4 py-2 font-bold text-sm"
              >
                20% OFF 🎉
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;