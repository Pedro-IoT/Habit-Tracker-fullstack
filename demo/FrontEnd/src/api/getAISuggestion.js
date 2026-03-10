export default async function getAISuggestion(userInput) {
    const response = await fetch('http://localhost:8080/api/suggestion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Erro ao obter sugestão da IA');
    }

    return response.text();
}