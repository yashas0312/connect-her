const Business = require('../models/Business');

// Get all businesses with optional category filter
exports.getAllBusinesses = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { status: 'approved' };
    
    if (category) {
      filter.category = category;
    }

    const businesses = await Business.find(filter)
      .populate('owner', 'displayName email')
      .sort({ createdAt: -1 });

    res.json({ businesses });
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch businesses' } });
  }
};

// Get single business by ID
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('owner', 'displayName email');

    if (!business) {
      return res.status(404).json({ error: { message: 'Business not found' } });
    }

    res.json({ business });
  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch business' } });
  }
};

// Create new business
exports.createBusiness = async (req, res) => {
  try {
    const { name, description, category, address, coordinates, contact, userId } = req.body;

    // Validation
    if (!name || !description || !category || !address || !coordinates || !userId) {
      return res.status(400).json({ 
        error: { message: 'Name, description, category, address, coordinates, and userId are required' } 
      });
    }

    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({ 
        error: { message: 'Coordinates must be an array of [longitude, latitude]' } 
      });
    }

    const business = await Business.create({
      name,
      description,
      category,
      address,
      location: {
        type: 'Point',
        coordinates: coordinates // [longitude, latitude]
      },
      contact: contact || {},
      owner: userId
    });

    const populatedBusiness = await Business.findById(business._id)
      .populate('owner', 'displayName email');

    res.status(201).json({ business: populatedBusiness });
  } catch (error) {
    console.error('Create business error:', error);
    res.status(500).json({ error: { message: 'Failed to create business' } });
  }
};

// Update business
exports.updateBusiness = async (req, res) => {
  try {
    const { userId } = req.body;
    const businessId = req.params.id;

    const business = await Business.findById(businessId);
    
    if (!business) {
      return res.status(404).json({ error: { message: 'Business not found' } });
    }

    // Check ownership
    if (business.owner.toString() !== userId) {
      return res.status(403).json({ 
        error: { message: 'Not authorized to update this business' } 
      });
    }

    const { name, description, category, address, coordinates, contact } = req.body;
    
    if (name) business.name = name;
    if (description) business.description = description;
    if (category) business.category = category;
    if (address) business.address = address;
    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      business.location = {
        type: 'Point',
        coordinates: coordinates
      };
    }
    if (contact) business.contact = { ...business.contact, ...contact };

    await business.save();

    const updatedBusiness = await Business.findById(businessId)
      .populate('owner', 'displayName email');

    res.json({ business: updatedBusiness });
  } catch (error) {
    console.error('Update business error:', error);
    res.status(500).json({ error: { message: 'Failed to update business' } });
  }
};

// Delete business
exports.deleteBusiness = async (req, res) => {
  try {
    const { userId, isAdmin } = req.body;
    const businessId = req.params.id;

    const business = await Business.findById(businessId);
    
    if (!business) {
      return res.status(404).json({ error: { message: 'Business not found' } });
    }

    // Check ownership or admin
    if (business.owner.toString() !== userId && !isAdmin) {
      return res.status(403).json({ 
        error: { message: 'Not authorized to delete this business' } 
      });
    }

    await Business.findByIdAndDelete(businessId);

    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Delete business error:', error);
    res.status(500).json({ error: { message: 'Failed to delete business' } });
  }
};

// Get nearby businesses (geospatial query)
exports.getNearbyBusinesses = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ 
        error: { message: 'Latitude and longitude are required' } 
      });
    }

    const maxDistance = radius ? parseInt(radius) : 5000; // Default 5km

    const businesses = await Business.find({
      status: 'approved',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: maxDistance
        }
      }
    }).populate('owner', 'displayName email');

    res.json({ businesses });
  } catch (error) {
    console.error('Get nearby businesses error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch nearby businesses' } });
  }
};
