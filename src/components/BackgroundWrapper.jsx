import { useState, useEffect } from 'react';

export default function BackgroundWrapper({ locationName, children }) {
  const [bgImage, setBgImage] = useState(null);

  useEffect(() => {
    if (!locationName) return;

    async function fetchBackground() {
      try {
        const res = await fetch(`/api/pexels?city=${encodeURIComponent(locationName)}`);
        const data = await res.json();
        if (res.ok && data.photoUrl) {
          setBgImage(data.photoUrl);
        } else {
          setBgImage(null);
        }
      } catch {
        setBgImage(null);
      }
    }

    fetchBackground();
  }, [locationName]);

  return (
    <div
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        transition: 'background-image 0.5s ease-in-out',
      }}
    >
      {children}
    </div>
  );
}
