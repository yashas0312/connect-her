import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            ConnectHer
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90">
            Empower • Inspire • Grow
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-80">
            A digital platform that empowers women through storytelling and entrepreneurship. 
            Share your journey, discover amazing businesses, and build meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/stories" 
              className="btn-primary text-lg px-8 py-3 inline-block"
            >
              Explore Stories
            </Link>
            <Link 
              to="/businesses" 
              className="btn-outline text-lg px-8 py-3 inline-block bg-white/10 border-white text-white hover:bg-white hover:text-primary-600"
            >
              Find Businesses
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Empowering Women Through Connection
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Story Hub */}
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Story Hub</h3>
              <p className="text-gray-600 mb-4">
                Share your experiences in Career, Health, Education, and Growth. 
                Post anonymously or publicly to inspire others.
              </p>
              <Link to="/stories" className="text-primary-600 font-medium hover:text-primary-700">
                Share Your Story →
              </Link>
            </div>

            {/* Business Hub */}
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Business Hub</h3>
              <p className="text-gray-600 mb-4">
                Discover women-led businesses in your area. Support local entrepreneurs 
                and find services you need.
              </p>
              <Link to="/businesses" className="text-secondary-600 font-medium hover:text-secondary-700">
                Explore Businesses →
              </Link>
            </div>

            {/* Community */}
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-gray-600 mb-4">
                Connect with like-minded women, engage with content, and build 
                meaningful relationships in a supportive environment.
              </p>
              <Link to="/signup" className="text-accent-600 font-medium hover:text-accent-700">
                Join Community →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of women who are already sharing their stories, 
            growing their businesses, and building connections that matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/login" className="btn-outline text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;