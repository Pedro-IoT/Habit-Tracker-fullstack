import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import '../../public/Habits.css'
import Habit from '../Habit.jsx';
import { useState } from 'react';
import { BsPlusCircle } from "react-icons/bs";
import postHabit from '../api/postHabit.js';
import getAISuggestion from '../api/getAISuggestion.js';
import LoadingGif from '../../public/img/loading.gif';

export const Route = createFileRoute('/habits')({
  beforeLoad: async () => {
    const response = await fetch('/api/auth/me', { credentials: 'include' });
    if (response.status === 403) throw redirect({ to: '/login' });
  },
  component: HabitsRoute,
})

function HabitsRoute() {
  const queryClient = useQueryClient();
  const [newHabitName, setNewHabitName] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState(''); 
  const [userInput, setUserInput] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const handleGetSuggestion = async () => {
    setLoadingAi(true);
    try {
        const suggestion = await getAISuggestion(userInput);
        setAiSuggestion(suggestion); // Salva o texto na variável
    } catch (error) {
        console.error(error);
        setAiSuggestion("Erro ao carregar sugestão. Tente novamente.");
    } finally {
        setLoadingAi(false);
    }
  };

  const { data: allHabits = [], isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const response = await fetch('/api/habits', { credentials: 'include' });
      return response.json();
    }
  });

  const habits = allHabits.filter(h => !h.checkedToday);
  const doneToday = allHabits.filter(h => h.checkedToday);

  const createMutation = useMutation({
    mutationFn: postHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      setNewHabitName('');
    }
  });

  if (isLoading) {
    return (
      <div className='loading-overlay'>
        <img src={LoadingGif} alt="Loading..." />
        <h2 className='loading-text'>Deixando tudo preparado...</h2>
      </div>
    )
  }

  return (
    <div className='habits-container'>
      <div className='habits-content'>
        <div className='create-habit'>
          <div className='habits-header'><h2>Criar Novo Hábito</h2></div>
          <form className='habit-form' onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(newHabitName);
          }}>
            <input 
              type="text" 
              id="new-habit"
              className='habit-input' 
              placeholder='Novo hábito' 
              value={newHabitName} 
              onChange={(e) => setNewHabitName(e.target.value)} 
            />
            <button type="submit" className='submit-btn-habit' disabled={createMutation.isPending}>
              <BsPlusCircle className='add-btn' />
            </button>
          </form>
        </div>
        
        <div className='habits-header'><h2>Meus Hábitos</h2></div>
        <div className='habit-list'>
          {habits.length === 0 && doneToday.length === 0 ? (
            <p className='no-habit'>Você não tem hábitos criados. Adicione um novo hábito acima!</p>
          ) : habits.length === 0 ?(
            <p className='no-habit'>Todos os hábitos foram concluídos hoje. Bom trabalho!</p>
          ): (
            habits.map((habit) => (
              <Habit key={habit.id} name={habit.name} streak={habit.sequenceOfDays} id={habit.id} />
            ))
          )}
        </div>

        <div className='habits-today'>
          <div className='habits-header'><h2>Hábitos Feitos Hoje</h2></div>
          <div className='habit-list done-today'>
            {doneToday.length === 0 ? (
              <p className='no-habit-done'>Você ainda não completou nenhum hábito hoje. Vamos lá!</p>
            ) : (
              doneToday.map((habit) => (
                <Habit key={habit.id} name={habit.name} streak={habit.sequenceOfDays} id={habit.id} />
              ))
            )}
          </div>
        </div>
      </div>
      <div className='ai-suggestion'>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleGetSuggestion();
        }}>
          <input 
            type="text" 
            id="user-input"
            className='user-input' 
            placeholder='Digite sua sugestão' 
            value={userInput} 
            onChange={(e) => setUserInput(e.target.value)} 
          />
        </form>
        
        {/* Mostra a sugestão se ela existir */}
        {aiSuggestion && (
            <div className="ai-result-box" style={{ padding: '10px', background: '#030257', marginBottom: '10px', borderRadius: '8px' }}>
                <p>{aiSuggestion}</p>
            </div>
        )}

        <div className='suggestion-box'>
          {/* CORREÇÃO: Passamos a referência da função, sem () */}
          <button 
            onClick={handleGetSuggestion} 
            disabled={loadingAi}
            style={{ cursor: loadingAi ? 'wait' : 'pointer' }}
          >
            {loadingAi ? 'Pensando...' : 'GET AI SUGGESTION NOW!'}
          </button>
        </div>
      </div>
    </div>
  )
}