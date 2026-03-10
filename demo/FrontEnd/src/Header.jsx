import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import '../public/Header.css';
import postLogout from "./api/postLogout.js";
import { toast } from "react-toastify";

export default function Header () {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const isHabitsRoute = location.pathname === '/habits';

    const mutation = useMutation({
        mutationKey: ['logout'],
        mutationFn: postLogout,
        onSuccess: () => {
            queryClient.clear();
            toast.success('Sessão encerrada com sucesso.');
            navigate({ to: '/login' });
        },
        onError: () => {
            toast.error('Erro ao encerrar sessão. Tente novamente.');
        }
    });

    return (
        <nav className="header-nav">
            <Link className="logo-link" to="/">
                <h1 className="logo">Habit Tracker</h1>
            </Link>
            {isHabitsRoute && (
                <button
                    className="logout-btn"
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? 'Saindo' : 'Sair'}
                </button>
            )}
        </nav>
    )
}