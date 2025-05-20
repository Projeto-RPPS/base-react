import React from 'react';
import { useNavigate } from 'react-router-dom';
import SecondaryButton from '../components/global/SecundaryButton';

const HomeContent = () => {
  const navigate = useNavigate();

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
          <div className="text-center mt-3">
            <SecondaryButton 
              label="Saiba mais sobre o sistema"
              onClick={() => navigate('/sobre')}
            />
          </div>
        </div>
      </section>

      {/* Cards de funcionalidades */}
      <div className="row">
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
                  onClick={() => navigate('/contribuicoes')}
                >
                  Acessar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Cadastros */}
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="br-card hover h-100">
            <div className="card-content">
              <div className="d-flex flex-column align-items-center text-center">
                <span className="br-icon mb-3" aria-hidden="true">
                  <i className="fas fa-user-plus" style={{fontSize: '2rem', color: '#1351B4'}}></i>
                </span>
                <h3 className="mb-2">Cadastros</h3>
                <p className="mb-4">Cadastre e gerencie contribuintes do sistema</p>
                <button
                  type="button"
                  className="br-button primary block"
                  onClick={() => navigate('/contribuintes/cadastrar')}
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
                  onClick={() => navigate('/emprestimos')}
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
                  onClick={() => navigate('/beneficios/cadastrar')}
                >
                  Acessar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Notícias */}
      <section className="br-card mt-5">
        <div className="card-header">
          <h3>Últimas Notícias</h3>
        </div>
        <div className="card-content">
          <div className="br-list">
            <div className="br-item">
              <div className="row align-items-center">
                <div className="col">
                  <div className="text-bold">Novas regras para aposentadoria</div>
                  <div className="text-sm">Publicado em 15/05/2023</div>
                </div>
                <div className="col-auto">
                  <button 
                    type="button" 
                    className="br-button circle small" 
                    onClick={() => navigate('/noticia/1')}
                    aria-label="Ler notícia"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="br-item">
              <div className="row align-items-center">
                <div className="col">
                  <div className="text-bold">Atualização da tabela de contribuição</div>
                  <div className="text-sm">Publicado em 10/05/2023</div>
                </div>
                <div className="col-auto">
                  <button 
                    type="button" 
                    className="br-button circle small" 
                    onClick={() => navigate('/noticia/2')}
                    aria-label="Ler notícia"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeContent;