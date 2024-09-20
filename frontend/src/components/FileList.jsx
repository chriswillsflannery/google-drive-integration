export const FileList = ({ files, onFileUpload, onFileDelete }) => (
    <div>
        <input
            type="file"
            onChange={onFileUpload}
            style={{ marginBottom: '20px' }}
        />
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {files.map(file => (
                <li key={file.id} style={{ 
                    marginBottom: '10px', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{file.name}</div>
                        <div style={{ fontSize: '0.9em', color: '#666' }}>
                            Type: {file.mimeType.split('.').pop()}
                        </div>
                        <div style={{ fontSize: '0.9em', color: '#666' }}>
                            Modified: {new Date(file.modifiedTime).toLocaleString()}
                        </div>
                    </div>
                    <button 
                        onClick={() => onFileDelete(file.id)}
                        style={{
                            backgroundColor: '#ff4d4d',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    </div>
)