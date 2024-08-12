import React from 'react';
import Banner from './Banner';

const BannerList = ({ banners, onEdit }) => {
  return (
    <div className="flex flex-wrap">
        {console.log(banners)}
      {banners.map((banner) => 
        banner.isVisible == 1 ? (
          <Banner
            key={banner.id}
            isVisible={banner.isVisible}
            expirationTime={banner.expiration_time}
            description={banner.description}
            timer={banner.timer}
            link={banner.link}
            imageUrl={banner.image_url}
            onEdit={() => onEdit(banner.id)}
          />
        ) : null
      )}
    </div>
  );
};

export default BannerList;
