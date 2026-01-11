import React, { useEffect, useRef, useState } from 'react';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "PS",
    role: "Engineering Student",
    rating: 5,
    text: "The Masala Dosa is absolutely authentic! Crispy on the outside, perfect filling. Best breakfast on campus!",
    dish: "Masala Dosa",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    name: "Rahul Kumar",
    avatar: "RK",
    role: "Computer Science",
    rating: 5,
    text: "Biriyani Friday is my favorite! The AI pairing suggested raita and it was perfect. Namma Credit made it easy too!",
    dish: "Chicken Biriyani",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    name: "Ananya Reddy",
    avatar: "AR",
    role: "MBA Student",
    rating: 4,
    text: "Filter coffee hits different here! Reminds me of home. The real-time tracking helps me plan my day better.",
    dish: "Filter Coffee",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: 4,
    name: "Karthik Iyer",
    avatar: "KI",
    role: "Final Year",
    rating: 5,
    text: "Idli Vada combo for ₹40? Unbeatable! The sambhar is chef's kiss. Using my Green Token saved me ₹5 too!",
    dish: "Idli Vada",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 5,
    name: "Deepika Menon",
    avatar: "DM",
    role: "Architecture",
    rating: 5,
    text: "Pongal is comfort food! Perfect consistency, love the ghee topping. The OTP system makes ordering so secure.",
    dish: "Pongal",
    color: "from-yellow-500 to-amber-500"
  },
  {
    id: 6,
    name: "Arjun Patel",
    avatar: "AP",
    role: "Business Student",
    rating: 4,
    text: "Meals thali is wholesome and filling. Great variety, amazing value for money. The credit tier system is genius!",
    dish: "Meals Thali",
    color: "from-indigo-500 to-purple-500"
  }
];

const Testimonials = () => {
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationFrameId;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const scroll = () => {
      if (!isPaused) {
        scrollPosition += scrollSpeed;
        
        // Reset scroll when we've scrolled past half the content (for infinite loop effect)
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPaused]);

  // Duplicate testimonials for infinite scroll effect
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="mb-12 overflow-hidden">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">
          What Students Say
        </h2>
        <p className="text-dark-400 text-sm">Real feedback from our happy diners</p>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${index}`}
            className="flex-shrink-0 w-80 card-elevated rounded-2xl p-6 hover:border-primary-500/50 transition-all group"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>
                {testimonial.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-white text-sm truncate">{testimonial.name}</h4>
                <p className="text-dark-500 text-xs truncate">{testimonial.role}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < testimonial.rating ? 'text-yellow-400' : 'text-dark-700'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-dark-300 text-sm mb-4 leading-relaxed">
              "{testimonial.text}"
            </p>

            {/* Dish Tag */}
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-3 py-1.5">
              <span className="text-sm">🍽️</span>
              <span className="text-xs font-bold text-primary-400">{testimonial.dish}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pause indicator */}
      {isPaused && (
        <p className="text-center text-dark-500 text-xs mt-4 fade-in">
          Hover paused • Move away to continue
        </p>
      )}
    </div>
  );
};

export default Testimonials;
