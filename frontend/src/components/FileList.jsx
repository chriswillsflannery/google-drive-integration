export const FileList = ({ files, onFileUpload }) => (
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
                    borderRadius: '4px'
                }}>
                    <div style={{ fontWeight: 'bold' }}>{file.name}</div>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                        Type: {file.mimeType.split('.').pop()}
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                        Modified: {new Date(file.modifiedTime).toLocaleString()}
                    </div>
                </li>
            ))}
        </ul>
    </div>
)