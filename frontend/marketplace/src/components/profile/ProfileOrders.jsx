import { useEffect, useState } from 'react';
import { getOrders } from '../../api/orders';

export default function ProfileOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  }

  if (!orders.length) return <p>No orders yet</p>;

  return (
    <div>
      {orders.map((order) => {
        const status =
          order.printJobs?.[0]?.status || order.status;

        return (
          <div key={order.id} style={styles.card}>
            <h3>Order #{order.id}</h3>
            <p>Status: {status}</p>
          </div>
        );
      })}
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