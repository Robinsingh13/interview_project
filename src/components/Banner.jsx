import React, { useState, useEffect } from 'react';

const Banner = ({ isVisible, description, expirationTime, link, imageUrl }) => {
  // Calculate the remaining time
  const calculateTimeLeft = () => {
    const now = new Date();
    const expiration = new Date(expirationTime);
    const timeDiff = expiration - now;
    return Math.max(Math.floor(timeDiff / 1000), 0); // Convert to seconds
  };
{console.log(expirationTime)}
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        if (newTimeLeft <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
        } else {
          setTimeLeft(newTimeLeft);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isVisible, expirationTime]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return isVisible && timeLeft > 0 ? (
    <div className="bg-gray-100 p-6 text-center">
      {imageUrl && <img src={imageUrl} alt="Banner" className="w-full h-auto mb-4" />}
      <p className="text-lg mb-4">{description}</p>
      <a href={link} className="text-green-500 underline mb-2" target="_blank" rel="noopener noreferrer">
        Learn More
      </a>
      <p className="text-red-500 font-bold">Time left: {formatTime(timeLeft)}</p>
    </div>
  ) : null;
};

export default Banner;
