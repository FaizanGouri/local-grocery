// src/components/Features.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaTruck, FaLeaf, FaShieldAlt, FaPercentage } from 'react-icons/fa';

const featuresData = [
  {
    icon: <FaTruck />,
    title: 'Free Delivery',
    description: 'Free shipping on all orders above $50. Fast and reliable delivery to your doorstep.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: <FaLeaf />,
    title: '100% Organic',
    description: 'All our products are certified organic, sourced directly from trusted local farms.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: <FaShieldAlt />,
    title: 'Secure Payment',
    description: 'Your transactions are protected with 256-bit SSL encryption. Shop with confidence.',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
  },
  {
    icon: <FaPercentage />,
    title: 'Daily Offers',
    description: 'Enjoy exclusive discounts and flash deals on fresh produce every single day.',
    color: 'text-lime-600',
    bg: 'bg-lime-50',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' },
  }),
};

const Features = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      ref={ref}
      id="features"
      className="py-20 px-4 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold tracking-wide uppercase mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            We Deliver the <span className="text-emerald-500">Best</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto leading-relaxed">
            From farm-fresh produce to your front door — quality, speed, and savings in every order.
          </p>
        </motion.div>

        {/* cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              whileHover={{ y: -8, boxShadow: '0 12px 28px rgba(0,0,0,0.1)' }}
              className="relative bg-white rounded-2xl p-8 text-center shadow-md
                         border border-gray-100 cursor-pointer transition-colors
                         hover:border-emerald-200 group"
            >
              {/* icon */}
              <div
                className={`mx-auto mb-6 w-16 h-16 flex items-center justify-center
                            rounded-2xl text-2xl ${feature.bg} ${feature.color}
                            group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* bottom accent bar */}
              <span
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-0
                            rounded-b-2xl ${feature.bg.replace('50', '400')}
                            group-hover:w-full transition-all duration-500`}
                style={{ backgroundColor: 'currentColor' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;