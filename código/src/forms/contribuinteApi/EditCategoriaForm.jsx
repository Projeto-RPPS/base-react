import React, { useState } from "react";
import Input from "../../components/global/Input";
import categoriaService from "../../service/contribuinte/categoriaService";
import AlertaErro from "../../components/contribuinteComponent/messageComponent/AlertaErro";
import SuccessMessage from "../../components/contribuinteComponent/messageComponent/SuccesMessage";
import SelectCategoria from "../../components/contribuinteComponent/selects/SelectCategoria";

const EditCategoria = ({editFormInitial}) => {
  const [erro, setErro] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [formData, setFormData] = useState(editFormInitial);

  // Carrega os dados quando uma categoria é selecionada
  const handleCategoriaChange = (e) => {
    const idCategoria = e.target.value;
    categoriaService.buscarCategoriaPorId(idCategoria)
      .then(response => {
        setFormData({
          idCategoria: response.data.idCategoria,
          nomeCategoria: response.data.nomeCategoria,
          // Multiplica por 100 para exibição
          percentualContribuicaoAntesDeSalvar: (response.data.percentualContribuicao * 100)?.toString() || "",
          percentualContribuicao: (response.data.percentualContribuicao * 100)?.toString() || ""
        });
      })
      .catch(error => {
        console.error("Erro ao buscar categoria:", error);
        setErro("Erro ao carregar categoria");
      });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const formatPercentInput = (value) => {
    // Remove tudo exceto números
    let formattedValue = value.replace(/[^0-9]/g, '');
    
    // Limita a 2 dígitos (0-99)
    if (formattedValue.length > 2) {
      formattedValue = formattedValue.slice(0, 2);
    }
    
    return formattedValue;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const jsonFinal = {
      idCategoria: formData.idCategoria,
      nomeCategoria: formData.nomeCategoria,
      percentualContribuicao: 0,
      percentualContribuicaoAntesDeSalvar: parseFloat(formData.percentualContribuicaoAntesDeSalvar) || 0
    };
    
    categoriaService.editarCategoria(jsonFinal)
      .then(response => {
        setSuccessMessage(true);
        setFormData(editFormInitial);
      })
      .catch(error => {
        setErro(error.response?.data?.message || "Erro ao editar categoria");
      });
  };

  const isFormValid = () => {
    return formData.idCategoria && 
           formData.nomeCategoria.trim() !== "" && 
           !isNaN(parseFloat(formData.percentualContribuicaoAntesDeSalvar));
  };

  return (
    <div className="row justify-content-center">
      <div className="col-sm-10 col-md-8 col-lg-6">
        <div className="br-card">
          <div className="card-header text-center">
            <h1>Editar Categoria</h1>
          </div>
          <div className="card-content p-4">
            <form onSubmit={handleSubmit} className="form-categoria">
              {/* Seleção da Categoria */}
              <fieldset className="br-fieldset mb-4">
                <legend>Selecionar Categoria</legend>
                <div className="row">
                  <div className="col-8">
                    <SelectCategoria 
                      value={formData.idCategoria}
                      onChange={handleCategoriaChange}
                    />
                  </div>
                </div>
              </fieldset>
  
              {/* Dados da Categoria */}
              {formData.idCategoria && (
                <fieldset className="br-fieldset mb-4">
                  <legend>Editar Categoria</legend>
                  <div className="row g-3">
                    <div className="col-8">
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
                    <div className="col-8">
                      <div className="percent-input-container">
                        <Input
                          id="percentualContribuicaoAntesDeSalvar"
                          label="Percentual de Contribuição"
                          value={formData.percentualContribuicaoAntesDeSalvar}
                          onChange={(e) => {
                            const formattedValue = formatPercentInput(e.target.value);
                            handleChange({
                              target: {
                                id: "percentualContribuicaoAntesDeSalvar",
                                value: formattedValue
                              }
                            });
                          }}
                          placeholder={`Valor atual: ${formData.percentualContribuicao}%`}
                          required
                          maxLength={2}
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
              )}
  
              <div className="text-end mt-4">
                {erro && (
                  <AlertaErro nomeClasse={"Categoria"} erro={erro} onClose={() => setErro(null)} />
                )}
                <SuccessMessage 
                  show={successMessage}
                  onClose={() => setSuccessMessage(false)}
                  title="Edição realizada!"
                  message="A Categoria foi editada com sucesso."
                />
                <div className="d-flex justify-content-end gap-3">
                  <button 
                    type="submit" 
                    className={`br-button ${isFormValid() ? 'primary' : 'primary mb-3'}`}
                    disabled={!isFormValid()}
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoria;