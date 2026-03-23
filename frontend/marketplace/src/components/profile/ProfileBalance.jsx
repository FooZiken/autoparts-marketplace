export default function ProfileBalance() {
  // пока нет backend → просто UI
  const balance = 0;

  return (
    <div>
      <h2>Balance</h2>
      <p>{balance} €</p>

      <button disabled>Top up (coming soon)</button>
    </div>
  );
}