import React, { useState } from "react";
import Input from "../../components/global/Input";
import contribuinteService from "../../service/contribuinte/contribuinteService";
import AlertaErro from "../../components/contribuinteComponent/messageComponent/AlertaErro";
import SuccessMessage from "../../components/contribuinteComponent/messageComponent/SuccesMessage";
import SecondaryButton from "../../components/global/SecundaryButton";
import TableArvoreGenealogica from "../../components/contribuinteComponent/tableComponent/TableArvoreGenealogica";

const ContribuinteData = () => {
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contribuinte, setContribuinte] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [exibirTabela, setExibirTabela] = useState(false);
  const [cpfSalvo, setCpfSalvo] = useState(null);

  const handleCpfChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11);
    setCpf(value);
  };

    const handleClick = (contribuinteCpf) => {
        if (contribuinteCpf) setExibirTabela(true);
        setCpfSalvo(contribuinteCpf);
    };

  const pesquisarContribuinte = (e) => {
    e.preventDefault();

    if (cpf.length !== 11) {
      setErro("CPF deve conter exatamente 11 dígitos");
      return;
    }

    setLoading(true);
    setErro(null);
    setContribuinte(null);

    contribuinteService
      .pesquisarContribuinte(cpf)
      .then((response) => {
        setContribuinte(response.data);
        setSuccessMessage(true);
        setCpf("");
      })
      .catch((error) => {
        console.error("Erro ao pesquisar contribuinte:", error);
        setErro(
          error.response?.data?.message || "Contribuinte não encontrado"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="row justify-content-center">
    <div className="col-sm-10 col-md-8 col-lg-6">
      <div className="br-card">
        <div className="card-header text-center">
            <h1>Pesquisar Contribuintes</h1>
        </div>
        <div className="card-content p-4">
          <div className="br-form">
            <form onSubmit={pesquisarContribuinte} noValidate>
              <fieldset className="br-fieldset mb-4">
                <legend>Pesquisar Contribuinte</legend>
                <Input
                  id="cpf"
                  label="CPF"
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="Digite o CPF (apenas números)"
                  required
                  maxLength={11}
                  pattern="\d{11}"
                  className="col-12"
                />
              </fieldset>
  
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="br-button primary"
                  disabled={loading || cpf.length !== 11}
                >
                  <span className="br-label">
                    {loading ? "Pesquisando..." : "Pesquisar"}
                  </span>
                </button>
              </div>
            </form>
  
            {erro && (
              <div className="br-message danger mt-4">
                <div className="icon">
                  <i className="fas fa-times-circle fa-lg" aria-hidden="true" />
                </div>
                <div className="content" role="alert">
                  <span className="message-title">Erro </span>
                  <span className="message-body">{erro}</span>
                </div>
                <div className="close">
                  <button
                    className="br-button circle small"
                    onClick={() => setErro(null)}
                  >
                    <i className="fas fa-times" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
  
            {contribuinte && (
              <><div className="br-list mt-4">
                                  <div className="br-item">
                                      <div className="row">
                                          <div className="col-md-6">
                                              <strong>Nome Civil:</strong> {contribuinte.nomeCivil}
                                          </div>
                                          <div className="col-md-6">
                                              <strong>Nome Social:</strong>{" "}
                                              {contribuinte.nomeSocial || "Não informado"}
                                          </div>
                                      </div>
                                      <div className="row mt-2">
                                          <div className="col-md-6">
                                              <strong>CPF:</strong>{" "}
                                              {contribuinte.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
                                          </div>
                                          <div className="col-md-6">
                                              <strong>Status:</strong>
                                              <span
                                                  className={`br-tag ${contribuinte.isAtivo ? "success" : "danger"} ml-2`}
                                              >
                                                  {contribuinte.isAtivo ? "Ativo" : "Inativo"}
                                              </span>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex justify-content-end">
                                      <SecondaryButton label={"Gerar Árvore Genealógica"} onClick={() => handleClick(contribuinte.cpf)} />
                                </div></>
            )}

            {successMessage && contribuinte && (
              <div className="br-message success mt-4">
                <div className="icon">
                  <i className="fas fa-check-circle fa-lg" aria-hidden="true" />
                </div>
                <div className="content" role="alert">
                  <span className="message-title">Contribuinte encontrado! </span>
                  <span className="message-body">
                    Os dados foram carregados com sucesso.
                  </span>
                </div>
                <div className="close">
                  <button
                    className="br-button circle small"
                    onClick={() => setSuccessMessage(false)}
                  >
                    <i className="fas fa-times" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <TableArvoreGenealogica cpf={cpfSalvo} exibir={exibirTabela} />
    </div>
  </div>
  

  );
};

export default ContribuinteData;
