export default async function deleteHabit(habitId) {
    const response = await fetch(`http://localhost:8080/api/habits/${habitId}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Erro ao deletar hábito');
    }

    return response.json();
}