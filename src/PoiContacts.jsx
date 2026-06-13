
import L from 'leaflet';
import pawIcon from './assets/point.svg';
import 'leaflet/dist/leaflet.css';

let DefaultIcon = L.icon({
    iconUrl: pawIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});
L.Marker.prototype.options.icon = DefaultIcon;



function ShelterCard({ shelter, isFavorite, onToggleFavorite, onAction }) {
  const tags = shelter.tags || {};
  const name = tags.name || 'Unknown Shelter';
  const address = [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']].filter(Boolean).join(' ') || 'No address provided';
  const website = tags['contact:website'] || tags.website;
  const phone = tags['contact:phone'] || tags.phone;
  const email = tags['contact:email'] || tags.email;
  const lat = shelter.lat || (shelter.center && shelter.center.lat);
  const lon = shelter.lon || (shelter.center && shelter.center.lon);
  const typeLabel = (() => {
    if (tags.amenity === 'animal_shelter') return 'Animal shelter';
    if (tags.amenity === 'veterinary') return 'Veterinary clinic';
    if (tags.tourism === 'animal_boarding') return 'Animal boarding';
    if (tags.tourism === 'animal_breeding') return 'Animal breeding';
    if (tags.office === 'association') return 'Association office';
    return tags.amenity || tags.tourism || tags.office || '';
  })();

  return (
    <div className="shelter-card">
      <div className="card-header">
        <div>
          <h3>{name}</h3>
          {typeLabel && <p className="card-type" style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#555' }}>{typeLabel}</p>}
        </div>
        <button 
          className={`heart-btn ${isFavorite ? 'is-fav' : ''}`} 
          onClick={() => onToggleFavorite(shelter)}
        >
          ❤️
        </button>
      </div>
      <p className="card-address">
        {address}
      </p>
      
      <div className="card-contacts">
        { website && (
          <div className="contact-item">
            <strong>Website:</strong>{' '}
            <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">
              {website}
            </a>
          </div>
        )}
        { phone && (
          <div className="contact-item">
            <strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a>
          </div>
        )}
        { email && (
          <div className="contact-item">
            <strong>Email:</strong>{' '}
            <form action={`mailto:${email}`} method="POST" encType="text/plain" style={{ display: 'inline' }}>
              <button type="submit" className="email-link-btn">
                {email}
              </button>
            </form>
          </div>
        )}
        {tags.opening_hours && (
          <div className="contact-item">
            <strong>Hours:</strong> {tags.opening_hours}
          </div>
        )}
        <div className="contact-item location-data" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed #eee', fontSize: '0.8rem', color: '#888' }}>
          <strong>Location:</strong> {lat?.toFixed(5)}, {lon?.toFixed(5)}
          <div style={{ marginTop: '4px', display: 'flex', gap: '10px' }}>
            <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary-accent)', textDecoration: 'none', fontWeight: 'bold' }}>
              📍 Google Maps
            </a>
            <a href={`https://maps.apple.com/?q=${lat},${lon}`} target="_blank" rel="noopener noreferrer" style={{ color: '#007AFF', textDecoration: 'none', fontWeight: 'bold' }}>
              🍎 Apple Maps
            </a>
          </div>
        </div>
      </div>



      <div className="card-actions">

        <button className="view-on-map-btn" onClick={() => onAction(shelter)}>
          View on Map
        </button>
      </div>
    </div>
  );
}


export default ShelterCard;

