// src/forms/beneficioApi/FormularioSolicitacao.jsx
import React, { useState } from "react";
import Input from "../../components/global/Input";
import SecondaryButton from "../../components/global/SecundaryButton";
import solicitacaoService from "../../service/beneficio/solicitacaoService";
import AlertaErro from "../../components/beneficioComponent/messageComponent/AlertErro";
import SuccessMessage from "../../components/beneficioComponent/messageComponent/SuccesMessage";
import SelectBeneficio from "../../components/beneficioComponent/selects/SelectBeneficio";


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
    return formData.cpf.trim().length === 11 && String(formData.beneficioId).trim() !== "";
  };


  return (
   <div className="row justify-content-center">
  <div className="col-sm-12 col-md-10 col-lg-8">
    <div className="br-card">
      <div className="card-header text-center">
        <h1>Solicitar Benefício</h1>
      </div>
      <div className="card-content p-4">
        {erro && (
          <AlertaErro nomeClasse="Solicitação de Benefício" erro={erro} onClose={() => setErro(null)} />
        )}
        <SuccessMessage
          show={successMessage}
          onClose={() => setSuccessMessage(false)}
          title="Solicitação realizada!"
          message="Sua solicitação de benefício foi processada com sucesso."
        />


        <form onSubmit={handleSubmit} className="form-solicitacao">
          <fieldset className="br-fieldset mb-4">
            <legend>Dados da Solicitação</legend>


            <div className="row">
              <Input
                id="cpf"
                label="CPF do Solicitante"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
                maxLength={11}
              />


              {/* Campo de seleção estilizado como o Input */}
              <div className="col-md-7 mb-3">
                <div className="br-input">
                  {/* <label htmlFor="beneficioId">Selecione o Benefício</label> */}
                  <SelectBeneficio
                    value={formData.beneficioId}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </fieldset>


          <div className="text-end mt-4">
            <button
              type="submit"
              className={`br-button ${isFormValid() ? 'primary' : 'primary mr-3'}`}
              disabled={!isFormValid()}
              aria-disabled={!isFormValid()}
            >
              {isFormValid() ? 'Solicitar Benefício' : 'Solicitar Beneficio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
  );
};


export default FormularioSolicitacao;
