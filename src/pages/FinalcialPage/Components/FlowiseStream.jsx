import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const FWStream = () => {
  const [socketIOClientId, setSocketIOClientId] = useState('');
  const [response, setResponse] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [sourceDocuments, setSourceDocuments] = useState([]);
  const [usedTools, setUsedTools] = useState([]);

  useEffect(() => {
    const socket = socketIOClient("https://flowise-ngy8.onrender.com");

    socket.on('connect', () => {
      setSocketIOClientId(socket.id);
    });

    socket.on('start', () => {
      console.log('start');
    });

    socket.on('token', (token) => {
      console.log('token:', token);
      setTokens((prevTokens) => [...prevTokens, token]);
    });

    socket.on('sourceDocuments', (sourceDocuments) => {
      console.log('sourceDocuments:', sourceDocuments);
      setSourceDocuments(sourceDocuments);
    });

    socket.on('usedTools', (usedTools) => {
      console.log('usedTools:', usedTools);
      setUsedTools(usedTools);
    });

    socket.on('end', () => {
      console.log('end');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const query = async (data) => {
    const response = await fetch(
      "https://flowise-ngy8.onrender.com/api/v1/prediction/eefcc2cf-c772-4b5d-be24-af5d2216d09e",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    const result = await response.json();
    setResponse(result);
    return result;
  };

  const handleQuery = () => {
    query({
      question: "Rong biển việt nam 2024",
      socketIOClientId
    }).then((response) => {
      console.log("Response:", response);
    });
  };

  return (
    <div>
      <h1>Chat Component</h1>
      <button onClick={handleQuery}>Send Query</button>
      <div>
        <h2>Response</h2>
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </div>
      <div>
        <h2>Tokens</h2>
        <pre>{JSON.stringify(tokens, null, 2)}</pre>
      </div>
      <div>
        <h2>Source Documents</h2>
        <pre>{JSON.stringify(sourceDocuments, null, 2)}</pre>
      </div>
      <div>
        <h2>Used Tools</h2>
        <pre>{JSON.stringify(usedTools, null, 2)}</pre>
      </div>
    </div>
  );
};

export default FWStream;
