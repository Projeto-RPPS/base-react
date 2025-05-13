import React, { useState } from "react";
import Input from "../../components/global/Input";
import DatePicker from "../../components/contribuinteComponent/DatePicker";
import contribuicaoService from "../../service/contribuinte/contribuicaoService";
import AlertaErro from "../../components/contribuinteComponent/messageComponent/AlertaErro";
import SuccessMessage from "../../components/contribuinteComponent/messageComponent/SuccesMessage";

const FazerContribuicao = () => {
  const [erro, setErro] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({ cpf: "", dataReferencia: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const formatCPF = (value) => {
    const numericValue = value.replace(/\D/g, "");
    let formattedValue = numericValue;
    if (numericValue.length > 3) {
      formattedValue = `${numericValue.substring(0, 3)}.${numericValue.substring(3)}`;
    }
    if (numericValue.length > 6) {
      formattedValue = `${formattedValue.substring(0, 7)}.${formattedValue.substring(7)}`;
    }
    if (numericValue.length > 9) {
      formattedValue = `${formattedValue.substring(0, 11)}-${formattedValue.substring(11, 13)}`;
    }
    return formattedValue;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.cpf || !formData.dataReferencia) {
      setErro("CPF e data de referência são obrigatórios");
      return;
    }

    const cpfSemFormatacao = formData.cpf.replace(/\D/g, "");
    const jsonFinal = {
      cpf: cpfSemFormatacao,
      dataReferencia: formData.dataReferencia,
    };

    contribuicaoService
      .fazerContribuicao(jsonFinal)
      .then(() => {
        setSuccessMessage(true);
        setFormData({ cpf: "", dataReferencia: "" });
      })
      .catch((error) => {
        console.log(jsonFinal);
        setErro(error);
      });
  };

  const isFormValid = () => {
    return formData.cpf.replace(/\D/g, "").length === 11 && formData.dataReferencia;
  };

  return (
    <div className="row justify-content-center">
      <div className="col-sm-10 col-md-8 col-lg-6">
        <div className="br-card">
          <div className="card-header text-center">
            <h1>Fazer Contribuição</h1>
          </div>
          <div className="card-content p-4">
            <form onSubmit={handleSubmit}>
              <fieldset className="br-fieldset mb-4">
                <legend>Dados da Contribuição</legend>
                <div className="row g-3">
                  <div className="col-7">
                    <Input
                      id="cpf"
                      label="CPF"
                      value={formData.cpf}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            id: "cpf",
                            value: formatCPF(e.target.value),
                          },
                        })
                      }
                      placeholder="000.000.000-00"
                      required
                      maxLength={14}
                    />
                  </div>
                      
                 <DatePicker
                    id="data-referencia"
                    label="Data de Referência"
                    value={formData.dataReferencia} // Formato yyyy-mm-dd
                    onChange={(date) => setFormData({...formData, dataReferencia: date})}
                    minDate="15/04/2022"
                    maxDate="current" // ou uma data específica no formato dd/mm/yyyy
                    />
                </div>
              </fieldset>

              <div className="text-end mt-4">
                {erro && (
                  <AlertaErro
                    nomeClasse={"ao fazer Contribuição"}
                    erro={erro}
                    onClose={() => setErro(null)}
                  />
                )}
                <SuccessMessage
                  show={successMessage}
                  onClose={() => setSuccessMessage(false)}
                  title="Contribuição realizada!"
                  message="A contribuição foi registrada com sucesso."
                />
                <div className="d-flex justify-content-end gap-3">
                <button
                  type="submit"
                  className={`br-button primary`}
                  disabled={!isFormValid()}
                >
                  Enviar Contribuição
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

export default FazerContribuicao;
