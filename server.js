const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kazakh-menu';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Mongoose Schema
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Appetizers', 'Main Courses', 'Dessert', 'Drinks'],
      message: '{VALUE} is not a valid category'
    }
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Kazakh+Dish'
  }
}, {
  timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Validation Middleware
const validateMenuItem = (req, res, next) => {
  const { name, description, price, category } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  if (!description || description.trim().length < 10) {
    errors.push('Description is required and must be at least 10 characters');
  }
  if (price === undefined || price < 0) {
    errors.push('Price is required and cannot be negative');
  }
  if (!category || !['Appetizers', 'Main Courses', 'Dessert', 'Drinks'].includes(category)) {
    errors.push('Category must be one of: Appetizers, Main Courses, Dessert, Drinks');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }

  next();
};

// ================== CRUD ROUTES ==================

// CREATE - Add new menu item
app.post('/menu-items', validateMenuItem, async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json({
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ 
      error: 'Failed to create menu item',
      details: error.message 
    });
  }
});

// READ - Get all menu items
app.get('/menu-items', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search in name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const menuItems = await MenuItem.find(query).sort({ createdAt: -1 });
    res.json({
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to retrieve menu items',
      details: error.message 
    });
  }
});

// READ - Get single menu item by ID
app.get('/menu-items/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid menu item ID' });
    }

    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ data: menuItem });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to retrieve menu item',
      details: error.message 
    });
  }
});

// UPDATE - Update menu item by ID
app.put('/menu-items/:id', validateMenuItem, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid menu item ID' });
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ 
      error: 'Failed to update menu item',
      details: error.message 
    });
  }
});

// DELETE - Remove menu item by ID
app.delete('/menu-items/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid menu item ID' });
    }

    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({
      message: 'Menu item deleted successfully',
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to delete menu item',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${MONGODB_URI}`);
});
