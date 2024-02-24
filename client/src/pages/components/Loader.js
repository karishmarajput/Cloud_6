import React from 'react';
import './loader.css'; // Import the corresponding CSS file

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
