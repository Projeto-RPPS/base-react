import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/global/Input";
import contribuinteService from "../../service/contribuinte/contribuinteService";
import authService from "../../service/login/authService";
import AlertaErro from "../../components/contribuinteComponent/messageComponent/AlertaErro";
import SuccessMessage from "../../components/contribuinteComponent/messageComponent/SuccesMessage";
import SecondaryButton from "../../components/global/SecundaryButton";
import ArvoreGenealogica from "../../components/contribuinteComponent/tableComponent/ArvoreGenealogica";

const ContribuinteData = () => {
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contribuinte, setContribuinte] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [exibirTabela, setExibirTabela] = useState(false);
  const [cpfSalvo, setCpfSalvo] = useState(null);
  const [clicado, setClicado] = useState(false);
  const [desativando, setDesativando] = useState(false);
  const [userRole, setUserRole] = useState(null);
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
        setUserRole(u.role);
        setUserCpf(u.cpf);
        
        // Se for user, carrega automaticamente seus dados (sem preencher o input)
        if (u.role === "user") {
          pesquisarContribuinte(null, u.cpf);
        }
      })
      .catch(() => {
        navigate("/home");
      });
  }, [navigate]);

  // Função para formatar o CPF durante a digitação
  const formatCPF = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const limitedValue = numericValue.slice(0, 11);
    
    let formattedValue = limitedValue;
    if (limitedValue.length > 9) {
      formattedValue = `${limitedValue.slice(0, 3)}.${limitedValue.slice(3, 6)}.${limitedValue.slice(6, 9)}-${limitedValue.slice(9)}`;
    } else if (limitedValue.length > 6) {
      formattedValue = `${limitedValue.slice(0, 3)}.${limitedValue.slice(3, 6)}.${limitedValue.slice(6)}`;
    } else if (limitedValue.length > 3) {
      formattedValue = `${limitedValue.slice(0, 3)}.${limitedValue.slice(3)}`;
    }
    
    return formattedValue;
  };

  const handleCpfChange = (e) => {
    const formattedValue = formatCPF(e.target.value);
    setCpf(formattedValue);
  };

  const handleClick = (contribuinteCpf) => {
    setClicado(true);
    if (contribuinteCpf) setExibirTabela(true);
    setCpfSalvo(contribuinteCpf);
  };

  const desativarContribuinte = (cpf) => {
    setDesativando(true);
    contribuinteService.desativarContribuinte(cpf.replace(/\D/g, ''))
      .then(() => {
        setSuccessMessage(true);
        setContribuinte(prev => ({ ...prev, isAtivo: false }));
      })
      .catch(error => {
        setErro(error);
      })
      .finally(() => {
        setDesativando(false);
      });
  };

  const pesquisarContribuinte = (e, cpfToSearch = null) => {
    if (e) e.preventDefault();

    const cpfSemFormatacao = cpfToSearch ? cpfToSearch.replace(/\D/g, '') : cpf.replace(/\D/g, '');

    if (cpfSemFormatacao.length !== 11) {
      setErro({ message: "CPF deve conter exatamente 11 dígitos" });
      return;
    }

    setLoading(true);
    setErro(null);
    setContribuinte(null);

    contribuinteService
      .pesquisarContribuinte(cpfSemFormatacao)
      .then((response) => {
        setExibirTabela(false);
        setClicado(false);
        setContribuinte(response.data);
        setSuccessMessage(true);
        // Não limpa o CPF se for pesquisa manual
        if (!cpfToSearch) {
          setCpf("");
        }
      })
      .catch((error) => {
        console.error("Erro ao pesquisar contribuinte:", error);
        setErro(error);
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
                <fieldset className="br-fieldset mb-1">
                  <legend>Pesquisar Contribuinte</legend>
                  <Input
                    id="cpf"
                    label="CPF"
                    value={cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                    required
                    maxLength={14}
                    className="col-12"
                  />
                </fieldset>
  
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="br-button primary"
                    disabled={loading || cpf.replace(/\D/g, '').length !== 11}
                  >
                    <span className="br-label">
                      {loading ? "Pesquisando..." : "Pesquisar"}
                    </span>
                  </button>
                </div>
              </form>
              <br></br>
              <AlertaErro 
                nomeClasse="ao pesquisar contribuinte" 
                erro={erro} 
                onClose={() => setErro(null)} 
              />
  
              {contribuinte && (
                <>
                  <div className="br-list mt-4">
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
                  <br />
                  {!clicado && (
                    <div className="d-flex justify-content-end gap-3">
                      <div className="col-md-5">
                        <SecondaryButton 
                          label={"Gerar Árvore Genealógica"} 
                          onClick={() => handleClick(contribuinte.cpf)} 
                        />
                      </div>
                      {contribuinte.isAtivo && userRole === "admin" && (
                        <div className="col-md-5">
                          <SecondaryButton 
                            label={desativando ? "Desativando..." : "Desativar Contribuinte"} 
                            onClick={() => desativarContribuinte(contribuinte.cpf)}
                            disabled={desativando}
                            variant="danger"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              <SuccessMessage
                title="Operação realizada!"
                message={
                  contribuinte?.isAtivo 
                    ? "Dados carregados com sucesso." 
                    : "Contribuinte desativado com sucesso."
                }
                onClose={() => setSuccessMessage(false)}
                show={successMessage && contribuinte}
              />
            </div>
          </div>
        </div>
        {exibirTabela && (
          <ArvoreGenealogica 
            cpf={cpfSalvo} 
            exibir={exibirTabela} 
            nomeContribuinte={contribuinte?.nomeCivil} 
          />
        )}
      </div>
    </div>
  );
};

export default ContribuinteData;