
import React, { useState } from 'react';

function App() {
  const [vcpu, setVcpu] = useState(4);
  const [ram, setRam] = useState(16);
  const [storage, setStorage] = useState(200);

  const total = (vcpu * 24.98) + (ram * 20.02) + (storage * 0.55);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      padding: '40px'
    }}>
      <h1 style={{
        fontSize: '48px',
        color: '#D4AF37',
        marginBottom: '40px'
      }}>
        OptiData Cloud Calculator
      </h1>

      <div style={{
        maxWidth: '800px',
        backgroundColor: '#1a1a1a',
        padding: '40px',
        borderRadius: '16px',
        border: '1px solid #D4AF37'
      }}>
        
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: '#D4AF37' }}>
            vCPU: {vcpu} cores
          </label>
          <input
            type="range"
            min="1"
            max="128"
            value={vcpu}
            onChange={(e) => setVcpu(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: '#D4AF37' }}>
            RAM: {ram} GB
          </label>
          <input
            type="range"
            min="1"
            max="512"
            value={ram}
            onChange={(e) => setRam(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: '#D4AF37' }}>
            Storage: {storage} GB
          </label>
          <input
            type="range"
            min="10"
            max="5000"
            step="10"
            value={storage}
            onChange={(e) => setStorage(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#D4AF37',
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#000',
          borderRadius: '8px'
        }}>
          Total: R$ {total.toFixed(2)}/mês
        </div>
      </div>
    </div>
  );
}

export default App;
