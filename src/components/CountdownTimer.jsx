import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ expirationTime }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const expiration = new Date(expirationTime);
    const timeDiff = expiration - now;
    return Math.max(Math.floor(timeDiff / 1000), 0); // Convert to seconds
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    if (timeLeft > 0) {
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
  }, [expirationTime, timeLeft]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div>
      <p className="text-red-500 font-bold">Time left: {formatTime(timeLeft)}</p>
    </div>
  );
};

export default CountdownTimer;
