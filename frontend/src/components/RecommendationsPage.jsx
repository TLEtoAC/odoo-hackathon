import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FaStar, FaMapMarkerAlt, FaCalendar, FaDollarSign, FaHeart } from 'react-icons/fa';

const RecommendationsPage = () => {
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  const recommendations = [
    {
      id: 1,
      destination: 'Udaipur, Rajasthan',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      rating: 4.8,
      price: '₹25,000',
      duration: '5 Days',
      description: 'City of Lakes with magnificent palaces and romantic boat rides',
      highlights: ['Lake Pichola', 'City Palace', 'Jag Mandir'],
      bestTime: 'Oct - Mar',
      category: 'Heritage'
    },
    {
      id: 2,
      destination: 'Rishikesh, Uttarakhand',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      rating: 4.7,
      price: '₹18,000',
      duration: '4 Days',
      description: 'Spiritual hub with adventure sports and yoga retreats',
      highlights: ['River Rafting', 'Yoga Ashrams', 'Laxman Jhula'],
      bestTime: 'Sep - Nov, Mar - May',
      category: 'Adventure'
    },
    {
      id: 3,
      destination: 'Hampi, Karnataka',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
      rating: 4.6,
      price: '₹15,000',
      duration: '3 Days',
      description: 'Ancient ruins and historical significance with stunning architecture',
      highlights: ['Virupaksha Temple', 'Stone Chariot', 'Hampi Bazaar'],
      bestTime: 'Oct - Feb',
      category: 'Historical'
    },
    {
      id: 4,
      destination: 'Coorg, Karnataka',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop',
      rating: 4.5,
      price: '₹20,000',
      duration: '4 Days',
      description: 'Coffee plantations and misty hills perfect for nature lovers',
      highlights: ['Coffee Estates', 'Abbey Falls', 'Raja\'s Seat'],
      bestTime: 'Oct - Mar',
      category: 'Nature'
    },
    {
      id: 5,
      destination: 'Pushkar, Rajasthan',
      image: 'https://images.unsplash.com/photo-1599661046827-dacde6976549?w=600&h=400&fit=crop',
      rating: 4.4,
      price: '₹12,000',
      duration: '3 Days',
      description: 'Holy city with colorful markets and camel safaris',
      highlights: ['Pushkar Lake', 'Brahma Temple', 'Camel Fair'],
      bestTime: 'Nov - Mar',
      category: 'Cultural'
    },
    {
      id: 6,
      destination: 'Munnar, Kerala',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop',
      rating: 4.9,
      price: '₹22,000',
      duration: '5 Days',
      description: 'Tea gardens and cool climate in the Western Ghats',
      highlights: ['Tea Museums', 'Eravikulam Park', 'Mattupetty Dam'],
      bestTime: 'Sep - Mar',
      category: 'Hill Station'
    }
  ];

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    gsap.fromTo(cardsRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.6, 
        stagger: 0.1, 
        delay: 0.3,
        ease: "back.out(1.7)" 
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div ref={headerRef} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-8 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Recommended For You</h1>
          <p className="text-xl text-black/80">Discover amazing destinations based on your preferences</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Recommendations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((place, index) => (
            <div
              key={place.id}
              ref={el => cardsRef.current[index] = el}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-yellow-100 hover:border-yellow-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={place.image}
                  alt={place.destination}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500 text-sm" />
                    <span className="font-semibold text-sm">{place.rating}</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                  {place.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">{place.destination}</h3>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">{place.description}</p>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaDollarSign className="text-green-600" />
                      <span>{place.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCalendar className="text-blue-600" />
                      <span>{place.duration}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Best Time:</strong> {place.bestTime}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-black mb-2">Top Attractions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {place.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 font-semibold text-sm">
                    Plan Trip
                  </button>
                  <button className="p-2 border-2 border-yellow-200 rounded-lg hover:border-yellow-400 transition-colors">
                    <FaHeart className="text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-8 py-3 rounded-2xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg transform hover:-translate-y-1">
            Load More Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;