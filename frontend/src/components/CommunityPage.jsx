import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FaStar, FaHeart, FaComment, FaShare, FaMapMarkerAlt, FaCalendar, FaUser } from 'react-icons/fa';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('recent');
  const postsRef = useRef([]);
  const headerRef = useRef(null);

  const communityPosts = [
    {
      id: 1,
      user: { name: 'Priya Sharma', avatar: 'PS', location: 'Mumbai, India' },
      destination: 'Goa Beach Paradise',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop',
      rating: 4.8,
      likes: 234,
      comments: 45,
      date: '2 days ago',
      description: 'Just returned from an amazing 5-day trip to Goa! The beaches were pristine and the local cuisine was incredible. Highly recommend staying in North Goa for the best nightlife experience.',
      tags: ['Beach', 'Nightlife', 'Food']
    },
    {
      id: 2,
      user: { name: 'Rajesh Kumar', avatar: 'RK', location: 'Delhi, India' },
      destination: 'Himalayan Adventure',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      rating: 4.9,
      likes: 189,
      comments: 32,
      date: '1 week ago',
      description: 'Trekked through the beautiful valleys of Himachal Pradesh. The mountain views were breathtaking and the local hospitality was wonderful. Perfect for adventure seekers!',
      tags: ['Adventure', 'Mountains', 'Trekking']
    },
    {
      id: 3,
      user: { name: 'Anita Patel', avatar: 'AP', location: 'Ahmedabad, India' },
      destination: 'Kerala Backwaters',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop',
      rating: 4.7,
      likes: 156,
      comments: 28,
      date: '3 days ago',
      description: 'Spent a peaceful weekend cruising through Kerala backwaters. The houseboat experience was magical and the traditional Kerala meals were delicious. A perfect romantic getaway!',
      tags: ['Romantic', 'Nature', 'Houseboat']
    },
    {
      id: 4,
      user: { name: 'Vikram Singh', avatar: 'VS', location: 'Jaipur, India' },
      destination: 'Rajasthan Heritage Tour',
      image: 'https://images.unsplash.com/photo-1599661046827-dacde6976549?w=600&h=400&fit=crop',
      rating: 4.6,
      likes: 298,
      comments: 67,
      date: '5 days ago',
      description: 'Explored the magnificent palaces and forts of Rajasthan. The architecture is stunning and the cultural experiences were unforgettable. Don\'t miss the camel safari in Jaisalmer!',
      tags: ['Heritage', 'Culture', 'Architecture']
    },
    {
      id: 5,
      user: { name: 'Meera Reddy', avatar: 'MR', location: 'Bangalore, India' },
      destination: 'Coorg Coffee Plantations',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop',
      rating: 4.5,
      likes: 142,
      comments: 23,
      date: '1 week ago',
      description: 'Discovered the beautiful coffee plantations of Coorg. The weather was perfect and the coffee tasting sessions were amazing. Great place for a weekend retreat from city life.',
      tags: ['Coffee', 'Nature', 'Weekend']
    },
    {
      id: 6,
      user: { name: 'Arjun Mehta', avatar: 'AM', location: 'Chennai, India' },
      destination: 'Andaman Islands',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
      rating: 4.9,
      likes: 387,
      comments: 89,
      date: '4 days ago',
      description: 'Paradise found in Andaman Islands! Crystal clear waters, white sandy beaches, and amazing coral reefs. Scuba diving here is a must-do experience. Truly a tropical paradise!',
      tags: ['Beach', 'Scuba Diving', 'Paradise']
    }
  ];

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    gsap.fromTo(postsRef.current,
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
  }, [activeTab]);

  const filteredPosts = communityPosts.filter(post => {
    if (activeTab === 'recent') return true;
    if (activeTab === 'popular') return post.likes > 200;
    if (activeTab === 'top-rated') return post.rating >= 4.8;
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div ref={headerRef} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-8 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Travel Community</h1>
          <p className="text-xl text-black/80">Share your adventures and discover amazing destinations</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-yellow-50 rounded-2xl p-2 border-2 border-yellow-200">
            {[
              { key: 'recent', label: 'Recent Posts' },
              { key: 'popular', label: 'Popular' },
              { key: 'top-rated', label: 'Top Rated' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg'
                    : 'text-gray-700 hover:bg-yellow-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              ref={el => postsRef.current[index] = el}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-yellow-100 hover:border-yellow-300 overflow-hidden"
            >
              {/* Post Image */}
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.destination}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500 text-sm" />
                    <span className="font-semibold text-sm">{post.rating}</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {post.user.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{post.user.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FaMapMarkerAlt />
                      <span>{post.user.location}</span>
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-gray-500 flex items-center gap-1">
                    <FaCalendar />
                    <span>{post.date}</span>
                  </div>
                </div>

                {/* Destination */}
                <h3 className="text-xl font-bold text-black mb-3">{post.destination}</h3>

                {/* Description */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                      <FaHeart className="text-sm" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                      <FaComment className="text-sm" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>
                  </div>
                  <button className="text-gray-600 hover:text-yellow-600 transition-colors">
                    <FaShare className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Review Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-8 border-2 border-yellow-200 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-black mb-6 text-center">Share Your Travel Experience</h3>
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Your Name"
                className="px-4 py-3 border-2 border-yellow-200 rounded-lg focus:border-yellow-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Destination"
                className="px-4 py-3 border-2 border-yellow-200 rounded-lg focus:border-yellow-400 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-black font-medium">Rating:</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <FaStar key={star} className="text-yellow-500 cursor-pointer hover:text-yellow-600" />
                  ))}
                </div>
              </div>
            </div>
            <textarea
              placeholder="Share your travel experience..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-yellow-200 rounded-lg focus:border-yellow-400 focus:outline-none mb-4 resize-none"
            />
            <div className="text-center">
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-8 py-3 rounded-2xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg transform hover:-translate-y-1">
                Post Review
              </button>
            </div>
          </div>
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-8 py-3 rounded-2xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg transform hover:-translate-y-1">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;