import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OrderOnline.css';

const OrderOnline = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [userDetails, setUserDetails] = useState({
    name: '',
    streetNo: '',
    streetName: '',
    city: '',
    district: 'Virudhunagar',
    phone: '',
    paymentMode: 'Cash on Delivery',
  });
  const [showOrderForm, setShowOrderForm] = useState(false);

  const navigate = useNavigate();
  const orderFormRef = useRef(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchMenu = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/menu');
      setMenuItems(res.data);
      setFilteredItems(res.data);
      const uniqueCategories = [...new Set(res.data.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching menu:', err);
    }
  };

  const addToCart = (item) => {
    const exists = cart.find(cartItem => cartItem._id === item._id);
    if (exists) {
      setCart(cart.map(cartItem => cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item._id !== itemId));
  };

  const incrementQuantity = (itemId) => {
    setCart(cart.map(item => item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decrementQuantity = (itemId) => {
    setCart(cart => {
      const item = cart.find(item => item._id === itemId);
      if (item.quantity === 1) {
        return cart.filter(item => item._id !== itemId);
      } else {
        return cart.map(item => item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item);
      }
    });
  };

  const handleOrder = () => {
    setShowOrderForm(true);
    setTimeout(() => {
      orderFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = async () => {
    const orderData = {
      userDetails,
      cart,
      total: parseFloat(calculateTotal()),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      alert('Order placed successfully!');
      setCart([]);
      setShowOrderForm(false);
      setUserDetails({
        name: '',
        streetNo: '',
        streetName: '',
        city: '',
        district: 'Virudhunagar',
        phone: '',
        paymentMode: 'Cash on Delivery',
      });
      navigate('/feedback');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.quantity * parseFloat(item.price), 0).toFixed(2);
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const handleFilter = (type) => {
    let sorted = [...menuItems];
    switch (type) {
      case 'veg':
        sorted = menuItems.filter(item => !/chicken|mutton|fish|crab|seafood|prawns|egg/i.test(item.name));
        break;
      case 'nonveg':
        sorted = menuItems.filter(item => /chicken|mutton|fish|crab|seafood|prawns|egg/i.test(item.name));
        break;
      case 'low':
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'high':
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'bestseller':
        sorted = menuItems.filter(item => item.bestseller);
        break;
      default:
        sorted = [...menuItems];
    }
    setFilteredItems(sorted);
  };

  return (
    <div className="order-online-container">
      <div className="menu-section">
        <div className="header">
          <div className="filter-button">
            <button className="btn" onClick={toggleFilters}>Filter</button>
            {filtersVisible && (
              <div className="filter-options">
                <button onClick={() => handleFilter('low')}>Low to High</button>
                <button onClick={() => handleFilter('high')}>High to Low</button>
                <button onClick={() => handleFilter('veg')}>Veg</button>
                <button onClick={() => handleFilter('nonveg')}>Non-Veg</button>
                <button onClick={() => handleFilter('bestseller')}>Bestseller</button>
              </div>
            )}
          </div>
          <h2 className="title">Order Online</h2>
          <div className="cart-button">
            <button className="btn" onClick={() => document.getElementById('cart').scrollIntoView({ behavior: 'smooth' })}>
              Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
            </button>
          </div>
        </div>

        {categories.map(category => (
          <div key={category} className="category-block">
            <h3 className="title">{category}</h3>
            <div className="menu-grid">
              {filteredItems.filter(item => item.category === category).map(item => (
                <div key={item._id} className="menu-card">
                  {item.image && (
                    <img src={item.image} alt={item.name} />
                  )}
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                  <p>{/chicken|mutton|fish|crab|seafood|prawns|egg/i.test(item.name) ? 'Non-Veg' : 'Veg'}</p>
                  {item.bestseller && <p className="bestseller">⭐ Bestseller</p>}
                  <button onClick={() => addToCart(item)}>Add to Cart</button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="cart-container" id="cart">
          <h3 className="title">Cart</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              {cart.map(item => (
                <div key={item._id} className="cart-item">
                  <span>{item.name} - ₹{item.price}</span>
                  <div className="qty-controls">
                    <button onClick={() => decrementQuantity(item._id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => incrementQuantity(item._id)}>+</button>
                  </div>
                </div>
              ))}
              <p className="total-amount">Total Amount: ₹{calculateTotal()}</p>
              <button className="btn small-btn" onClick={handleOrder}>Order</button>
            </div>
          )}
        </div>

        {showOrderForm && (
          <div className="order-form-container small" ref={orderFormRef}>
            <h3>Order Details</h3>
            <input type="text" name="name" value={userDetails.name} onChange={handleChange} placeholder="Name" required />
            <input type="text" name="streetNo" value={userDetails.streetNo} onChange={handleChange} placeholder="Street No" required />
            <input type="text" name="streetName" value={userDetails.streetName} onChange={handleChange} placeholder="Street Name" required />
            <input type="text" name="city" value={userDetails.city} onChange={handleChange} placeholder="City" required />
            <input type="text" name="district" value={userDetails.district} onChange={handleChange} placeholder="District" />
            <input type="text" name="phone" value={userDetails.phone} onChange={handleChange} placeholder="Phone Number" required />
            <input type="text" name="paymentMode" value={userDetails.paymentMode} readOnly />
            <button className="btn" onClick={handleSubmit}>Place Order</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderOnline;
