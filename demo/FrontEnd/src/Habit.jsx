import { BsFire, BsXCircle, BsCheckCircle } from "react-icons/bs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import '../public/Habits.css';
import patchHabit from "./api/patchHabit.js";
import deleteHabit from "./api/deleteHabit.js";

const Habit = props => {
    const queryClient = useQueryClient();

    const checkMutation = useMutation({
        mutationKey: ['check-habit'],
        mutationFn: () => patchHabit(props.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        }
    });

    const deleteMutation = useMutation({
        mutationKey: ['delete-habit'],
        mutationFn: () => deleteHabit(props.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        }
    });

    return (
        <div className="habit-card">
            <h3 className="habit-name">{props.name}</h3>
            <p className="habit-streak">{props.streak} <BsFire /></p>
            <button 
                className="habit-btn btn-check" 
                onClick={() => checkMutation.mutate()}
                disabled={checkMutation.isPending}
            >
                <BsCheckCircle />
            </button>
            <button 
                className="habit-btn btn-delete" 
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
            >
                <BsXCircle />
            </button>
        </div>
    )
}

export default Habit;