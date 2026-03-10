export default async function postHabit(habitName) {
    const response = await fetch('http://localhost:8080/api/habits', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: habitName }),
    });

    if (!response.ok) {
        throw new Error('Erro ao criar hábito');
    }
    
    return response.json();
}