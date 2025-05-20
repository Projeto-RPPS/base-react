import React, { useEffect, useState } from "react";
import { listarSolicitacoes, criarSolicitacao } from "../../../service/beneficio/solicitacaoService";
import FormularioSolicitacao from "../FormularioSolicitacao";
import SecondaryButton from "../../../components/global/SecundaryButton";
import ListaSolicitacoes from "../../../components/beneficioComponent/ListaSolicitacoes";


export default function SolicitacaoBeneficioPage() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const carregarSolicitacoes = async () => {
    try {
      const data = await listarSolicitacoes();
      setSolicitacoes(data);
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error);
    }
  };

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const handleSalvar = async (dados) => {
    try {
      await criarSolicitacao(dados);
      carregarSolicitacoes();
      handleRefreshPage();
    } catch (error) {
      console.error("Erro ao criar solicitação:", error);
    }
  };

  const handleCadastrarClick = () => {
    setShowForm(true);
    setShowButton(false);
  };

  const handleRefreshPage = () => {
    setShowForm(false);
    setShowButton(true);
    carregarSolicitacoes();
  };



  return (
    <div className="container mt-4">
      {/* <NavigationRoutes /> */}
      <div className="main-content pl-sm-3 mt-4">
        {showButton && (
          <>
            <h1>Solicitações de Benefícios</h1>
            <div className="col mb-3">
              {/* <SecondaryButton label={"Solicitar novo Benefício"} onClick={handleCadastrarClick} /> */}
                      <button 
          type="button" 
          className="br-button primary mr-3"
          onClick={handleCadastrarClick}
        >
          Solicitar novo Benefício
        </button>
          </div>
          </>
        )}

        {showForm && (
          <>
            <h1>Solicitar Benefício</h1>
            <FormularioSolicitacao onSalvar={handleSalvar} />
            <br />
            {/* <SecondaryButton label={"Voltar ao menu de Solicitações"} onClick={handleRefreshPage} /> */}
                    <button 
          type="button" 
          className="br-button primary mr-3"
          onClick={handleRefreshPage}
        >
          Voltar ao menu de Solicitações
        </button>
            
        <h2 className="mt-4">Solicitações Ativas</h2>
        <ListaSolicitacoes solicitacoes={solicitacoes} />
          </>
        )}

        {/* <h2 className="mt-4">Solicitações Ativas</h2>
        <ListaSolicitacoes solicitacoes={solicitacoes} /> */}
      </div>
    </div>
  );
}