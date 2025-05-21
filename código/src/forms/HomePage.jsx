import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import authService from '../service/login/authService';

const HomeContent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    authService
      .me()
      .then(u => setUser(u))
      .catch(() => setUser(null));
  }, []);

  const handleProtectedNavigation = (e, path) => {
    // se não tiver user ou for admin, bloqueia
    if (!user || user.role !== "user") {
      e.preventDefault();
      // redireciona para login ou para alguma página de erro
      return navigate('/home');
    }
    navigate(path);
  };

  return (
    <main className="container-lg mt-5">
      {/* Seção de boas-vindas */}
      <section className="br-card mb-5">
        <div className="card-header">
          <h2 className="text-center">Bem-vindo ao Sistema RPPS</h2>
        </div>
        <div className="card-content">
          <p className="text-center">
            O Sistema de Regime Próprio de Previdência Social oferece ferramentas para gestão completa
            dos processos previdenciários dos servidores públicos.
          </p>
          
        </div>
      </section>

      {/* Cards de funcionalidades */}
      <div className="row justify-content-center">
        {/* Card de Contribuições */}
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="br-card hover h-100">
            <div className="card-content">
              <div className="d-flex flex-column align-items-center text-center">
                <span className="br-icon mb-3" aria-hidden="true">
                  <i className="fas fa-money-bill-wave" style={{fontSize: '2rem', color: '#1351B4'}}></i>
                </span>
                <h3 className="mb-2">Contribuições</h3>
                <p className="mb-4">Realize e consulte contribuições previdenciárias</p>
                <button
                  type="button"
                  className="br-button primary block"
                  onClick={e => handleProtectedNavigation(e, "/contribuicoes")}
                >
                  Acessar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Empréstimos */}
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="br-card hover h-100">
            <div className="card-content">
              <div className="d-flex flex-column align-items-center text-center">
                <span className="br-icon mb-3" aria-hidden="true">
                  <i className="fas fa-hand-holding-usd" style={{fontSize: '2rem', color: '#1351B4'}}></i>
                </span>
                <h3 className="mb-2">Empréstimos</h3>
                <p className="mb-4">Solicite e acompanhe empréstimos previdenciários</p>
                <button
                  type="button"
                  className="br-button primary block"
                  onClick={e => handleProtectedNavigation(e, "/emprestimos/criar")}
                >
                  Acessar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Benefícios */}
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="br-card hover h-100">
            <div className="card-content">
              <div className="d-flex flex-column align-items-center text-center">
                <span className="br-icon mb-3" aria-hidden="true">
                  <i className="fas fa-hand-holding-medical" style={{fontSize: '2rem', color: '#1351B4'}}></i>
                </span>
                <h3 className="mb-2">Benefícios</h3>
                <p className="mb-4">Solicite e consulte benefícios previdenciários</p>
                <button
                  type="button"
                  className="br-button primary block"
                  onClick={e => handleProtectedNavigation(e, "/solicitacao-beneficios")}
                >
                  Acessar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomeContent;