import { Link } from "react-router-dom";

export default function NavigationRoutes() {
  return (
    <nav className="br-breadcrumb">
      <ol className="crumb-list" role="list">
        <li className="crumb home">
          <Link className="br-button circle" to="/">
            <span className="sr-only">Página inicial</span>
            <i className="fas fa-home"></i>
          </Link>
        </li>

        <li className="crumb">
          <i className="icon fas fa-chevron-right"></i>
          <Link to="/emprestimos">Meus Empréstimos</Link>
        </li>

        <li className="crumb">
          <i className="icon fas fa-chevron-right"></i>
          <Link to="/emprestimos/criar">Criar Empréstimo</Link>
        </li>

        <li className="crumb">
          <i className="icon fas fa-chevron-right"></i>
          <Link to="/emprestimos/simular">Simular Empréstimo</Link>
        </li>

        <li className="crumb">
          <i className="icon fas fa-chevron-right"></i>
          <Link to="/margem">Simular Margem</Link>
        </li>

        <li className="crumb" data-active="active">
          <i className="icon fas fa-chevron-right"></i>
          {/* Aqui você pode trocar "Fatura" pelo texto dinâmico que quiser */}
          <span tabIndex="0" aria-current="page">Fatura</span>
        </li>
      </ol>
    </nav>
  );
}
