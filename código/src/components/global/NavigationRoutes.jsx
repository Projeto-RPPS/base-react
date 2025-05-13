import { Link, useLocation } from "react-router-dom";
import React from "react";

export default function NavigationRoutes() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Determina qual item está ativo
  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <nav className="br-breadcrumb">
      <ol className="crumb-list" role="list">
        <li className="crumb home">
          <Link className="br-button circle" to="/">
            <span className="sr-only">Página inicial</span>
            <i className="fas fa-home"></i>
          </Link>
        </li>

        {/* Rotas de Empréstimos */}
        <li className={`crumb ${isActive('/emprestimos') ? 'active' : ''}`}>
          <i className="icon fas fa-chevron-right"></i>
          <Link to="/emprestimos">Meus Empréstimos</Link>
        </li>

        {pathSegments[0] === 'emprestimos' && (
          <>
            <li className={`crumb ${isActive('/emprestimos/criar') ? 'active' : ''}`}>
              <i className="icon fas fa-chevron-right"></i>
              <Link to="/emprestimos/criar">Criar Empréstimo</Link>
            </li>

            <li className={`crumb ${isActive('/emprestimos/simular') ? 'active' : ''}`}>
              <i className="icon fas fa-chevron-right"></i>
              <Link to="/emprestimos/simular">Simular Empréstimo</Link>
            </li>
          </>
        )}

        {/* Rota de Margem */}
        <li className={`crumb ${isActive('/margem') ? 'active' : ''}`}>
          <i className="icon fas fa-chevron-right"></i>
          <Link to="/margem">Simular Margem</Link>
        </li>

        {/* Rotas de Contribuintes */}
        <li className={`crumb ${isActive('/contribuintes') ? 'active' : ''}`}>
          <i className="icon fas fa-chevron-right"></i>
          <Link to="/contribuintes">Contribuintes</Link>
        </li>

        {pathSegments[0] === 'contribuintes' && (
          <>
            <li className={`crumb ${isActive('/contribuintes/cadastrar') ? 'active' : ''}`}>
              <i className="icon fas fa-chevron-right"></i>
              <Link to="/contribuintes/cadastrar">Cadastrar Contribuinte</Link>
            </li>

            <li className={`crumb ${isActive('/contribuintes/categorias') ? 'active' : ''}`}>
              <i className="icon fas fa-chevron-right"></i>
              <Link to="/contribuintes/categorias">Categorias</Link>
            </li>

            <li className={`crumb ${isActive('/contribuintes/categorias/editar') ? 'active' : ''}`}>
              <i className="icon fas fa-chevron-right"></i>
              <Link to="/contribuintes/categorias/editar">Editar Categorias</Link>
            </li>
            
          </>
        )}

        {/* Rotas de Contribuições */}
        <li className={`crumb ${isActive('/contribuicoes') ? 'active' : ''}`}>
          <i className="icon fas fa-chevron-right"></i>
          <Link to="/contribuicoes">Fazer Contribuição</Link>
        </li>

        <li className={`crumb ${isActive('/contribuicoes/historico') ? 'active' : ''}`}>
          <i className="icon fas fa-chevron-right"></i>
          <Link to="/contribuicoes/historico">Histórico</Link>
        </li>

        {/* Item ativo dinâmico (para rotas como /fatura/:id) */}
        {pathSegments.length > 0 && !['emprestimos', 'contribuintes', 'contribuicoes', 'margem'].includes(pathSegments[0]) && (
          <li className="crumb" data-active="active">
            <i className="icon fas fa-chevron-right"></i>
            <span tabIndex="0" aria-current="page">
              {pathSegments[0] === 'fatura' ? 'Fatura' : pathSegments[0]}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}