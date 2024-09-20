import './App.css'
import { useEffect, useState } from 'react';
import { FileList } from './components/FileList';

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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/upload_file', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (res.ok) {
        const newFile = await res.json();
        setFiles(prevFiles => [...prevFiles, newFile]);
      } else {
        console.error('File upload failed');
      }
    } catch (err) {
      console.error('Error uploading file: ', err);
    }
  }

  const handleFileDelete = async (fileid) => {
    try {
      const res = await fetch(`http://localhost:5000/delete_file/${fileid}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        setFiles(prevFiles => prevFiles.filter(file => file.id !== fileid));
      } else {
        console.error('Err: file deletion failed');
      }
    } catch (err) {
      console.error('Err deleting files; ', err);
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
          <FileList
            files={files}
            onFileUpload={handleFileUpload}
            onFileDelete={handleFileDelete}
          />
        </div>
      )}
    </div>
  )
}

export default App
