import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { FaPlane } from 'react-icons/fa';

const EntryScreen = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const cloudsRef = useRef([]);
  const sunRaysRef = useRef([]);
  const particlesRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();

    // Initial setup
    gsap.set([logoRef.current, titleRef.current], { opacity: 0, scale: 0.5 });
    gsap.set(cloudsRef.current, { opacity: 0, x: -100 });
    gsap.set(sunRaysRef.current, { opacity: 0, scale: 0, rotation: 0 });
    gsap.set(particlesRef.current, { opacity: 0, scale: 0 });

    // Animate clouds first
    tl.to(cloudsRef.current, {
      opacity: 0.8,
      x: 0,
      duration: 2,
      stagger: 0.3,
      ease: "power2.out"
    })
    // Animate sun rays
    .to(sunRaysRef.current, {
      opacity: 0.6,
      scale: 1,
      rotation: 360,
      duration: 3,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=1")
    // Animate logo with bounce
    .to(logoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: "back.out(2)",
      onComplete: () => {
        // Continuous floating animation for logo
        gsap.to(logoRef.current, {
          y: -20,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "power2.inOut"
        });
        
        // Continuous rotation for logo
        gsap.to(logoRef.current.querySelector('.plane-icon'), {
          rotation: 360,
          duration: 8,
          repeat: -1,
          ease: "none"
        });
      }
    })
    // Animate title
    .to(titleRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "back.out(1.7)"
    }, "-=0.5")
    // Animate particles
    .to(particlesRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out"
    }, "-=0.5");

    // Continuous animations
    // Floating clouds
    cloudsRef.current.forEach((cloud, index) => {
      if (cloud) {
        gsap.to(cloud, {
          x: `+=${30 + index * 10}`,
          y: `+=${10 + index * 5}`,
          duration: 4 + index,
          yoyo: true,
          repeat: -1,
          ease: "power2.inOut",
          delay: index * 0.5
        });
      }
    });

    // Rotating sun rays
    sunRaysRef.current.forEach((ray, index) => {
      if (ray) {
        gsap.to(ray, {
          rotation: 360,
          duration: 10 + index * 2,
          repeat: -1,
          ease: "none"
        });
      }
    });

    // Floating particles
    particlesRef.current.forEach((particle, index) => {
      if (particle) {
        gsap.to(particle, {
          y: `+=${-50 - index * 10}`,
          x: `+=${Math.sin(index) * 20}`,
          duration: 3 + index * 0.5,
          yoyo: true,
          repeat: -1,
          ease: "power2.inOut",
          delay: index * 0.2
        });
      }
    });

  }, []);

  const handleFlightClick = () => {
    // Exit animation
    const exitTl = gsap.timeline({
      onComplete: () => navigate('/dashboard')
    });

    exitTl.to(logoRef.current, {
      scale: 1.2,
      duration: 0.3,
      ease: "power2.out"
    })
    .to(containerRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: "power2.in"
    }, "-=0.1");
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden cursor-pointer"
      onClick={handleFlightClick}
      style={{
        background: 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 25%, #B0E0E6 50%, #87CEEB 75%, #ADD8E6 100%)',
      }}
    >
      {/* Sun Rays */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`ray-${i}`}
          ref={el => sunRaysRef.current[i] = el}
          className="absolute top-20 left-20"
          style={{
            width: '200px',
            height: '4px',
            background: 'linear-gradient(90deg, rgba(255,223,0,0.6) 0%, rgba(255,223,0,0) 100%)',
            transformOrigin: '0 50%',
            transform: `rotate(${i * 45}deg)`,
          }}
        />
      ))}

      {/* Realistic Clouds */}
      <div
        ref={el => cloudsRef.current[0] = el}
        className="absolute top-16 left-10 opacity-70"
        style={{
          width: '180px',
          height: '60px',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '60px',
          position: 'relative',
        }}
      >
        <div className="absolute top-2 left-8 w-20 h-8 bg-white/80 rounded-full"></div>
        <div className="absolute top-4 right-8 w-16 h-6 bg-white/70 rounded-full"></div>
        <div className="absolute bottom-2 left-12 w-24 h-4 bg-white/60 rounded-full"></div>
      </div>

      <div
        ref={el => cloudsRef.current[1] = el}
        className="absolute top-32 right-16 opacity-60"
        style={{
          width: '220px',
          height: '80px',
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '80px',
          position: 'relative',
        }}
      >
        <div className="absolute top-3 left-12 w-24 h-10 bg-white/70 rounded-full"></div>
        <div className="absolute top-6 right-12 w-20 h-8 bg-white/60 rounded-full"></div>
        <div className="absolute bottom-3 left-16 w-28 h-6 bg-white/50 rounded-full"></div>
      </div>

      <div
        ref={el => cloudsRef.current[2] = el}
        className="absolute bottom-40 left-1/4 opacity-50"
        style={{
          width: '160px',
          height: '50px',
          background: 'rgba(255,255,255,0.7)',
          borderRadius: '50px',
          position: 'relative',
        }}
      >
        <div className="absolute top-1 left-6 w-18 h-6 bg-white/60 rounded-full"></div>
        <div className="absolute bottom-1 right-6 w-16 h-4 bg-white/50 rounded-full"></div>
      </div>

      <div
        ref={el => cloudsRef.current[3] = el}
        className="absolute bottom-60 right-1/3 opacity-65"
        style={{
          width: '200px',
          height: '70px',
          background: 'rgba(255,255,255,0.85)',
          borderRadius: '70px',
          position: 'relative',
        }}
      >
        <div className="absolute top-2 left-10 w-22 h-8 bg-white/75 rounded-full"></div>
        <div className="absolute bottom-2 right-10 w-20 h-6 bg-white/65 rounded-full"></div>
      </div>

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`particle-${i}`}
          ref={el => particlesRef.current[i] = el}
          className="absolute rounded-full bg-white/30"
          style={{
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        {/* GlobeTrotter Title */}
        <h1 
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold mb-12 drop-shadow-2xl"
          style={{
            background: 'linear-gradient(45deg, #FFD700 0%, #FFA500 25%, #FF8C00 50%, #FFD700 75%, #FFFF00 100%)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'goldShimmer 4s ease-in-out infinite',
            textShadow: '0 0 30px rgba(255,215,0,0.5)',
          }}
        >
          GlobeTrotter
        </h1>
        
        {/* Enhanced Flight Logo */}
        <div
          ref={logoRef}
          className="relative group mb-8"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-white to-blue-400 rounded-full blur-xl opacity-60 scale-150 group-hover:opacity-80 transition-opacity duration-300"></div>
          
          {/* Main button */}
          <button className="relative p-8 bg-white/30 backdrop-blur-md rounded-full border-4 border-white/40 hover:bg-white/40 transition-all duration-500 transform hover:scale-110 shadow-2xl group-hover:shadow-blue-500/50">
            <FaPlane 
              className="plane-icon text-7xl text-white drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8)) drop-shadow(0 0 40px rgba(59,130,246,0.6))',
              }}
            />
            
            {/* Ripple effects */}
            <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping opacity-60"></div>
            <div className="absolute inset-0 rounded-full border-2 border-blue-300/50 animate-pulse"></div>
          </button>

          {/* Orbiting elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-white/60 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 60}deg) translateX(80px) translateY(-50%)`,
                  animation: `orbit 8s linear infinite ${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Enhanced Subtitle */}
        <p className="text-white text-xl font-medium drop-shadow-lg opacity-90 animate-pulse">
          ✨ Click to begin your magical journey ✨
        </p>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes goldShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};

export default EntryScreen;