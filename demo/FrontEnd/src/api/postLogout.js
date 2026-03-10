export default async function postLogout() {
    const response = await fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Erro ao encerrar sessão');
    }

    return null;
}