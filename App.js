import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteContent, setNoteContent] = useState('');

  const register = async (username, password) => {
    await axios.post('/api/users/register', { username, password });
  };

  const login = async (username, password) => {
    const response = await axios.post('/api/users/login', { username, password });
    setToken(response.data.token);
  };

  const fetchNotes = async () => {
    const response = await axios.get('/api/notes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotes(response.data);
  };

  const createNote = async () => {
    await axios.post('/api/notes', { content: noteContent }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchNotes();
  };

  return (
    <div>
      <h1>Note Taking App</h1>
      {!token ? (
        <div>
          <h2>Login</h2>
          {/* Add login form */}
        </div>
      ) : (
        <div>
          <h2>Notes</h2>
          {/* Add notes display and form */}
        </div>
      )}
    </div>
  );
}

export default App;
