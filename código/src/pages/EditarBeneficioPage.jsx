import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../components/global/Input";
import SecondaryButton from "../../src/components/global/SecundaryButton";
import AlertaErro from "../../src/components/beneficioComponent/messageComponent/AlertErro";
import SuccessMessage from "../../src/components/beneficioComponent/messageComponent/SuccesMessage";
import beneficioService from "../../src/service/beneficio/beneficioService";

const EditarBeneficioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tipo: "",
    descricao: "",
    tempoMinimoMeses: "",
    percentualBaseMedioContribuicoes: ""
  });

  const [erro, setErro] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    const carregarBeneficio = async () => {
      try {
        const data = await beneficioService.listarBeneficios();
        const beneficio = data.find((b) => b.idBeneficio.toString() === id);
        if (beneficio) {
          setFormData(beneficio);
        } else {
          setErro("Benefício não encontrado.");
        }
      } catch (error) {
        setErro("Erro ao carregar benefício.");
      }
    };
    carregarBeneficio();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jsonFinal = {
      tipo: formData.tipo,
      descricao: formData.descricao,
      tempoMinimoMeses: Number(formData.tempoMinimoMeses),
      percentualBaseMedioContribuicoes: Number(formData.percentualBaseMedioContribuicoes)
    };

    try {
      await beneficioService.atualizarBeneficio(id, jsonFinal);
      setErro(null);
      setSuccessMessage(true);
    } catch (error) {
      setErro(error.response?.data?.mensagem || "Erro ao atualizar benefício.");
      setSuccessMessage(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.tipo.trim() !== "" &&
      formData.descricao.trim() !== "" &&
      parseInt(formData.tempoMinimoMeses) > 0 &&
      parseFloat(formData.percentualBaseMedioContribuicoes) > 0
    );
  };

  return (
    <div className="row justify-content-center">
    <div className="col-sm-12 col-md-10 col-lg-8"> {/* Mesmo tamanho do FormularioBeneficio */}

      <div className="br-card">
        <div className="card-header text-center">
          <h1>Editar Benefício</h1>
        </div>
        <div className="card-content p-4">
          {erro && <AlertaErro title="Erro ao atualizar benefício" message={erro} onClose={() => setErro(null)} />}
          <SuccessMessage
            show={successMessage}
            title="Atualização realizada!"
            message="O benefício foi atualizado com sucesso."
            onClose={() => setSuccessMessage(false)}
          />

          <form onSubmit={handleSubmit} className="form-beneficio">
            <fieldset className="br-fieldset mb-4">
              <legend>Dados do Benefício</legend>
              <Input
                id="tipo"
                label="Tipo de Benefício"
                value={formData.tipo || ""}
                onChange={handleChange}
                placeholder="Auxílio Doença"
                required
              />
              <Input
                id="descricao"
                label="Descrição"
                value={formData.descricao || ""}
                onChange={handleChange}
                placeholder="Concedido em caso de incapacidade temporária"
                required
              />
              <Input
                id="tempoMinimoMeses"
                label="Tempo Mínimo (Meses)"
                type="number"
                value={formData.tempoMinimoMeses || ""}
                onChange={handleChange}
                placeholder="12"
                required
                min="0"
              />
              <Input
                id="percentualBaseMedioContribuicoes"
                label="Percentual Base (%)"
                type="number"
                step="0.01"
                value={formData.percentualBaseMedioContribuicoes || ""}
                onChange={handleChange}
                placeholder="81.5"
                required
                min="0.01"
              />
            </fieldset>

            <div className="text-end mt-4">
              <button
                type="submit"
                className={`br-button ${isFormValid() ? "primary" : "primary mr-3"}`}
                disabled={!isFormValid()}
                aria-disabled={!isFormValid()}
              >
                {isFormValid() ? "Atualizar Benefício" : "Preencha todos os campos"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Botão voltar fora do card */}
      <div className="text-end mt-4">
                  
        {/* <SecondaryButton label="Voltar ao menu de Benefícios" onClick={() => navigate("/beneficios")} /> */}

      <button 
        type="button" 
        className="br-button primary mr-3"
        onClick={() => navigate("/beneficios")}
      >
        Voltar ao menu de Benefícios
      </button>
            
         
      </div>

    </div>
  </div>
  );
};

export default EditarBeneficioPage;
