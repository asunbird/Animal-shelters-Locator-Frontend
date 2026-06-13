import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import homeIcon from '/src/assets/icons/Home-icon.svg';

function getTypeLabel(tags = {}) {
  if (tags.amenity === 'animal_shelter') return 'Animal shelter';
  if (tags.amenity === 'veterinary') return 'Veterinary clinic';
  if (tags.tourism === 'animal_boarding') return 'Animal boarding';
  if (tags.tourism === 'animal_breeding') return 'Animal breeding';
  if (tags.office === 'association') return 'Association office';
  return tags.amenity || tags.tourism || tags.office || '';
}

function FavoritesList() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('paws_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('paws_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
        <section id="favorites-list-container">
            <h2 className="jost-700">Favorites List</h2>

            {favorites.length === 0 ? (
                <div className="fav-list-card">No favorites saved yet.</div>
            ) : (
                favorites.map((shelter) => {
                    const tags = shelter.tags || {};
                    const name = tags.name || 'Unknown Shelter';
                    const address = [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']]
                        .filter(Boolean)
                        .join(' ') || 'No address provided';
                    const typeLabel = getTypeLabel(tags);

                    return (
                        <div key={shelter.id} className="fav-list-card">
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                <div>
                                    <h3>{name}</h3>
                                    {typeLabel && <p style={{ margin: '4px 0 0', color: '#555' }}>{typeLabel}</p>}
                                </div>
                                <button className="heart-btn is-fav" onClick={() => removeFavorite(shelter.id)}>
                                    ✕
                                </button>
                            </div>
                            <p style={{ margin: '8px 0', color: '#666' }}>{address}</p>
                            {tags.opening_hours && (
                                <p style={{ margin: '4px 0', fontSize: '0.95rem' }}>
                                    <strong>Hours:</strong> {tags.opening_hours}
                                </p>
                            )}
                            <div style={{ marginTop: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {tags.website && (
                                    <a href={tags.website.startsWith('http') ? tags.website : `https://${tags.website}`} target="_blank" rel="noopener noreferrer">
                                        Website
                                    </a>
                                )}
                                {tags.phone && (
                                    <a href={`tel:${tags.phone}`}>
                                        Call
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })
            )}

            <div style={{ marginTop: '24px' }}>
                <Link className="home-btn" to="/">
                    <img className="icon" src={homeIcon} alt="Home" />
                    <p className="nav-sections">Home</p>
                </Link>
            </div>
        </section>
    )
}

export default FavoritesList;