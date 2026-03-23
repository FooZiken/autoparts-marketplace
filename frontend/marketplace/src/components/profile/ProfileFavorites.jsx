import { useEffect, useState } from 'react';

export default function ProfileFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    );
    setFavorites(data);
  }, []);

  function remove(id) {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  }

  if (!favorites.length) return <p>No favorites</p>;

  return (
    <div>
      {favorites.map((item) => (
        <div key={item.id} style={styles.card}>
          <p>{item.name}</p>
          <button onClick={() => remove(item.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #ddd',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
};