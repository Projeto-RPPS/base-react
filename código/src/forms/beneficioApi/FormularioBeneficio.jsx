import React, { useState } from "react";
import Input from "../../components/global/Input";
import SecondaryButton from "../../components/global/SecundaryButton";
import AlertaErro from "../../components/beneficioComponent/messageComponent/AlertErro";
import SuccessMessage from "../../components/beneficioComponent/messageComponent/SuccesMessage";
import beneficioService from "../../service/beneficio/beneficioService";

const FormularioBeneficio = ({ onSalvar }) => {
  const [erro, setErro] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    descricao: "",
    tempoMinimoMeses: "",
    percentualBaseMedioContribuicoes: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log("handlesubmmit foi chamado");
    e.preventDefault();

    
    const jsonFinal = {
  tipo: formData.tipo,
  descricao: formData.descricao,
  tempoMinimoMeses: Number(formData.tempoMinimoMeses) || 0,
  percentualBaseMedioContribuicoes: Number(formData.percentualBaseMedioContribuicoes) || 0
};

  
console.log("Enviando dados:", jsonFinal);

// 🟨 Adiciona aqui o log dos tipos:
  console.log("Enviando dados:", jsonFinal);
  console.log("Tipos enviados:", {
    tipo: typeof jsonFinal.tipo,
    descricao: typeof jsonFinal.descricao,
    tempoMinimoMeses: typeof jsonFinal.tempoMinimoMeses,
    percentualBaseMedioContribuicoes: typeof jsonFinal.percentualBaseMedioContribuicoes,
  });


try {
  await beneficioService.criarBeneficio(jsonFinal)
  setErro(null);
    setSuccessMessage(true);
    setFormData({
      tipo: "",
      descricao: "",
      tempoMinimoMeses: "",
      percentualBaseMedioContribuicoes: ""
    });
    onSalvar(); // isso aqui atualiza a lista na tela, lembra?

}
 catch (error) {
      const mensagemErro = error.response?.data?.mensagem || "Erro ao cadastrar benefício.";
      setErro(mensagemErro);
      setSuccessMessage(false);
    }
  };

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
            {erro && <AlertaErro title="Erro ao cadastrar benefício" message={erro} onClose={() => setErro(null)} />}
            <SuccessMessage show={successMessage} title="Cadastro realizado!" message="O benefício foi cadastrado com sucesso." onClose={() => setSuccessMessage(false)} />

            <form onSubmit={handleSubmit} className="form-beneficio">
              <fieldset className="br-fieldset mb-4">
                <legend>Dados do Benefício</legend>
                <Input id="tipo" label="Tipo de Benefício" value={formData.tipo || ""} onChange={handleChange} placeholder="Auxílio Doença" required />
                <Input id="descricao" label="Descrição" value={formData.descricao || ""} onChange={handleChange}  placeholder="Concedido em caso de incapacidade temporária"  required />
                <Input id="tempoMinimoMeses" label="Tempo Mínimo (Meses)" type="number" value={formData.tempoMinimoMeses || ""} onChange={handleChange} placeholder="12" required min="0" />
                <Input id="percentualBaseMedioContribuicoes" label="Percentual Base (%)" type="number" step="0.01" value={formData.percentualBaseMedioContribuicoes || ""} onChange={handleChange}  placeholder="81.5"  required min="0.01" />
              </fieldset>

              <div className="text-end mt-4">
                                <button 
  type="submit" 
  className={`br-button ${isFormValid() ? 'primary' : 'primary mr-3'}`}
  disabled={!isFormValid()}
  aria-disabled={!isFormValid()}
>
  {isFormValid() ? 'Cadastrar Benefício' : 'Cadastrar Benefício'}
</button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioBeneficio;
