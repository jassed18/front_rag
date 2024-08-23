import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [sources, setSources] = useState([]);

  const API_BASE_URL = 'http://localhost:5001';

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadPDF = async () => {
    if (!file) {
      alert('Por favor, selecciona un archivo PDF');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload_pdf`, formData);
      alert(response.data.message);
    } catch (error) {
      console.error('Error al cargar el PDF:', error);
      alert('Error al cargar el PDF');
    }
  };

  const handleSendPrompt = async () => {
    if (!prompt.trim()) {
      alert('Por favor, escribe una pregunta');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        prompt: prompt.trim()
      });
      if (res.data.response.result) {
        setResponse(res.data.response.result);
        setSources(res.data.response.source_documents || []);
      } else {
        setResponse(res.data.response);
        setSources([]);
      }
    } catch (error) {
      console.error('Error al obtener la respuesta:', error);
      setResponse('Error al obtener la respuesta');
      setSources([]);
    }
  };

  // Estilos
  const styles = {
    app: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    },
    header: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '30px'
    },
    section: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '5px',
      marginBottom: '20px'
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd'
    },
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    responseArea: {
      backgroundColor: '#e9ecef',
      padding: '15px',
      borderRadius: '5px',
      marginTop: '20px'
    },
    sourcesList: {
      listStyleType: 'none',
      padding: '0'
    },
    sourceItem: {
      backgroundColor: '#e2e3e5',
      padding: '10px',
      marginBottom: '5px',
      borderRadius: '3px'
    }
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.header}>OPTI ChatBot</h1>
      
      <div style={styles.section}>
        <h2>Cargar PDF</h2>
        <input 
          type="file" 
          id="pdfFile" 
          accept=".pdf" 
          onChange={handleFileChange} 
          style={styles.input}
        />
        <button onClick={handleUploadPDF} style={styles.button}>Subir PDF</button>
      </div>

      <div style={styles.section}>
        <h2>Hacer una pregunta</h2>
        <input 
          type="text" 
          id="promptInput" 
          placeholder="Escribe tu pregunta aquí" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          style={styles.input}
        />
        <button onClick={handleSendPrompt} style={styles.button}>Enviar</button>
      </div>

      <div style={styles.section}>
        <h2>Respuesta:</h2>
        <div style={styles.responseArea}>{response}</div>
      </div>

      {sources.length > 0 && (
        <div style={styles.section}>
          <h2>Fuentes:</h2>
          <ul style={styles.sourcesList}>
            {sources.map((source, index) => (
              <li key={index} style={styles.sourceItem}>{source}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;