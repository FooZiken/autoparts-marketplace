export default function ProfileTabs({ current, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => onChange('orders')}>
        Orders
      </button>

      <button onClick={() => onChange('balance')}>
        Balance
      </button>

      <button onClick={() => onChange('favorites')}>
        Favorites
      </button>
    </div>
  );
}