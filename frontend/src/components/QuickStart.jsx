import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { FaArrowLeft, FaMapMarkerAlt, FaStar, FaCalendar, FaDollarSign } from 'react-icons/fa';

const QuickStart = () => {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const citiesRef = useRef([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showItinerary, setShowItinerary] = useState(false);

  const cities = [
    {
      id: 1,
      name: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800&q=80',
      description: 'The City of Dreams',
      places: [
        { name: 'Gateway of India', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80', rating: 4.5 },
        { name: 'Marine Drive', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', rating: 4.3 },
        { name: 'Elephanta Caves', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80', rating: 4.4 },
        { name: 'Chhatrapati Shivaji Terminus', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', rating: 4.6 },
        { name: 'Juhu Beach', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80', rating: 4.2 }
      ],
      itinerary: {
        duration: '4 Days',
        cost: '₹15,000',
        days: [
          { day: 1, title: 'Arrival & South Mumbai', activities: ['Gateway of India', 'Colaba Causeway', 'Marine Drive'], cost: '₹3,000' },
          { day: 2, title: 'Heritage & Culture', activities: ['Elephanta Caves', 'CST Station', 'Crawford Market'], cost: '₹4,000' },
          { day: 3, title: 'Bollywood & Beaches', activities: ['Film City Tour', 'Juhu Beach', 'Bandra-Worli Sea Link'], cost: '₹4,500' },
          { day: 4, title: 'Shopping & Departure', activities: ['Linking Road', 'Phoenix Mills', 'Airport Transfer'], cost: '₹3,500' }
        ]
      }
    },
    {
      id: 2,
      name: 'Pune',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
      description: 'Oxford of the East',
      places: [
        { name: 'Shaniwar Wada', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80', rating: 4.3 },
        { name: 'Aga Khan Palace', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', rating: 4.4 },
        { name: 'Sinhagad Fort', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80', rating: 4.5 },
        { name: 'Osho Ashram', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80', rating: 4.2 },
        { name: 'Pune University', image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600&q=80', rating: 4.1 }
      ],
      itinerary: {
        duration: '3 Days',
        cost: '₹12,000',
        days: [
          { day: 1, title: 'Historical Pune', activities: ['Shaniwar Wada', 'Aga Khan Palace', 'Local Markets'], cost: '₹3,500' },
          { day: 2, title: 'Adventure & Nature', activities: ['Sinhagad Fort', 'Khadakwasla Dam', 'Parvati Hill'], cost: '₹4,000' },
          { day: 3, title: 'Modern Pune', activities: ['Osho Ashram', 'Pune University', 'Koregaon Park'], cost: '₹4,500' }
        ]
      }
    },
    {
      id: 3,
      name: 'Kerala',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
      description: 'God\'s Own Country',
      places: [
        { name: 'Alleppey Backwaters', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', rating: 4.8 },
        { name: 'Munnar Tea Gardens', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80', rating: 4.7 },
        { name: 'Kochi Fort', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80', rating: 4.4 },
        { name: 'Thekkady Wildlife', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', rating: 4.6 },
        { name: 'Varkala Beach', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80', rating: 4.5 }
      ],
      itinerary: {
        duration: '6 Days',
        cost: '₹25,000',
        days: [
          { day: 1, title: 'Arrival Kochi', activities: ['Fort Kochi', 'Chinese Fishing Nets', 'Spice Markets'], cost: '₹4,000' },
          { day: 2, title: 'Munnar Hills', activities: ['Tea Gardens', 'Mattupetty Dam', 'Echo Point'], cost: '₹4,500' },
          { day: 3, title: 'Thekkady Wildlife', activities: ['Periyar National Park', 'Spice Plantation', 'Boat Safari'], cost: '₹4,200' },
          { day: 4, title: 'Alleppey Backwaters', activities: ['Houseboat Stay', 'Village Tour', 'Sunset Cruise'], cost: '₹5,000' },
          { day: 5, title: 'Varkala Beach', activities: ['Beach Relaxation', 'Cliff Views', 'Ayurvedic Spa'], cost: '₹3,800' },
          { day: 6, title: 'Departure', activities: ['Shopping', 'Airport Transfer'], cost: '₹3,500' }
        ]
      }
    },
    {
      id: 4,
      name: 'Gandhinagar',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
      description: 'The Green Capital',
      places: [
        { name: 'Akshardham Temple', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80', rating: 4.7 },
        { name: 'Sarita Udyan', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80', rating: 4.3 },
        { name: 'Adalaj Stepwell', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80', rating: 4.5 },
        { name: 'Indroda Nature Park', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', rating: 4.2 },
        { name: 'Capitol Complex', image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600&q=80', rating: 4.1 }
      ],
      itinerary: {
        duration: '3 Days',
        cost: '₹10,000',
        days: [
          { day: 1, title: 'Spiritual Journey', activities: ['Akshardham Temple', 'Sarita Udyan', 'Local Cuisine'], cost: '₹3,000' },
          { day: 2, title: 'Heritage & Nature', activities: ['Adalaj Stepwell', 'Indroda Nature Park', 'Capitol Complex'], cost: '₹3,500' },
          { day: 3, title: 'Modern Gandhinagar', activities: ['Shopping', 'Cultural Center', 'Departure'], cost: '₹3,500' }
        ]
      }
    },
    {
      id: 5,
      name: 'Lucknow',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
      description: 'City of Nawabs',
      places: [
        { name: 'Bara Imambara', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80', rating: 4.6 },
        { name: 'Chota Imambara', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80', rating: 4.4 },
        { name: 'Rumi Darwaza', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', rating: 4.5 },
        { name: 'British Residency', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80', rating: 4.3 },
        { name: 'Hazratganj Market', image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600&q=80', rating: 4.2 }
      ],
      itinerary: {
        duration: '3 Days',
        cost: '₹11,000',
        days: [
          { day: 1, title: 'Nawabi Heritage', activities: ['Bara Imambara', 'Chota Imambara', 'Rumi Darwaza'], cost: '₹3,500' },
          { day: 2, title: 'Colonial History', activities: ['British Residency', 'Clock Tower', 'Gomti Riverfront'], cost: '₹3,500' },
          { day: 3, title: 'Culture & Cuisine', activities: ['Hazratganj Market', 'Tunday Kababi', 'Departure'], cost: '₹4,000' }
        ]
      }
    },
    {
      id: 6,
      name: 'Jammu',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
      description: 'City of Temples',
      places: [
        { name: 'Vaishno Devi Temple', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80', rating: 4.8 },
        { name: 'Bahu Fort', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80', rating: 4.4 },
        { name: 'Raghunath Temple', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', rating: 4.5 },
        { name: 'Amar Mahal Palace', image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600&q=80', rating: 4.3 },
        { name: 'Mansar Lake', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', rating: 4.6 }
      ],
      itinerary: {
        duration: '4 Days',
        cost: '₹18,000',
        days: [
          { day: 1, title: 'Spiritual Journey', activities: ['Vaishno Devi Temple', 'Katra Stay'], cost: '₹5,000' },
          { day: 2, title: 'Historical Jammu', activities: ['Bahu Fort', 'Raghunath Temple', 'City Tour'], cost: '₹4,000' },
          { day: 3, title: 'Royal Heritage', activities: ['Amar Mahal Palace', 'Mansar Lake', 'Local Markets'], cost: '₹4,500' },
          { day: 4, title: 'Nature & Departure', activities: ['Surinsar Lake', 'Shopping', 'Airport Transfer'], cost: '₹4,500' }
        ]
      }
    },
    {
      id: 7,
      name: 'Assam',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
      description: 'Gateway to Northeast',
      places: [
        { name: 'Kaziranga National Park', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', rating: 4.7 },
        { name: 'Kamakhya Temple', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80', rating: 4.5 },
        { name: 'Majuli Island', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', rating: 4.6 },
        { name: 'Tea Gardens', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80', rating: 4.4 },
        { name: 'Umananda Temple', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80', rating: 4.3 }
      ],
      itinerary: {
        duration: '5 Days',
        cost: '₹20,000',
        days: [
          { day: 1, title: 'Arrival Guwahati', activities: ['Kamakhya Temple', 'Umananda Temple', 'Brahmaputra Cruise'], cost: '₹4,000' },
          { day: 2, title: 'Kaziranga Safari', activities: ['Elephant Safari', 'Jeep Safari', 'Wildlife Photography'], cost: '₹4,500' },
          { day: 3, title: 'Majuli Island', activities: ['Ferry Ride', 'Satras Visit', 'Cultural Show'], cost: '₹4,000' },
          { day: 4, title: 'Tea Gardens', activities: ['Tea Estate Tour', 'Tea Tasting', 'Local Villages'], cost: '₹3,500' },
          { day: 5, title: 'Departure', activities: ['Shopping', 'Local Cuisine', 'Airport Transfer'], cost: '₹4,000' }
        ]
      }
    }
  ];

  useEffect(() => {
    gsap.fromTo(headerRef.current, 
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    gsap.fromTo(citiesRef.current,
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

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowItinerary(false);
  };

  const handlePlanTrip = () => {
    setShowItinerary(true);
  };

  const handleBookTrip = () => {
    const tripData = {
      id: Date.now(),
      name: `${selectedCity.name} Adventure`,
      destination: selectedCity.name,
      description: `Complete ${selectedCity.itinerary.duration} trip to ${selectedCity.name}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + (parseInt(selectedCity.itinerary.duration) * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      budget: parseInt(selectedCity.itinerary.cost.replace('₹', '').replace(',', '')),
      currency: 'INR',
      status: 'planned',
      itinerary: selectedCity.itinerary,
      places: selectedCity.places,
      image: selectedCity.image,
      bookedAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingTrips = JSON.parse(localStorage.getItem('bookedTrips') || '[]');
    existingTrips.push(tripData);
    localStorage.setItem('bookedTrips', JSON.stringify(existingTrips));

    alert(`Trip to ${selectedCity.name} has been booked successfully!`);
    navigate('/dashboard');
  };

  if (showItinerary && selectedCity) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-6 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
            <button 
              onClick={() => setShowItinerary(false)}
              className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              <FaArrowLeft /> Back to Places
            </button>
            <h1 className="text-3xl font-bold">{selectedCity.name} Itinerary</h1>
            <div></div>
          </div>
        </div>

        {/* Itinerary Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-8 mb-8 border-2 border-yellow-200">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <FaCalendar className="text-3xl text-yellow-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-black mb-2">Duration</h3>
                <p className="text-gray-700 text-lg">{selectedCity.itinerary.duration}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <FaDollarSign className="text-3xl text-yellow-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-black mb-2">Total Cost</h3>
                <p className="text-gray-700 text-lg">{selectedCity.itinerary.cost}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <FaMapMarkerAlt className="text-3xl text-yellow-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-black mb-2">Destination</h3>
                <p className="text-gray-700 text-lg">{selectedCity.name}</p>
              </div>
            </div>
          </div>

          {/* Day-wise Itinerary */}
          <div className="space-y-6">
            {selectedCity.itinerary.days.map((day, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border-2 border-yellow-100 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-4">
                  <h3 className="text-xl font-bold">Day {day.day}: {day.title}</h3>
                  <p className="text-black/80">Cost: {day.cost}</p>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <p className="text-gray-800 font-medium">{activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Book Now Button */}
          <div className="text-center mt-12">
            <button 
              onClick={handleBookTrip}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-12 py-4 rounded-2xl text-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
            >
              Book This Trip Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCity) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-6 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
            <button 
              onClick={() => setSelectedCity(null)}
              className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              <FaArrowLeft /> Back to Cities
            </button>
            <h1 className="text-3xl font-bold">Top Places in {selectedCity.name}</h1>
            <div></div>
          </div>
        </div>

        {/* Places Grid */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {selectedCity.places.map((place, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-yellow-100 hover:border-yellow-300 transition-all duration-300 transform hover:-translate-y-2">
                <img 
                  src={place.image} 
                  alt={place.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-2">{place.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <FaStar className="text-yellow-500" />
                    <span className="text-gray-700 font-medium">{place.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Plan My Trip Button */}
          <div className="text-center mt-12">
            <button 
              onClick={handlePlanTrip}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-12 py-4 rounded-2xl text-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
            >
              Plan My Trip to {selectedCity.name}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div ref={headerRef} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-8 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Link 
            to="/main" 
            className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors mb-4"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-4">Choose Your Destination</h1>
          <p className="text-xl text-black/80">Discover amazing places across India</p>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cities.map((city, index) => (
            <div
              key={city.id}
              ref={el => citiesRef.current[index] = el}
              onClick={() => handleCitySelect(city)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-yellow-100 hover:border-yellow-300 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={city.image} 
                  alt={city.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{city.name}</h3>
                  <p className="text-white/90">{city.description}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Explore Places</span>
                  <FaMapMarkerAlt className="text-yellow-500 text-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickStart;