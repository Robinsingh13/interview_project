import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BannerList from './components/BannerList';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

const App = () => {
  const [banners, setBanners] = useState([]);
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL; // Access the API base URL from the environment variable

  const fetchBanners = async () => {
    try {
      const result = await axios.get(`${API_BASE_URL}/get-banners`);
      setBanners(result.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleBannerUpdate = async () => {
    await fetchBanners();
  };

  const handleBannerAdd = async () => {
    await fetchBanners();
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <header className="bg-green-500 text-white p-4 text-center">
          <h1 className="text-2xl">My Dynamic Website</h1>
          <nav>
            <Link to="/" className="text-white mr-4">Home</Link>
            <Link to="/dashboard" className="text-white">Dashboard</Link>
          </nav>
        </header>

        <main className="flex-1 p-8 bg-white">
          <Routes>
            <Route path="/dashboard" element={
              <Dashboard
                banners={banners}
                onBannerUpdate={handleBannerUpdate}
                onBannerAdd={handleBannerAdd}
              />
            } />
            <Route path="/" element={
              <BannerList
                banners={banners}
                onEdit={(id) => setSelectedBannerId(id)}
              />
            } />
          </Routes>
        </main>

        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>© 2024 My Website. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
