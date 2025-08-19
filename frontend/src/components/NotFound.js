import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container text-center">
      <h2>404 - Page Not Found</h2>
      <Link to="/">Go to Login</Link>
    </div>
  );
};

export default NotFound;
