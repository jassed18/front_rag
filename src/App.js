import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [useRAG, setUseRAG] = useState(false);
  const [response, setResponse] = useState('');

  // Define la URL base para las solicitudes API
  const API_BASE_URL = 'http://localhost:5001'; // Cambia esto si tu servidor está en una URL diferente

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
      await axios.post(`${API_BASE_URL}/upload_pdf`, formData);
      alert('PDF cargado con éxito');
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
        prompt: prompt.trim(),
        use_rag: useRAG
      });
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error al obtener la respuesta:', error);
      setResponse('Error al obtener la respuesta');
    }
  };

  return (
    <div className="App">
      <h1>OPTI ChatBot</h1>
      
      <div>
        <label htmlFor="pdfFile">Cargar PDF:</label>
        <input type="file" id="pdfFile" accept=".pdf" onChange={handleFileChange} />
        <button onClick={handleUploadPDF}>Subir PDF</button>
      </div>

      <div>
        <label htmlFor="useRAG">Usar RAG:</label>
        <input type="checkbox" id="useRAG" checked={useRAG} onChange={() => setUseRAG(!useRAG)} />
      </div>

      <div>
        <input type="text" id="promptInput" placeholder="Escribe tu pregunta aquí" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button onClick={handleSendPrompt}>Enviar</button>
      </div>

      <div>
        <h3>Respuesta:</h3>
        <div id="responseArea">{response}</div>
      </div>
    </div>
  );
}

export default App;