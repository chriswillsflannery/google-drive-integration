import './App.css'
import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    checkAuth();
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('http://localhost:5000/list_files', {
        credentials: 'include' // send cookiez
      });
      if (res.ok) {
        setIsAuthenticated(true);
        const data = await res.json();
        setFiles(data)
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Error checking auth: ', err)
      setIsAuthenticated(false);
    }
  }

  const handleAuth = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth');
      const data = await res.json();
      window.location.href = data.auth_url;
    } catch (err) {
      console.error('Error in authentication: ', err);
    }
  }

  return (
    <div>
      <h1>Google Drive</h1>
      {!isAuthenticated ? (
        <button onClick={handleAuth}>Authenticate with Google</button>
      ) : (
        <div>
          <h2>Your Files:</h2>
          <ul>
            {files.map(file => (
              <li key={file.id}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
