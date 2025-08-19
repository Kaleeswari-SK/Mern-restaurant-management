import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigation hook
import './Feedback.css';

const Feedback = () => {
    const [name, setName] = useState('');
    const [serviceType, setServiceType] = useState('Dine-In');
    const [ratings, setRatings] = useState({
        foodQuality: 0,
        serviceEfficiency: 0,
        cleanliness: 0,
        overallImpression: 0,
    });

    const navigate = useNavigate(); // ✅ Initialize navigation

    const handleStarClick = (category, index) => {
        setRatings({ ...ratings, [category]: index + 1 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const feedback = {
            name,
            serviceType,
            ...ratings,
        };

        try {
            const response = await fetch('http://localhost:5000/api/feedbacks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedback),
            });

            if (response.ok) {
                alert('Feedback submitted successfully!');
                // ✅ Clear fields
                setName('');
                setServiceType('Dine-In');
                setRatings({
                    foodQuality: 0,
                    serviceEfficiency: 0,
                    cleanliness: 0,
                    overallImpression: 0,
                });
                // ✅ Navigate to Home page
                navigate('/');
            } else {
                alert('Failed to submit feedback.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback.');
        }
    };

    const renderStars = (category) => {
        return [...Array(5)].map((_, index) => (
            <span
                key={index}
                onClick={() => handleStarClick(category, index)}
                className={index < ratings[category] ? 'star filled' : 'star'}
            >
                ★
            </span>
        ));
    };

    return (
        <div className="feedback-form">
            <h1>Customer Feedback</h1>
            <p>Dear Customer, we care about your opinion. Please take your time to rate our services.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    required
                >
                    <option value="Dine-In">Dine-In</option>
                    <option value="Takeaway">Takeaway</option>
                    <option value="Order Online">Order Online</option>
                </select>

                <div className="category">
                    <label>Food Quality:</label>
                    {renderStars('foodQuality')}
                </div>

                <div className="category">
                    <label>Service Efficiency:</label>
                    {renderStars('serviceEfficiency')}
                </div>

                <div className="category">
                    <label>Cleanliness:</label>
                    {renderStars('cleanliness')}
                </div>

                <div className="category">
                    <label>Overall Impression:</label>
                    {renderStars('overallImpression')}
                </div>

                <button type="submit">Submit Feedback</button>
            </form>
        </div>
    );
};

export default Feedback;
