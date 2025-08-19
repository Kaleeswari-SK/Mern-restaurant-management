import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div>
      <Header navigate={navigate} handleLogout={handleLogout} />
      <HeroSection navigate={navigate} />
      <ChefRecommended />
      <About />
      <Testimonials />
      <Footer />
    </div>
  );
};

// ----- Header -----
const Header = ({ navigate, handleLogout }) => {
  return (
    <div style={headerStyle}>
      <button style={headerBtn} onClick={() => navigate("/menu")}>Menu</button>
      <button style={headerBtn} onClick={() => navigate("/order-online")}>Order Online</button>
      <button style={headerBtn} onClick={() => window.scrollTo(0, document.getElementById("about").offsetTop)}>About</button>
      <button style={headerBtn} onClick={handleLogout}>Logout</button>
    </div>
  );
};

const headerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  padding: "10px 20px",
  backgroundColor: "#f8f8f8",
  gap: "10px",
};

const headerBtn = {
  padding: "6px 12px",
  fontSize: "14px",
  cursor: "pointer",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

// ----- Hero Section -----
const HeroSection = ({ navigate }) => {
  return (
    <div style={heroStyle}>
      <div style={overlayStyle}>
        <h1 style={titleStyle}>Welcome to Flavour Fusion</h1>
        <p style={subtitleStyle}>Taste the tradition, served with a twist</p>
        <button style={buttonStyle} onClick={() => navigate("/order-online")}>
          Order Now
        </button>
      </div>
    </div>
  );
};

const heroStyle = {
  backgroundImage: "url('/images/hero.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "90vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
};

const overlayStyle = {
  backgroundColor: "rgba(0,0,0,0.5)",
  color: "#fff",
  padding: "40px",
  borderRadius: "12px",
  textAlign: "center",
};

const titleStyle = {
  fontSize: "48px",
  fontWeight: "bold",
};

const subtitleStyle = {
  fontSize: "24px",
  marginTop: "10px",
  marginBottom: "20px",
};

const buttonStyle = {
  padding: "10px 24px",
  fontSize: "18px",
  backgroundColor: "#ff5722",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

// ----- Chef Recommended -----
const categories = [
  { name: "Biryani", img: "/images/biryani.jpg" },
  { name: "Bucket Biriyani", img: "/images/bucket.jpg" },
  { name: "Soups", img: "/images/soup.jpg" },
  { name: "Starters", img: "/images/starter.jpg" },
  { name: "Main Course", img: "/images/maincourse.jpg" },
  { name: "Noodles & Fried Rice", img: "/images/noodles.jpg" },
  { name: "Breads Without Gravy", img: "/images/breads.jpg" },
  { name: "Rice Bowl", img: "/images/ricebowl.jpg" },
  { name: "Desserts", img: "/images/desserts.jpg" },
  { name: "Ice Cream", img: "/images/icecream.jpg" }
];

const ChefRecommended = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#800040" }}>Chef Recommended</h2>
      <br></br>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {categories.map((item, index) => (
          <div key={index} style={{ width: "150px", margin: "10px", textAlign: "center" }}>
            <img
              src={item.img}
              alt={item.name}
              style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "10px" }}
            />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----- About Section -----
const About = () => {
  return (
    <div id="about" style={aboutStyle}>
      <h2 style={{ textAlign: "center", color: "#800040" }}>About Flavour Fusion</h2>
      <br></br>
      <p style={{ textAlign: "center", maxWidth: "800px", margin: "10px auto", fontSize: "18px" }}>
        Flavour Fusion is a celebration of taste where tradition meets innovation. We bring the essence of South Indian cuisine and fuse it with modern culinary twists to serve dishes that are unique, flavorful, and unforgettable. Join us for an experience that tantalizes your taste buds.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
        <img src="/images/about1.png" alt="Restaurant Interior" style={aboutImg} />
        <img src="/images/about2.png" alt="Chef Special" style={aboutImg} />
      </div>
    </div>
  );
};

const aboutStyle = {
  padding: "40px 20px",
  backgroundColor: "#f2f2f2",
};

const aboutImg = {
  width: "300px",
  height: "200px",
  objectFit: "cover",
  borderRadius: "10px",
};

// ----- Testimonials -----
const Testimonials = () => {
  const reviews = [
    { name: "Priya", comment: "Absolutely delicious! Will order again!" },
    { name: "Rahul", comment: "Fast delivery and great food quality." },
    { name: "Neha", comment: "The flavors were amazing. Highly recommend!" }
  ];

  return (
    <div style={testimonialContainerStyle}>
      <h2 style={{ textAlign: "center" }}>Customer Reviews</h2>
      <div style={testimonialRowStyle}>
        {reviews.map((review, idx) => (
          <div key={idx} style={testimonialCardStyle}>
            <p>"{review.comment}"</p>
            <h4>- {review.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

const testimonialContainerStyle = {
  padding: "40px 20px",
  backgroundColor: "#f9f9f9"
};

const testimonialRowStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "20px"
};

const testimonialCardStyle = {
  width: "250px",
  backgroundColor: "#fff",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  fontStyle: "italic"
};

// ----- Footer -----
const Footer = () => (
  <footer style={footerStyle}>
    <p>&copy; 2025 Flavour Fusion. All rights reserved.</p>
  </footer>
);

const footerStyle = {
  backgroundColor: "#333",
  color: "#fff",
  padding: "20px",
  textAlign: "center"
};

export default HomePage;
