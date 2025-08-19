import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js'; // ✅ Import your user routes

// Get __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ✅ Serve static images

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/flavourFusion', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ----------------- Models -----------------
const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  bestseller: { type: Boolean, default: false },
  category: String,
  image: String,
}, { collection: 'menuitems' });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

const orderSchema = new mongoose.Schema({
  userDetails: {
    name: String,
    address: String,
    phone: String,
    pincode: { type: String, default: '626001' },
  },
  cart: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serviceType: { type: String, required: true },
  foodQuality: { type: Number, required: true },
  serviceEfficiency: { type: Number, required: true },
  cleanliness: { type: Number, required: true },
  overallImpression: { type: Number, required: true },
}, { collection: 'feedbacks' });

const Feedback = mongoose.model('Feedback', feedbackSchema);

// ----------------- Routes -----------------

// Menu Routes
app.get('/api/menu', async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const menuItems = await MenuItem.find(filter);

    const modifiedItems = menuItems.map(item => ({
      ...item.toObject(),
      image: item.image ? `http://localhost:5000${item.image}` : null
    }));

    res.json(modifiedItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/menu', upload.single('image'), async (req, res) => {
  const { name, price, bestseller, category } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const newItem = new MenuItem({
    name,
    price,
    bestseller: bestseller === 'true',
    category,
    image: imagePath,
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json({
      ...savedItem.toObject(),
      image: savedItem.image ? `http://localhost:5000${savedItem.image}` : null
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/menu/:id', upload.single('image'), async (req, res) => {
  const { name, price, bestseller, category } = req.body;
  const updateData = {
    name,
    price,
    bestseller: bestseller === 'true',
    category,
  };
  if (req.file) updateData.image = `/uploads/${req.file.filename}`;

  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({
      ...updated.toObject(),
      image: updated.image ? `http://localhost:5000${updated.image}` : null
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/menu/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (item?.image) {
      const imgPath = path.join(__dirname, item.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Feedback Routes
app.post('/api/feedbacks', async (req, res) => {
  const { name, serviceType, foodQuality, serviceEfficiency, cleanliness, overallImpression } = req.body;
  if (!name || !serviceType || foodQuality == null || serviceEfficiency == null || cleanliness == null || overallImpression == null) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const newFeedback = new Feedback({
    name,
    serviceType,
    foodQuality,
    serviceEfficiency,
    cleanliness,
    overallImpression,
  });

  try {
    const saved = await newFeedback.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Order Routes
app.post('/api/orders', async (req, res) => {
  const { userDetails, cart, total } = req.body;

  try {
    const order = new Order({ userDetails, cart, total });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ User Routes
app.use('/api/users', userRoutes);

// ----------------- Analysis Routes -----------------

// Daily Sales by Date
app.get('/api/analysis/daily-sales', async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Veg vs Non-Veg Orders
app.get('/api/analysis/veg-vs-nonveg', async (req, res) => {
  try {
    const nonVegKeywords = ['chicken', 'mutton', 'fish', 'crab', 'seafood', 'prawns', 'egg'];

    const orders = await Order.find();
    let veg = 0, nonveg = 0;

    orders.forEach(order => {
      order.cart.forEach(item => {
        const lower = item.name.toLowerCase();
        const isNonVeg = nonVegKeywords.some(keyword => lower.includes(keyword));
        if (isNonVeg) nonveg += item.quantity;
        else veg += item.quantity;
      });
    });

    res.json({ veg, nonveg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Most Sold Items
app.get('/api/analysis/top-items', async (req, res) => {
  try {
    const allOrders = await Order.find();
    const itemCounts = {};

    allOrders.forEach(order => {
      order.cart.forEach(item => {
        if (!itemCounts[item.name]) {
          itemCounts[item.name] = 0;
        }
        itemCounts[item.name] += item.quantity;
      });
    });

    const sortedItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json(sortedItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------- Start Server -----------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
