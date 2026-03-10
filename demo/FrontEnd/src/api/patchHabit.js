export default async function patchHabit(habitId) {
    const response = await fetch(`http://localhost:8080/api/habits/${habitId}`, {
        method: 'PATCH',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Erro ao atualizar hábito');
    }

    return response.json();
}