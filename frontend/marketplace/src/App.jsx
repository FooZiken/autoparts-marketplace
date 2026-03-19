import { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [models, setModels] = useState([]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [materialId, setMaterialId] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/models')
      .then(res => res.json())
      .then(data => {
        setModels(data.data || []);
      });
  }, []);

  async function handleLogin() {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
    } else {
      alert('Login failed');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  async function createOrder(modelId) {
    const res = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        modelIds: [modelId],
        deliveryAddress: 'Test address',
      }),
    });

    const data = await res.json();
    console.log(data);
    alert('Order created!');
  }

  async function uploadModel() {
    if (!file) {
      alert('Select STL file');
      return;
    }

    try {
      const formData = new FormData();

      formData.append('file', file);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('materialId', materialId);

      const res = await fetch('http://localhost:3000/models', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      console.log('MODEL CREATED:', data);

      if (data.id) {
        alert('Model created!');
        window.location.reload();
      } else {
        alert('Error creating model');
      }

    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  }

  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Autoparts Marketplace</h1>

      <button onClick={logout}>Logout</button>

      <h2>Upload Model</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <br /><br />

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Material ID"
        value={materialId}
        onChange={(e) => setMaterialId(e.target.value)}
      />

      <br /><br />

      <button onClick={uploadModel}>Upload STL</button>

      <hr />

      <h2>Models</h2>

      {models.map((model) => (
        <div
          key={model.id}
          style={{
            border: '1px solid #ccc',
            marginBottom: 10,
            padding: 10,
          }}
        >
          <h3>{model.name}</h3>
          <p>{model.description}</p>

          {model.pricing && (
            <p>Price: {model.pricing.total}</p>
          )}

          <button onClick={() => createOrder(model.id)}>
            Buy
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;