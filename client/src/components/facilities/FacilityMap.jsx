import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Default Maharashtra Center (Pune / Chhatrapati Sambhajinagar region)
const DEFAULT_CENTER = [19.076, 74.7774];

export const FacilityMap = ({ facilities = [], center = DEFAULT_CENTER, zoom = 7 }) => {
  return (
    <div style={{ height: '420px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {facilities.map((facility) => {
          if (!facility.location?.coordinates || facility.location.coordinates.length < 2) {
            return null;
          }
          const [lng, lat] = facility.location.coordinates;
          return (
            <Marker key={facility._id || facility.facilityCode} position={[lat, lng]}>
              <Popup>
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>{facility.name}</strong>
                  <div>{facility.tier}</div>
                  <div>{facility.address?.taluka}, {facility.address?.district}</div>
                  {facility.contact?.phone && <div>📞 {facility.contact.phone}</div>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default FacilityMap;
