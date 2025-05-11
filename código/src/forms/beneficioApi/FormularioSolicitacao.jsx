// src/forms/beneficioApi/FormularioSolicitacao.jsx
import React, { useState } from "react";
import Input from "../../components/global/Input";
import SecondaryButton from "../../components/global/SecundaryButton";
import solicitacaoService from "../../service/beneficio/solicitacaoService";
import AlertaErro from "../../components/beneficioComponent/messageComponent/AlertErro";
import SuccessMessage from "../../components/beneficioComponent/messageComponent/SuccesMessage";

const FormularioSolicitacao = ({ onSalvar }) => {
  const [erro, setErro] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    cpf: "",
    beneficioId: ""
  });

  // Função para lidar com mudanças nos campos
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await solicitacaoService.criarSolicitacao(formData);
      setErro(null);
      setSuccessMessage(true);
      setFormData({
        cpf: "",
        beneficioId: ""
      });
      onSalvar();
    } catch (error) {
      const mensagemErro = error.response?.data || "Erro ao solicitar benefício.";
      setErro(mensagemErro);
      setSuccessMessage(false);
    }
  };

  // Verifica se o formulário está válido
  const isFormValid = () => {
    return formData.cpf.trim().length === 11 && formData.beneficioId.trim() !== "";
  };

  return (
    <div className="row justify-content-center">
      <div className="col-sm-12 col-md-10 col-lg-8">
        <div className="br-card">
          <div className="card-header text-center">
            <h1>Solicitar Benefício</h1>
          </div>
          <div className="card-content p-4">
            {/* Mensagens de sucesso e erro */}
            {erro && (
              <AlertaErro nomeClasse="Solicitação de Benefício" erro={erro} onClose={() => setErro(null)} />
            )}
            <SuccessMessage 
              show={successMessage}
              onClose={() => setSuccessMessage(false)}
              title="Solicitação realizada!"
              message="Sua solicitação de benefício foi processada com sucesso."
            />

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="form-solicitacao">
              <fieldset className="br-fieldset mb-4">
                <legend>Dados da Solicitação</legend>
                <Input 
                  id="cpf" 
                  label="CPF do Solicitante" 
                  value={formData.cpf} 
                  onChange={handleChange} 
                  placeholder="000.000.000-00" 
                  required 
                  maxLength={11}
                />
                <Input 
                  id="beneficioId" 
                  label="ID do Benefício" 
                  value={formData.beneficioId} 
                  onChange={handleChange} 
                  placeholder="Digite o ID do benefício" 
                  required 
                />
              </fieldset>

              <div className="text-end mt-4">
                <SecondaryButton 
                  label="Solicitar Benefício" 
                  type="submit" 
                  className={`br-button ${isFormValid() ? 'primary' : 'secondary'}`}
                  disabled={!isFormValid()}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioSolicitacao;