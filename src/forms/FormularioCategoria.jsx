import React, { useState } from "react";
import Input from "../components/Input";
import SecondaryButton from "../components/SecondaryButton";
import categoriaService from "../service/categoriaService";
import AlertaErro from "../components/messageComponents/AlertaErro";
import SuccessMessage from "../components/messageComponents/SuccessMessage";

const FormularioCategoria = ({formIncial}) => {
  const [erro, setErro] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [formData, setFormData] = useState(formIncial);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const jsonFinal = {
      nomeCategoria: formData.nomeCategoria,
      percentualContribuicao: Number(formData.percentualContribuicao) || 0
    };
  
    console.log("Dados enviados:", JSON.stringify(jsonFinal, null, 2));
    
    categoriaService.cadastrarCategoria(jsonFinal)
      .then(response => {
        console.log("Categoria cadastrada com sucesso:", response.data);
        setErro(null);
        setSuccessMessage(true);
        setFormData(formIncial);
      })
      .catch(error => {
        console.error("Erro ao cadastrar categoria:", error);
        setErro(error.response?.data?.message || "Erro ao cadastrar categoria");
      });
  };

  const isFormValid = () => {
    return formData.nomeCategoria.trim() !== "" && 
           !isNaN(formData.percentualContribuicao);
  };

  return (
    <form onSubmit={handleSubmit} className="form-categoria">
      <div className="row">
        <div className="col-sm">
          {/* Dados da Categoria */}
          <fieldset className="mb-4">
            <legend className="h4">Dados da Categoria</legend>
            <div className="row g-3">
              <div className="col-md-10">
                <Input
                  id="nomeCategoria"
                  label="Nome da Categoria"
                  value={formData.nomeCategoria}
                  onChange={handleChange}
                  placeholder="Nome da categoria"
                  required
                  maxLength={100}
                />
              </div>
              </div>
              <div className="row g-3">
              <div className="col-md-10">
                <Input
                  id="percentualContribuicao"
                  label="Percentual de Contribuição (%)"
                  value={formData.percentualContribuicao}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    if (value === "" || !isNaN(value)) {
                      handleChange({
                        target: {
                          id: "percentualContribuicao",
                          value: value
                        }
                      });
                    }
                  }}
                  placeholder="Ex: 7.5"
                  required
                  maxLength={3}
                />
              </div>
            </div>
          </fieldset>

          <div className="text-end mt-4">
            {erro && (
              <AlertaErro nomeClasse={"Categoria"} erro={erro} onClose={() => setErro(null)} />
            )}
            <SuccessMessage 
              show={successMessage}
              onClose={() => setSuccessMessage(false)}
              title="Cadastro realizado!"
              message="A Categoria foi cadastrada com sucesso."
            />
            <div className="d-flex justify-content-end gap-3">
              <button 
                type="submit" 
                className={`br-button ${isFormValid() ? 'primary' : 'primary mr-3'}`}
                disabled={!isFormValid()}
              >
                Cadastrar Categoria
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormularioCategoria;