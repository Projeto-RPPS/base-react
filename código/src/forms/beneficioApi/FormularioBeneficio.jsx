import { listarBeneficios, criarBeneficio, atualizarBeneficio, desativarBeneficio } from "../../service/beneficio/beneficioService";
import React, { useState } from "react";
import Input from "../../components/global/Input";
import SecondaryButton from "../../components/global/SecundaryButton";
import AlertaErro from "../../components/beneficioComponent/messageComponent/AlertErro";
import SuccessMessage from "../../components/beneficioComponent/messageComponent/SuccesMessage";

const FormularioBeneficio = ({ onSalvar }) => {
  const [erro, setErro] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    descricao: "",
    tempoMinimoMeses: "",
    percentualBaseMedioContribuicoes: ""
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
      await criarBeneficio(formData);
      setErro(null);
      setSuccessMessage(true);
      setFormData({
        tipo: "",
        descricao: "",
        tempoMinimoMeses: "",
        percentualBaseMedioContribuicoes: ""
      });
      onSalvar();
    } catch (error) {
      const mensagemErro = error.response?.data || "Erro ao cadastrar benefício.";
      setErro(mensagemErro);
      setSuccessMessage(false);
    }
  };

  // Função para verificar se o formulário está válido
  const isFormValid = () => {
    return formData.tipo.trim() !== "" &&
           formData.descricao.trim() !== "" &&
           parseInt(formData.tempoMinimoMeses) > 0 &&
           parseFloat(formData.percentualBaseMedioContribuicoes) > 0;
  };

  return (
    <div className="row justify-content-center">
      <div className="col-sm-12 col-md-10 col-lg-8">
        <div className="br-card">
          <div className="card-header">
            <h1 className="text-center">Cadastrar Benefício</h1>
          </div>
          <div className="card-content p-4">
            {/* Mensagens de erro e sucesso */}
            {erro && (
              <AlertaErro 
                title="Erro ao cadastrar benefício" 
                message={erro} 
                onClose={() => setErro(null)} 
              />
            )}
            <SuccessMessage 
              show={successMessage} 
              title="Cadastro realizado!" 
              message="O benefício foi cadastrado com sucesso." 
              onClose={() => setSuccessMessage(false)} 
            />

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="form-beneficio">
              <fieldset className="br-fieldset mb-4">
                <legend>Dados do Benefício</legend>
                <Input 
                  id="tipo" 
                  label="Tipo de Benefício" 
                  value={formData.tipo} 
                  onChange={handleChange} 
                  required 
                />
                <Input 
                  id="descricao" 
                  label="Descrição" 
                  value={formData.descricao} 
                  onChange={handleChange} 
                  required 
                />
                <Input 
                  id="tempoMinimoMeses" 
                  label="Tempo Mínimo (Meses)" 
                  type="number" 
                  value={formData.tempoMinimoMeses} 
                  onChange={handleChange} 
                  required 
                  min="1"
                />
                <Input 
                  id="percentualBaseMedioContribuicoes" 
                  label="Percentual Base (%)" 
                  type="number" 
                  step="0.01" 
                  value={formData.percentualBaseMedioContribuicoes} 
                  onChange={handleChange} 
                  required 
                  min="0.01"
                />
              </fieldset>

              {/* Botão de cadastro */}
              <div className="text-end mt-4">
                <SecondaryButton 
                  label="Cadastrar Benefício" 
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

export default FormularioBeneficio;