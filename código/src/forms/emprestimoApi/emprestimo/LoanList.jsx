import React, { useState, useMemo, useEffect } from "react";
import Button from "../../../components/global/Button";
import Message from "../../../components/global/Message";
import emprestimoService from "../../../service/emprestimo/emprestimoService";
import { useNavigate } from "react-router-dom";
import authService from "../../../service/login/authService";

export default function LoanList() {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [emprestimos, setEmprestimos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchedOnce, setFetchedOnce] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [warningMsg, setWarningMsg] = useState("");

  const [expandedId, setExpandedId] = useState(null);
  const [parcelas, setParcelas] = useState([]);
  const [loadingParcelas, setLoadingParcelas] = useState(false);
  const [erroParcelas, setErroParcelas] = useState("");

  useEffect(() => {
      authService
        .me()
        .then(({ cpf: raw }) => {
          const formatted = raw.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            "$1.$2.$3-$4"
          );
          setCpf(formatted);
        })
        .catch(() => {
          // não está logado
          navigate("/home");
        });
    }, [navigate]);

  const rawCpf = cpf.replace(/\D/g, "");

   async function fetchLoans() {
    if (rawCpf.length !== 11) return;

    // reset de estados
    setExpandedId(null);
    setParcelas([]);
    setErroParcelas("");
    setFetchedOnce(false);
    setLoading(true);
    setErrorMsg("");
    setWarningMsg("");
    setEmprestimos([]);

    try {
      const res = await emprestimoService.listarEmprestimosPorCpf(rawCpf);
      const data = Array.isArray(res.data) ? res.data : [];
      if (data.length === 0) {
        setWarningMsg("Nenhum empréstimo encontrado para o CPF informado.");
      } else {
        setEmprestimos(
          data.map(i => ({
            ...i,
            dataInicio: new Date(i.dataInicio).toLocaleDateString("pt-BR"),
          }))
        );
      }
    } catch (err) {
      const resp = err.response;
      if (resp?.status === 404 && Array.isArray(resp.data.erros)) {
        setWarningMsg(
          resp.data.mensagem ||
            "Nenhum empréstimo encontrado para o CPF informado."
        );
      } else {
        setErrorMsg(
          resp?.data?.mensagem ||
            "Ocorreu um erro inesperado. Tente novamente mais tarde."
        );
      }
    } finally {
      setFetchedOnce(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLoans();
  }, [rawCpf]);

  async function toggleParcelas(loan) {
    const id = loan.idEmprestimo;
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setParcelas([]);
    setErroParcelas("");
    setLoadingParcelas(true);

    try {
      const res = await emprestimoService.listarParcelas(id);
      setParcelas(
        res.data.map(p => ({
          ...p,
          dataVencimento: new Date(p.dataVencimento).toLocaleDateString("pt-BR"),
          dataPagamento: p.dataPagamento
            ? new Date(p.dataPagamento).toLocaleDateString("pt-BR")
            : "--",
          statusPagamento: p.paga ? "Paga" : "Pendente",
        }))
      );
    } catch {
      setErroParcelas("Erro ao carregar parcelas. Tente novamente mais tarde.");
    } finally {
      setLoadingParcelas(false);
    }
  }

  return (
    <>
      <main id="main-content" className="container my-5">

        {/* Formulário de busca */}
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-md-10 col-lg-5">
            <div className="br-card">
              <div className="card-header text-center">
                <h2>Meus Empréstimos</h2>
              </div>
              <div className="card-content p-4">
                <div className="row align-items-end mb-3">
                  <div className="col-12">
                      <div className="br-input">
                        <label htmlFor="cpf-disabled">CPF</label>
                        <input
                          id="cpf-disabled"
                          type="text"
                          value={cpf}        
                          disabled                      
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-3 text-right">
                  </div>
                </div>

                {errorMsg && (
                  <Message
                    type="danger"
                    title="Erro."
                    className="mt-4"
                    onClose={() => {
                      setErrorMsg("");
                      setFetchedOnce(false);
                      setEmprestimos([]);
                    }}
                  >
                    {errorMsg}
                  </Message>
                )}
                {fetchedOnce && !loading && warningMsg && (
                  <Message
                    type="warning"
                    title="Atenção. "
                    className="mt-4"
                    onClose={() => {
                      setWarningMsg("");
                      setFetchedOnce(false);
                      setEmprestimos([]);
                    }}
                  >
                    {warningMsg}
                  </Message>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de resultados */}
        {fetchedOnce && !loading && !errorMsg && !warningMsg && (
          <div className="row justify-content-center">
            <div className="col-12 col-md-10">
              <div className="table-responsive">
                <table className="br-table">
                  <colgroup>
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Parcela</th>
                      <th>Quantidade</th>
                      <th>Financeiro</th>
                      <th>Início</th>
                      <th>Ações</th>
                      <th>Fatura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emprestimos.map(loan => (
                      <React.Fragment key={loan.idEmprestimo}>
                        <tr>
                          <td>{loan.status}</td>
                          <td>{loan.valorTotal.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                          })}</td>
                          <td>{loan.valorParcela.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                          })}</td>
                          <td>{loan.quantidadeParcelas}</td>
                          <td>{loan.statusFinanceiro}</td>
                          <td>{loan.dataInicio}</td>
                          <td>
                            <Button
                              variant="tertiary"
                              size="small"
                              style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem" }}
                              onClick={() => toggleParcelas(loan)}
                            >
                              {expandedId === loan.idEmprestimo ? "Ocultar" : "Ver Mais"}
                            </Button>
                          </td>
                           <td className="text-center align-middle">
                            <Button
                              variant="tertiary"
                              size="small"
                              disabled={loan.statusFinanceiro === "QUITADO"}
                              onClick={() => navigate(`/fatura/${loan.idEmprestimo}`)}
                              style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem" }}
                            >
                              Pagar
                            </Button>
                          </td>
                        </tr>

                        {expandedId === loan.idEmprestimo && (
                          <tr>
                            <td colSpan={8} className="p-0">
                              {erroParcelas && (
                                <Message
                                  type="danger"
                                  title="Erro."
                                  className="m-3"
                                  onClose={() => setErroParcelas("")}
                                >
                                  {erroParcelas}
                                </Message>
                              )}
                              {loadingParcelas ? (
                                <p className="m-3">Carregando parcelas…</p>
                              ) : (
                                <div style={{ width: "70%", margin: "1rem auto" }}>
                                  <div className="table-responsive">
                                    <table className="br-table">
                                      <colgroup>
                                        <col style={{ width: "20%" }} />
                                        <col style={{ width: "20%" }} />
                                        <col style={{ width: "20%" }} />
                                        <col style={{ width: "20%" }} />
                                        <col style={{ width: "20%" }} />
                                      </colgroup>
                                      <thead>
                                        <tr>
                                          <th>N°</th>
                                          <th>Vencimento</th>
                                          <th>Valor</th>
                                          <th>Status</th>
                                          <th>Pago em</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {parcelas.map(p => (
                                          <tr key={p.numeroParcela}>
                                            <td>{p.numeroParcela}</td>
                                            <td>{p.dataVencimento}</td>
                                            <td>{p.valor.toLocaleString("pt-BR", {
                                              style: "currency",
                                              currency: "BRL"
                                            })}</td>
                                            <td>{p.statusPagamento}</td>
                                            <td>{p.dataPagamento}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}