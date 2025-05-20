import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/global/Input";
import contribuicaoService from "../../service/contribuinte/contribuicaoService";
import authService from "../../service/login/authService";
import AlertaErro from "../../components/contribuinteComponent/messageComponent/AlertaErro";
import SuccessMessage from "../../components/contribuinteComponent/messageComponent/SuccesMessage";
import Table from "../../components/global/Table";

const ContribuicaoData = () => {
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contribuicoes, setContribuicoes] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);
  const [userInfo, setUserInfo] = useState({ role: null, cpf: null });
  const navigate = useNavigate();

  useEffect(() => {
    authService
      .me()
      .then(u => {
        if (!u) {
          navigate("/home");
          return;
        }
        setUserInfo({ role: u.role, cpf: u.cpf });
        
        // Se for user, já carrega automaticamente suas contribuições
        if (u.role === "user") {
          setCpf(u.cpf);
          pesquisarContribuicoes(null, u.cpf);
        }
      })
      .catch(() => {
        navigate("/home");
      });
  }, [navigate]);

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

  const pesquisarContribuicoes = (e, cpfToSearch = null) => {
    if (e) e.preventDefault();

    let cpfSemFormatacao;
    
    if (cpfToSearch) {
      // Caso de carregamento automático para user
      cpfSemFormatacao = cpfToSearch.replace(/\D/g, '');
    } else {
      // Caso de pesquisa manual (admin)
      cpfSemFormatacao = cpf.replace(/\D/g, '');
    }

    if (cpfSemFormatacao.length !== 11) {
      setErro("CPF deve conter exatamente 11 dígitos");
      return;
    }

    setLoading(true);
    setErro(null);
    setContribuicoes([]);

    contribuicaoService
      .listarContribuicao(cpfSemFormatacao)
      .then((response) => {
        setContribuicoes(response.data);
        setSuccessMessage(true);
      })
      .catch((error) => {
        console.error("Erro ao pesquisar contribuições:", error);
        setErro(error.response?.data?.message || "Erro ao buscar contribuições");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      header: "Data da Contribuição",
      accessor: "dataContribuicao",
    },
    {
      header: "Data de Referência",
      accessor: "dataReferencia",
    },
    {
      header: "Valor (R$)",
      accessor: "valorContribuicao",
      format: (value) => value.toLocaleString('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })
    },
  ];

  return (
    <div className="row justify-content-center">
      <div className="col-sm-10 col-md-8 col-lg-6">
        <div className="br-card">
          <div className="card-header text-center">
            <h1>Histórico de Contribuições</h1>
          </div>
          <div className="card-content p-3">
            <div className="br-form">
              <form onSubmit={pesquisarContribuicoes} noValidate>
                <fieldset className="br-fieldset mb-1">
                  <legend>Pesquisar Contribuições</legend>
                  {userInfo.role === "admin" ? (
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
                  ) : (
                    <div className="br-input">
                      <label htmlFor="cpf-disabled">CPF</label>
                      <input
                        id="cpf-disabled"
                        type="text"
                        value={formatCPF(userInfo.cpf || "")}
                        disabled
                        className="form-control"
                      />
                    </div>
                  )}
                </fieldset>

                {userInfo.role === "admin" && (
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
                )}
              </form>

              {erro && (
                <AlertaErro 
                  nomeClasse="Contribuições" 
                  erro={erro} 
                  onClose={() => setErro(null)} 
                />
              )}

              {successMessage && contribuicoes.length > 0 && (
                <SuccessMessage
                  show={successMessage}
                  onClose={() => setSuccessMessage(false)}
                  title="Contribuições encontradas!"
                  message={`Foram encontradas ${contribuicoes.length} contribuições.`}
                />
              )}
            </div>
          </div>
        </div>

        {contribuicoes.length > 0 && (
          <Table
            title="Contribuições"
            columns={columns}
            data={contribuicoes}
            density="medium"
          />
        )}
      </div>
    </div>
  );
};

export default ContribuicaoData;