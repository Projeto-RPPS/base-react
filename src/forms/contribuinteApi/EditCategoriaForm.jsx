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
          percentualContribuicaoAntesDeSalvar: response.data.percentualContribuicao?.toString() || "",
          percentualContribuicao: response.data.percentualContribuicao?.toString() || ""
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

  const formatDecimalInput = (value) => {
    // Remove tudo exceto números e ponto decimal
    let formattedValue = value.replace(/[^0-9.]/g, '');
    
    // Permite apenas um ponto decimal
    const parts = formattedValue.split('.');
    if (parts.length > 2) {
      formattedValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limita a 2 casas decimais
    if (parts.length === 2) {
      formattedValue = parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return formattedValue;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const jsonFinal = {
      idCategoria: formData.idCategoria,
      nomeCategoria: formData.nomeCategoria,
      percentualContribuicao: 0, // Fixo conforme solicitado
      percentualContribuicaoAntesDeSalvar: parseFloat(formData.percentualContribuicaoAntesDeSalvar) || 0
    };
    
    categoriaService.editarCategoria(jsonFinal)
      .then(response => {
        response
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
    <form onSubmit={handleSubmit} className="form-categoria">
      <div className="row">
        <div className="col-sm">
          {/* Seleção da Categoria */}
          <fieldset className="mb-4">
            <legend className="h4">Selecionar Categoria</legend>
            <SelectCategoria 
              value={formData.idCategoria}
              onChange={handleCategoriaChange}
            />
          </fieldset>

          {/* Dados da Categoria */}
          {formData.idCategoria && (
            <fieldset className="mb-4">
              <legend className="h4">Editar Categoria</legend>
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
                <div className="col-md-10">
                  <div className="d-flex align-items-end gap-2">
                  <Input
                      id="percentualContribuicaoAntesDeSalvar"
                      label="Percentual de Contribuição (%)"
                      value={formData.percentualContribuicaoAntesDeSalvar}
                      onChange={(e) => {
                        const formattedValue = formatDecimalInput(e.target.value);
                        handleChange({
                          target: {
                            id: "percentualContribuicaoAntesDeSalvar",
                            value: formattedValue
                          }
                        });
                      }}
                      placeholder={`Valor atual: ${formData.percentualContribuicao}%`}
                      required
                      maxLength={6}
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
        </div>
      </div>
    </form>
  );
};

export default EditCategoria;