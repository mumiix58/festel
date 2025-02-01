import { useEffect, useRef } from 'react';

interface GoogleMapProps {
  className?: string;
}

export function GoogleMap({ className = '' }: GoogleMapProps) {
  const address = encodeURIComponent('Handelskai 265, 1020 Wien');
  // Use OpenStreetMap embed instead of Google Maps
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=16.405,48.223,16.410,48.226&layer=mapnik&marker=48.2244928,16.4075976`;

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <iframe
        title="Location Map"
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '300px' }}
        src={mapUrl}
        allowFullScreen
      />
      <div className="absolute bottom-2 right-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-lg hover:bg-gray-50"
        >
          Auf Google Maps öffnen
        </a>
      </div>
    </div>
  );
}