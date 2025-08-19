import React, { useEffect, useState } from 'react';
import './Menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(res => res.json())
      .then(data => setMenuItems(data));
  }, []);

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categoryOrder = [
    'Appetizers',
    'Soups',
    'Salads',
    'Main Course',
    'Breads',
    'Biryani',
    'Desserts',
    'Beverages'
  ];

  return (
    <div className="menu-page">
      <h1 className="menu-heading">Taste Menu</h1>
      <p className="menu-hours">Open Everyday 9AM - 9PM</p>
      <div className="menu-vertical-list">
        {categoryOrder.map(category => (
          groupedItems[category] && (
            <div key={category} className="menu-section">
              <h2 className="menu-category">{category}</h2>
              <ul className="menu-items">
                {groupedItems[category].map(item => (
  <li key={item._id} className="menu-item">
  {item.name} ₹{item.price}
</li>
                ))}
              </ul>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Menu;
