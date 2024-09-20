export const FileList = ({ files, onFileUpload, onFileDelete }) => {
    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await fetch(`http://localhost:5000/download_file/${fileId}`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                // create temporary invisible link and trigger it
                const blob = await response.blob(); // convert server response to raw data
                const url = window.URL.createObjectURL(blob); // url points to blob data in memory
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url); // memory release
            } else {
                console.error('Error downloading file');
            }
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
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
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <div style={{ fontWeight: 'bold' }}>{file.name}</div>
                            <div style={{ fontSize: '0.9em', color: '#666' }}>
                                Type: {file.mimeType.split('.').pop()}
                            </div>
                            <div style={{ fontSize: '0.9em', color: '#666' }}>
                                Modified: {new Date(file.modifiedTime).toLocaleString()}
                            </div>
                        </div>
                        <div>
                            <button 
                                onClick={() => handleDownload(file.id, file.name)}
                                style={{
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                            >
                                ⬇
                            </button>
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
                                X
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};