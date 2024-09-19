export const FileList = ({ files }) => (
    <ul style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        {files.map(file => (
            <li key={file.id}>{file.name}</li>
        ))}
    </ul>
)