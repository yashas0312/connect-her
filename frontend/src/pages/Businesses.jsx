import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import BusinessCard from '../components/BusinessCard';
import api from '../services/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060 // New York City
};

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const [newBusiness, setNewBusiness] = useState({
    name: '',
    description: '',
    category: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      coordinates: { lat: 0, lng: 0 }
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    }
  });

  const categories = [
    'Technology', 'Healthcare', 'Education', 'Retail', 'Food & Beverage',
    'Beauty & Wellness', 'Professional Services', 'Creative Arts', 'Fitness',
    'Consulting', 'Other'
  ];

  useEffect(() => {
    fetchBusinesses();
  }, [selectedCategory]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/businesses?category=${selectedCategory}&limit=50`);
      setBusinesses(response.data.data.businesses || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      // Use dummy data for development
      setBusinesses([
        {
          _id: '1',
          name: 'TechSavvy Solutions',
          description: 'Innovative web development and digital marketing services for small businesses.',
          category: 'Technology',
          owner: { displayName: 'Maria Rodriguez', profilePicture: '' },
          location: {
            address: '123 Tech Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            coordinates: { lat: 40.7589, lng: -73.9851 }
          },
          contact: {
            phone: '(555) 123-4567',
            email: 'maria@techsavvy.com',
            website: 'https://techsavvy.com'
          },
          averageRating: 4.8,
          reviewCount: 12,
          isVerified: true
        },
        {
          _id: '2',
          name: 'Bloom Wellness Center',
          description: 'Holistic health and wellness services including yoga, meditation, and nutrition counseling.',
          category: 'Beauty & Wellness',
          owner: { displayName: 'Dr. Sarah Chen', profilePicture: '' },
          location: {
            address: '456 Wellness Ave',
            city: 'Brooklyn',
            state: 'NY',
            zipCode: '11201',
            coordinates: { lat: 40.6892, lng: -73.9442 }
          },
          contact: {
            phone: '(555) 987-6543',
            email: 'info@bloomwellness.com',
            website: 'https://bloomwellness.com'
          },
          averageRating: 4.9,
          reviewCount: 28,
          isVerified: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterBusiness = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/businesses', newBusiness);
      setBusinesses([response.data.data.business, ...businesses]);
      setNewBusiness({
        name: '',
        description: '',
        category: '',
        location: {
          address: '',
          city: '',
          state: '',
          zipCode: '',
          coordinates: { lat: 0, lng: 0 }
        },
        contact: {
          phone: '',
          email: '',
          website: ''
        }
      });
      setShowRegisterForm(false);
    } catch (error) {
      console.error('Error registering business:', error);
      // For development, add to local state
      const dummyBusiness = {
        _id: Date.now().toString(),
        ...newBusiness,
        owner: { displayName: 'You', profilePicture: '' },
        averageRating: 0,
        reviewCount: 0,
        isVerified: false
      };
      setBusinesses([dummyBusiness, ...businesses]);
      setShowRegisterForm(false);
    }
  };

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Business Hub</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and support women-led businesses in your community
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search businesses..."
                  className="pl-10 input-field"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field w-full lg:w-auto"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setShowMap(false)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  !showMap ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setShowMap(true)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  showMap ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Map
              </button>
            </div>

            {/* Register Business Button */}
            <button
              onClick={() => setShowRegisterForm(true)}
              className="btn-primary whitespace-nowrap"
            >
              Register Business
            </button>
          </div>
        </div>

        {/* Map View */}
        {showMap && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'demo-key'}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={12}
              >
                {filteredBusinesses.map((business) => (
                  <Marker
                    key={business._id}
                    position={business.location.coordinates}
                    onClick={() => setSelectedBusiness(business)}
                  />
                ))}
                
                {selectedBusiness && (
                  <InfoWindow
                    position={selectedBusiness.location.coordinates}
                    onCloseClick={() => setSelectedBusiness(null)}
                  >
                    <div className="p-2 max-w-xs">
                      <h3 className="font-semibold text-lg mb-1">{selectedBusiness.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{selectedBusiness.category}</p>
                      <p className="text-sm mb-2">{selectedBusiness.description.substring(0, 100)}...</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-medium">{selectedBusiness.averageRating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({selectedBusiness.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        )}

        {/* Business Register Form */}
        {showRegisterForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Register Your Business</h2>
                  <button
                    onClick={() => setShowRegisterForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleRegisterBusiness} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={newBusiness.name}
                        onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newBusiness.category}
                        onChange={(e) => setNewBusiness({ ...newBusiness, category: e.target.value })}
                        className="input-field"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newBusiness.description}
                      onChange={(e) => setNewBusiness({ ...newBusiness, description: e.target.value })}
                      className="input-field h-24 resize-none"
                      placeholder="Describe your business..."
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={newBusiness.location.address}
                        onChange={(e) => setNewBusiness({
                          ...newBusiness,
                          location: { ...newBusiness.location, address: e.target.value }
                        })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={newBusiness.location.city}
                        onChange={(e) => setNewBusiness({
                          ...newBusiness,
                          location: { ...newBusiness.location, city: e.target.value }
                        })}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={newBusiness.location.state}
                        onChange={(e) => setNewBusiness({
                          ...newBusiness,
                          location: { ...newBusiness.location, state: e.target.value }
                        })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={newBusiness.location.zipCode}
                        onChange={(e) => setNewBusiness({
                          ...newBusiness,
                          location: { ...newBusiness.location, zipCode: e.target.value }
                        })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={newBusiness.contact.phone}
                        onChange={(e) => setNewBusiness({
                          ...newBusiness,
                          contact: { ...newBusiness.contact, phone: e.target.value }
                        })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newBusiness.contact.email}
                        onChange={(e) => setNewBusiness({
                          ...newBusiness,
                          contact: { ...newBusiness.contact, email: e.target.value }
                        })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={newBusiness.contact.website}
                        onChange={(e) => setNewBusiness({
                          ...newBusiness,
                          contact: { ...newBusiness.contact, website: e.target.value }
                        })}
                        className="input-field"
                        placeholder="https://"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="btn-primary flex-1">
                      Register Business
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRegisterForm(false)}
                      className="btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Business List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business._id} business={business} />
            ))}
          </div>
        )}

        {!loading && filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-4">Be the first to register your business!</p>
            <button
              onClick={() => setShowRegisterForm(true)}
              className="btn-primary"
            >
              Register Your Business
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Businesses;