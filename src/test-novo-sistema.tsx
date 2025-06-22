
import React from 'react';

export function TesteNovoSistema() {
  return (
    <div style={{
      background: '#0a0a0a',
      color: 'white',
      padding: '2rem',
      minHeight: '100vh',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ color: '#f5a623' }}>
        Sistema Novo - Teste Isolado
      </h1>
      <p>Se você está vendo isso, significa que podemos começar a construir do zero.</p>
      
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#1a1a1a', borderRadius: '8px' }}>
        <h2 style={{ color: '#f5a623', fontSize: '1.2rem', marginBottom: '1rem' }}>
          Teste de Funcionalidades Básicas
        </h2>
        
        <button 
          onClick={() => alert('Botão funcionando!')}
          style={{
            background: '#f5a623',
            color: '#000',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Testar Botão
        </button>
        
        <button 
          onClick={() => console.log('Console log funcionando!')}
          style={{
            background: '#333',
            color: '#fff',
            border: '1px solid #555',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Testar Console
        </button>
      </div>
      
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#1a1a1a', borderRadius: '8px' }}>
        <h3 style={{ color: '#f5a623' }}>Status do Sistema</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ color: '#90EE90', marginBottom: '5px' }}>✓ React funcionando</li>
          <li style={{ color: '#90EE90', marginBottom: '5px' }}>✓ Roteamento funcionando</li>
          <li style={{ color: '#90EE90', marginBottom: '5px' }}>✓ Estilos básicos funcionando</li>
          <li style={{ color: '#FFA500', marginBottom: '5px' }}>⚠ Supabase não testado ainda</li>
        </ul>
      </div>
    </div>
  );
}
