import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "../../components/contribuinteComponent/DatePicker";
import contribuicaoService from "../../service/contribuinte/contribuicaoService";
import authService from "../../service/login/authService";
import AlertaErro from "../../components/contribuinteComponent/messageComponent/AlertaErro";
import SuccessMessage from "../../components/contribuinteComponent/messageComponent/SuccesMessage";

const FazerContribuicao = () => {
  const [erro, setErro] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({ cpf: "", dataReferencia: "" });
  const [userCpf, setUserCpf] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    authService
      .me()
      .then(u => {
        if (!u) {
          navigate("/home");
          return;
        }
        setUserCpf(u.cpf);
        setFormData(prev => ({ ...prev, cpf: u.cpf }));
      })
      .catch(() => {
        navigate("/home");
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.dataReferencia) {
      setErro("Data de referência é obrigatória");
      return;
    }

    const jsonFinal = {
      cpf: userCpf.replace(/\D/g, ""),
      dataReferencia: formData.dataReferencia,
    };

    contribuicaoService
      .fazerContribuicao(jsonFinal)
      .then(() => {
        setSuccessMessage(true);
        setFormData({ ...formData, dataReferencia: "" });
      })
      .catch((error) => {
        setErro(error);
      });
  };

  const isFormValid = () => {
    return userCpf && formData.dataReferencia;
  };

  const formatCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
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
                    <div className="br-input">
                      <label htmlFor="cpf-disabled">CPF</label>
                      <input
                        id="cpf-disabled"
                        type="text"
                        value={formatCPF(userCpf || "")}
                        disabled
                        className="form-control"
                      />
                    </div>
                  </div>
                  
                  <DatePicker
                    id="data-referencia"
                    label="Data de Referência"
                    value={formData.dataReferencia}
                    onChange={(date) => setFormData({...formData, dataReferencia: date})}
                    minDate="15/04/2022"
                    maxDate="current"
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