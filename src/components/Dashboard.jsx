import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import CountdownTimer from './CountdownTimer'; // Import the CountdownTimer component
import api from '../services/api';

Modal.setAppElement('#root');

const Dashboard = ({ banners, onBannerUpdate, onBannerAdd, fetchBanners }) => {
  const [description, setDescription] = useState('');
  const [timer, setTimer] = useState(60);
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [localBanners, setLocalBanners] = useState([]);

  useEffect(() => {
    // Initialize banners on component mount
    setLocalBanners(banners);
  }, [banners]);

  useEffect(() => {
    if (selectedBannerId) {
      const fetchBanner = async () => {
        try {
          const result = await api.fetchBannerById(selectedBannerId);
          const data = result.data;
          setDescription(data.description);
          setTimer(data.timer);
          setLink(data.link);
          setIsVisible(data.isVisible === 1);
          setImageUrl(data.image_url || '');
        } catch (error) {
          console.error(`Error fetching banner with ID ${selectedBannerId}:`, error);
        }
      };
      fetchBanner();
      setModalIsOpen(true);
    } else {
      resetForm();
    }
  }, [selectedBannerId]);

  const handleUpdate = async () => {
    const expirationTime = new Date(Date.now() + timer * 1000).toISOString();
  
    try {
      if (selectedBannerId) {
        await api.updateBanner(selectedBannerId, {
          description,
          timer,
          link,
          isVisible: isVisible ? 1 : 0,
          imageUrl,
          expirationTime,
        });
      } else {
        await api.addBanner({
          description,
          timer,
          link,
          isVisible: isVisible ? 1 : 0,
          imageUrl,
          expirationTime,
        });
      }
      await fetchBanners(); // Fetch updated banners from the backend
      resetForm();
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error updating or adding banner:', error);
    }
  };

  const resetForm = () => {
    setDescription('');
    setTimer(60);
    setLink('');
    setIsVisible(true);
    setImageUrl('');
    setSelectedBannerId(null);
  };

  const handleVisibilityToggle = async (bannerId, currentVisibility) => {
    // Optimistic UI update
    const updatedBanners = localBanners.map(banner =>
      banner.id === bannerId ? { ...banner, isVisible: !currentVisibility } : banner
    );
    setLocalBanners(updatedBanners);

    try {
      await api.updateBannerVisibility(bannerId, currentVisibility ? 0 : 1);
      await fetchBanners(); // Ensure data is consistent with the backend
    } catch (error) {
      console.error(`Error updating visibility for banner with ID ${bannerId}:`, error);
      // Rollback UI update if API call fails
      const revertedBanners = localBanners.map(banner =>
        banner.id === bannerId ? { ...banner, isVisible: currentVisibility } : banner
      );
      setLocalBanners(revertedBanners);
    }
  };

  return (
    <div className="bg-gray-100 p-8 my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Banner Controls</h2>
        <button
          onClick={() => {
            setSelectedBannerId(null);
            setModalIsOpen(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Banner
        </button>
      </div>

      {/* Modal for Adding/Updating Banners */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Banner Form"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {selectedBannerId ? 'Update Banner' : 'Add Banner'}
        </h2>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Banner Description:</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Banner Timer (seconds):</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={timer}
            onChange={(e) => setTimer(Number(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Banner Link:</label>
          <input
            type="url"
            className="w-full p-2 border border-gray-300 rounded"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Banner Image URL:</label>
          <input
            type="url"
            className="w-full p-2 border border-gray-300 rounded"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleUpdate}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {selectedBannerId ? 'Update Banner' : 'Add Banner'}
          </button>
          <button
            onClick={() => setModalIsOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Banner Table */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Banner List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">ID</th>
              <th className="border-b px-4 py-2">Image</th>
              <th className="border-b px-4 py-2">Description</th>
              <th className="border-b px-4 py-2">Timer (s)</th>
              <th className="border-b px-4 py-2">Link</th>
              <th className="border-b px-4 py-2">Visibility</th>
              <th className="border-b px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {localBanners.map(banner => (
              <tr key={banner.id}>
                <td className="border-b px-4 py-2">{banner.id}</td>
                <td className="border-b px-4 py-2">
                  {banner.image_url && (
                    <img
                      src={banner.image_url}
                      alt={banner.description}
                      className="w-20 h-12 object-contain border rounded"
                    />
                  )}
                </td>
                <td className="border-b px-4 py-2">{banner.description}</td>
                <td className="border-b px-4 py-2 text-xs">
                  <CountdownTimer expirationTime={banner.expiration_time} />
                </td>
                <td className="border-b px-4 py-2">{banner.link}</td>
                <td className="border-b px-4 py-2">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={banner.isVisible === 1}
                      onChange={() => handleVisibilityToggle(banner.id, banner.isVisible === 1)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td className="border-b px-4 py-2">
                  <button
                    onClick={() => setSelectedBannerId(banner.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
