import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', bestseller: false, category: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [customerFeedback, setCustomerFeedback] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const formRef = useRef(null);

  const categories = ['Appetizers', 'Soups', 'Salads', 'Main Course', 'Breads', 'Biryani', 'Desserts', 'Beverages'];

  useEffect(() => {
    if (activeSection === 'viewMenu') fetchMenu();
    if (activeSection === 'feedback') fetchCustomerFeedback();
    if (activeSection === 'orders' || activeSection === 'analysis') fetchOrderDetails();
  }, [activeSection]);

  const fetchMenu = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/menu');
      setMenuItems(res.data);
    } catch (err) {
      console.error('Error fetching menu:', err);
    }
  };

  const fetchCustomerFeedback = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feedbacks');
      setCustomerFeedback(res.data);
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrderDetails(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('bestseller', formData.bestseller);
    data.append('category', formData.category);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/menu/${editingId}`, data);
      } else {
        await axios.post('http://localhost:5000/api/menu', data);
      }
      setFormData({ name: '', price: '', bestseller: false, category: '', image: null });
      setImagePreview(null);
      setEditingId(null);
      setActiveSection('viewMenu');
      fetchMenu();
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      price: item.price,
      bestseller: item.bestseller,
      category: item.category,
      image: null,
    });
    setImagePreview(`http://localhost:5000${item.image}`);
    setActiveSection('addItem');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`);
      fetchMenu();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleLogout = () => navigate('/');

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-US');

  const dailySales = orderDetails.reduce((acc, order) => {
    const day = new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const mostSoldItem = orderDetails.flatMap(order => order.cart)
    .reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity;
      return acc;
    }, {});
  const mostSold = Object.entries(mostSoldItem).reduce((max, [name, count]) => count > max.count ? { name, count } : max, { name: '', count: 0 });
  const highestSalesDay = Object.entries(dailySales).reduce((max, [day, count]) => count > max.count ? { day, count } : max, { day: '', count: 0 });

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h2 style={{
         width: '100%',
         backgroundColor: 'orangered',
         color: 'white',
         padding: '1rem 0',
         textAlign: 'center',
         fontSize: '2rem',
         fontWeight: 'bold'
          }}>Flavour Fusion Admin Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <div className="sidebar">
        <ul>
          <li onClick={() => setActiveSection('addItem')}>Add New Item</li>
          <li onClick={() => setActiveSection('viewMenu')}>View Menu</li>
          <li onClick={() => setActiveSection('feedback')}>Customer Feedback</li>
          <li onClick={() => setActiveSection('orders')}>Order Details</li>
          <li onClick={() => setActiveSection('analysis')}>Analysis</li>
        </ul>
      </div>

      <div className="content">
        {activeSection === 'home' && (
          <div className="center-content">
            <img src="/images/logo.png" alt="Flavour Fusion Logo" className="centered-image"  />
          </div>
        )}

        {activeSection === 'addItem' && (
          <form onSubmit={handleSubmit} className="form" ref={formRef}>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
            <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" required />
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <label>
              <input type="checkbox" name="bestseller" checked={formData.bestseller} onChange={handleChange} />
              Bestseller
            </label>
            <input name="image" type="file" onChange={handleChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="preview-image" />}
            <button type="submit">{editingId ? 'Update' : 'Add'} Menu Item</button>
          </form>
        )}

        {activeSection === 'viewMenu' && categories.map((cat) => (
  <div key={cat} className="menu-category-box">
    <h3 className="category-title">{cat}</h3>
    <div className="menu-grid">
      {menuItems.filter(item => item.category === cat).map((item) => (
        <div key={item._id} className="menu-card">
          {item.image && <img src={item.image} alt={item.name} className="menu-img" />}
          <h4>{item.name}</h4>
          <p className="menu-price">₹{item.price}</p>
          {item.bestseller && <p className="bestseller">⭐ Bestseller</p>}
          <div className="menu-buttons">
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  </div>
))}


        {activeSection === 'feedback' && (
          <div className="feedback-box">
            <h3>Customer Feedback</h3>
            <table border="1">
              <thead>
                <tr>
                  <th>Name</th><th>Service</th><th>Food</th><th>Efficiency</th><th>Cleanliness</th><th>Overall</th>
                </tr>
              </thead>
              <tbody>
                {customerFeedback.map(fb => (
                  <tr key={fb._id}>
                    <td>{fb.name}</td><td>{fb.serviceType}</td><td>{fb.foodQuality}</td>
                    <td>{fb.serviceEfficiency}</td><td>{fb.cleanliness}</td><td>{fb.overallImpression}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'orders' && (
          <div className="order-details-box">
            <h3>Order Details</h3>
            <table border="1">
              <thead>
                <tr>
                  <th>#</th><th>Order ID</th><th>Name</th><th>Items (Qty)</th><th>Phone</th><th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order._id}</td>
                    <td>{order.userDetails.name}</td>
                    <td>{order.cart.map(item => `${item.name} (${item.quantity})`).join(', ')}</td>
                    <td>{order.userDetails.phone}</td>
                    <td>₹{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'analysis' && (
  <div className="analysis-box">
    <h3>Sales Analysis</h3>
    <table border="1">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Total Orders Placed</td>
          <td>{orderDetails.length}</td>
        </tr>
        <tr>
          <td>Most Sold Dish</td>
          <td>{mostSold.name} ({mostSold.count} sold)</td>
        </tr>
        <tr>
          <td>Highest Sales Day</td>
          <td>{highestSalesDay.day} ({highestSalesDay.count} orders)</td>
        </tr>
      </tbody>
    </table>
  </div>
)}
      </div>
    </div>
  );
};

export default AdminDashboard;
