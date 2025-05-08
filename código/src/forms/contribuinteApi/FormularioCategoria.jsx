import React, { useState } from "react";
import Input from "../../components/global/Input";
import categoriaService from "../../service/contribuinte/categoriaService";
import AlertaErro from "../../components/contribuinteComponent/messageComponent/AlertaErro";
import SuccessMessage from "../../components/contribuinteComponent/messageComponent/SuccesMessage";

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
    <div className="row justify-content-center">
      <div className="col-sm-10 col-md-8 col-lg-6">
        <div className="br-card">
          <div className="card-header text-center">
            <h1>Cadastrar Categoria</h1>
          </div>
          <div className="card-content p-4">
            <div className="br-form">
              <form onSubmit={handleSubmit} className="form-categoria">
                <fieldset className="br-fieldset mb-4">
                  <legend>Dados da Categoria</legend>
  
                  <div className="row g-3">
                    <div className="col-12">
                      <Input
                        id="nomeCategoria"
                        label="Nome da Categoria"
                        value={formData.nomeCategoria}
                        onChange={handleChange}
                        placeholder="Nome da categoria"
                        required
                        maxLength={100}
                        className="col-12"
                      />
                    </div>
                  </div>
  
                  <div className="row g-3 mt-3">
                    <div className="col-12">
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
                        className="col-12"
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default FormularioCategoria;