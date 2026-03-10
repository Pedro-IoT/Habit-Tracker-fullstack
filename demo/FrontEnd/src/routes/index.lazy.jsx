import { createLazyFileRoute, Link } from '@tanstack/react-router'
import '../../public/index.css'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className='index-container'>
      <div className='index-card'>
        <h2 className='index-title'>Golden Ritual</h2>
        <p className='index-subtitle'>Refine sua rotina e acompanhe sua evolução diária com elegância.</p>
        <div className='index-actions'>
          <Link to="/login" className="submit-btn">Entrar</Link>
          <Link to="/register" className="secondary-link">Criar Conta</Link>
        </div>
      </div>
    </div>
  )
}