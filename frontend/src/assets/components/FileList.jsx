import { useState, useEffect } from 'react';

export const FileList = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        const res = await fetch('http://localhost:5000/list_files');
        const data = await res.json();
        setFiles(data);
    }

    return (
        <ul>
            {files.map(file => (
                <li key={file.id}>
                    {file.name} - {file.mimeType} - {file.modifiedTime}
                </li>
            ))}
        </ul>
    )
}