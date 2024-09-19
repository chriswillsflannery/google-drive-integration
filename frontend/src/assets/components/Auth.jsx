export const Auth = () => {
    const handleAuth = async () => {
        const res = await fetch('http://localhost:5000/auth');
        const data = await res.json();
        window.location.href = data.auth_url;
    }

    return (
        <button onClick={handleAuth}>
            Authenticate with Google
        </button>
    );
}