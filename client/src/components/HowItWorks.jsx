// src/components/HowItWorks.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaSearch, FaCartPlus, FaTruck } from 'react-icons/fa';

const steps = [
  {
    icon: <FaSearch />,
    title: 'Browse Products',
    description: 'Explore our curated collection of farm-fresh groceries and daily essentials.',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    icon: <FaCartPlus />,
    title: 'Add to Cart',
    description: 'Pick your favourites, choose quantities, and apply any available coupons.',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: <FaTruck />,
    title: 'Fast Delivery',
    description: 'Sit back and relax — your order arrives fresh within hours, not days.',
    color: 'from-teal-400 to-cyan-500',
  },
];

const HowItWorks = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} id="how-it-works" className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold tracking-wide uppercase mb-4">
            Simple Steps
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            How It <span className="text-emerald-500">Works</span>
          </h2>
        </motion.div>

        {/* steps */}
        <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
          {/* connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-gray-200 -z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="relative z-10 flex flex-col items-center text-center max-w-[220px]"
            >
              {/* number ring */}
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color}
                            flex items-center justify-center text-white text-2xl
                            shadow-lg mb-6`}
              >
                {step.icon}
              </div>

              {/* step number */}
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white
                               border-2 border-emerald-400 text-emerald-600 text-xs
                               font-bold flex items-center justify-center shadow">
                {i + 1}
              </span>

              <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;