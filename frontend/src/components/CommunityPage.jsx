import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaComment, FaShare, FaPlus, FaMapMarkerAlt, FaStar, FaCamera, FaGlobe } from 'react-icons/fa';

const CommunityPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', location: '', rating: 5, image: '' });
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('communityPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with mock data
      const mockPosts = [
        {
          id: 1,
          author: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
          title: 'Amazing Sunset in Santorini',
          content: 'Just witnessed the most breathtaking sunset from Oia! The blue domes against the golden sky created pure magic. Definitely a must-visit destination for anyone seeking romance and beauty.',
          location: 'Santorini, Greece',
          rating: 5,
          image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop',
          likes: 24,
          comments: 8,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          author: 'Mike Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          title: 'Street Food Adventure in Bangkok',
          content: 'Spent the day exploring Bangkok\'s street food scene. From pad thai to mango sticky rice, every bite was an explosion of flavors! The local vendors were so friendly and welcoming.',
          location: 'Bangkok, Thailand',
          rating: 5,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
          likes: 18,
          comments: 12,
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          author: 'Emma Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
          title: 'Hiking the Inca Trail',
          content: 'Just completed the 4-day Inca Trail to Machu Picchu! The journey was challenging but incredibly rewarding. The ancient ruins at sunrise took my breath away. Peru, you have my heart!',
          location: 'Machu Picchu, Peru',
          rating: 5,
          image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&h=400&fit=crop',
          likes: 42,
          comments: 15,
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        }
      ];
      setPosts(mockPosts);
      localStorage.setItem('communityPosts', JSON.stringify(mockPosts));
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('communityPosts', JSON.stringify(posts));
  }, [posts]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    const post = {
      id: Date.now(),
      author: user?.firstName + ' ' + user?.lastName || 'Anonymous',
      avatar: `https://ui-avatars.com/api/?name=${user?.firstName || 'A'}&background=3b82f6&color=fff`,
      title: newPost.title,
      content: newPost.content,
      location: newPost.location,
      rating: newPost.rating,
      image: newPost.image,
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString()
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', location: '', rating: 5, image: '' });
    setShowCreatePost(false);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Travel Community
              </h1>
              <p className="text-gray-600 mt-1">Share your adventures and inspire others</p>
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FaPlus /> Share Experience
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/30">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Share Your Travel Experience</h2>
              </div>
              <form onSubmit={handleCreatePost} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Give your experience a catchy title..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Your Story</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32"
                    placeholder="Tell us about your amazing travel experience..."
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
                    <input
                      type="text"
                      value={newPost.location}
                      onChange={(e) => setNewPost({...newPost, location: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Where did this happen?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Rating</label>
                    <select
                      value={newPost.rating}
                      onChange={(e) => setNewPost({...newPost, rating: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {[5,4,3,2,1].map(num => (
                        <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Image URL (optional)</label>
                  <input
                    type="url"
                    value={newPost.image}
                    onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Add a photo URL to make your post shine..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold"
                  >
                    Share Experience
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreatePost(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/30">
              {/* Post Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{post.author}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{formatTimeAgo(post.timestamp)}</span>
                      {post.location && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-xs" />
                            <span>{post.location}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(post.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
                <p className="text-gray-800 leading-relaxed mb-4">{post.content}</p>
                
                {post.image && (
                  <div className="rounded-2xl overflow-hidden mb-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group"
                    >
                      <FaHeart className="group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                      <FaComment />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
                      <FaShare />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <FaGlobe className="text-6xl text-gray-300 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No experiences shared yet</h3>
            <p className="text-gray-500 mb-6">Be the first to share your travel story!</p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Share Your Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;