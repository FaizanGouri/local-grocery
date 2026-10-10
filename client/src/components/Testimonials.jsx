import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Busy Mom',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'GreenCart has completely transformed my grocery shopping. Fresh produce delivered right to my door within hours. The quality is consistently amazing and my kids love picking items from the app!',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Software Engineer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: "As someone who works long hours, GreenCart is a lifesaver. The app is intuitive, delivery is always on time, and the organic selection is unbeatable. I've recommended it to my entire team.",
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Fitness Trainer',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 4,
    text: "Finding quality organic produce used to take me hours at different stores. Now I get everything in one place with GreenCart. The freshness tracking feature is genius — I always know what I'm getting.",
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Retired Chef',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    rating: 5,
    text: "After 30 years in professional kitchens, I'm picky about ingredients. GreenCart sources from local farms I trust. Their seasonal selections rival what I used to get from specialty suppliers.",
  },
  {
    id: 5,
    name: 'Aisha Patel',
    role: 'College Student',
    avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
    rating: 5,
    text: "Budget-friendly AND healthy? GreenCart's student discounts and meal-kit bundles make it possible to eat well on a college budget. The recipe suggestions based on what's in season are a nice touch.",
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const timeoutRef = useRef(null);
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

  const resetAutoplay = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
  };

  useEffect(() => {
    resetAutoplay();
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  const navigate = (dir) => {
    setDirection(dir);
    setCurrent((prev) =>
      dir === 1
        ? (prev + 1) % testimonials.length
        : (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
  };

  const t = testimonials[current];

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-20 px-4 bg-gradient-to-b from-white to-green-50 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-green-600 font-semibold text-sm tracking-widest uppercase">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Thousands of happy customers trust GreenCart for their daily grocery needs.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-3xl mx-auto"
        >
          {/* Quote icon */}
          <FaQuoteLeft className="absolute -top-6 left-4 md:left-0 text-green-200 text-6xl md:text-8xl -z-0 select-none" />

          <div className="relative min-h-[320px] md:min-h-[280px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={t.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="absolute w-full"
              >
                <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-green-100 relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${
                          i < t.rating ? 'text-yellow-400' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8 italic">
                    "{t.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-green-200 shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-gray-800">{t.name}</h4>
                      <p className="text-green-600 text-sm">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-full bg-white shadow-md border border-green-100 flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300"
            >
              <FaChevronLeft />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-8 bg-green-600'
                      : 'w-2.5 bg-green-200 hover:bg-green-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => navigate(1)}
              className="w-12 h-12 rounded-full bg-white shadow-md border border-green-100 flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300"
            >
              <FaChevronRight />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;