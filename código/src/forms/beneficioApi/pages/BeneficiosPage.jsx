import React, { useEffect, useState } from "react";
import beneficioService from "../../../service/beneficio/beneficioService";
import FormularioBeneficio from "../FormularioBeneficio";
import ListaBeneficios from "../../../components/beneficioComponent/ListaBeneficios";
import SecondaryButton from "../../../components/global/SecundaryButton";

export default function BeneficiosPage() {
  const [beneficios, setBeneficios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [erro, setErro] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  // Função para carregar os benefícios
  const carregarBeneficios = async () => {
    try {
      const data = await beneficioService.listarBeneficios();
      setBeneficios(data);
    } catch (error) {
      console.error("Erro ao carregar benefícios:", error);
      setErro("Erro ao carregar benefícios.");
    }
  };

  useEffect(() => {
    carregarBeneficios();
  }, []);

  // Função para salvar um novo benefício
  const handleSalvar = async (dados) => {
    try {
      const response = await beneficioService.criarBeneficio(dados);
      console.log("Benefício criado:", response);
      setSuccessMessage("Benefício cadastrado com sucesso.");
      carregarBeneficios();
      handleRefreshPage();
    } catch (error) {
      //console.error("Erro ao criar benefício:", error);
      setErro(error.response?.data?.mensagem || "Erro ao criar benefício.");
    }
  };

  // Função para editar um benefício
  const handleEditar = async (beneficio) => {
    const novoTipo = prompt("Digite o novo tipo:");
    const novoBeneficio = { ...beneficio, tipo: novoTipo };
    try {
      const response = await beneficioService.atualizarBeneficio(beneficio.idBeneficio, novoBeneficio);
      console.log("Benefício atualizado:", response);
      carregarBeneficios();
    } catch (error) {
      console.error("Erro ao atualizar benefício:", error);
      setErro(error.response?.data?.mensagem || "Erro ao atualizar benefício.");
    }
  };

  // Função para desativar um benefício
  const handleDesativar = async (id) => {
    try {
      const response = await beneficioService.desativarBeneficio(id);
      console.log("Benefício desativado:", response);
      carregarBeneficios();
    } catch (error) {
      console.error("Erro ao desativar benefício:", error);
      setErro(error.response?.data?.mensagem || "Erro ao desativar benefício.");
    }
  };

  // Controle de exibição do formulário e lista
  const handleCadastrarClick = () => {
    setShowForm(true);
    setShowButton(false);
    setShowEdit(false);
  };

  const handleEditarClick = () => {
    setShowForm(false);
    setShowButton(false);
    setShowEdit(true);
  };

  const handleRefreshPage = () => {
    setShowForm(false);
    setShowEdit(false);
    setShowButton(true);
    setErro(null);
    setSuccessMessage(false);
    carregarBeneficios();
  };

  return (
    <div className="container mt-4">
      {/* <NavigationRoutes /> */}
      <h1>Benefícios</h1>

      {/* Mensagens de erro e sucesso */}
      {erro && (
        <div className="alert alert-danger" role="alert">
          {erro}
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {showButton && (
        <div className="col mb-3">
          {/* <SecondaryButton label={"Cadastrar novo Benefício"} onClick={handleCadastrarClick} /> */}
                  <button 
          type="button" 
          className="br-button primary mr-3"
          onClick={handleCadastrarClick}
        >
          Cadastrar novo Benefício
        </button>
          {/* <SecondaryButton label={"Editar Benefícios"} onClick={handleEditarClick} /> */}

          <button 
          type="button" 
          className="br-button primary"
          onClick={handleEditarClick}
        >
         Editar Benefícios
        </button>

        </div>
      )}

      {showForm && (
        <>
          <h2>Cadastrar Benefício</h2>
          <FormularioBeneficio onSalvar={handleSalvar} />
          <br />
          <button 
          type="button" 
          className="br-button primary mr-3"
          onClick={handleRefreshPage}
        >
          Voltar ao menu de benefícios
        </button>
          {/* <SecondaryButton label={"Voltar ao menu de Benefícios"} onClick={handleRefreshPage} /> */}
        </>
      )}

      {showEdit && (
        <>
          <h2>Editar Benefícios Ativos</h2>
          <ListaBeneficios
            beneficios={beneficios}
            onEditar={handleEditar}
            onExcluir={handleDesativar}
          />
          <br />
                  <button 
          type="button" 
          className="br-button primary mr-3"
          onClick={handleRefreshPage}
        >
          Voltar ao menu de benefícios
        </button>
          {/* <SecondaryButton label={"Voltar ao menu de Benefícios"} onClick={handleRefreshPage} /> */}
        </>
      )}
    </div>
  );
}