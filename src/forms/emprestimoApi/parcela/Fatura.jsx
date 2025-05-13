// src/pages/Fatura.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../components/global/Button";
import Message from "../../../components/global/Message";
import emprestimoService from "../../../service/emprestimo/emprestimoService";

export default function Fatura() {
  const { idEmprestimo } = useParams();
  const navigate = useNavigate();

  const [parcela, setParcela] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState("pagar");
  const [anticipateCount, setAnticipateCount] = useState(1);

  // Busca próxima parcela (ou marca parcela=null)
  const fetchProxima = async () => {
    setLoading(true);
    try {
      const resp = await emprestimoService.proximaPendente(idEmprestimo);
      if (
        resp.status === 204 ||
        !resp.data ||
        typeof resp.data.numeroParcela === "undefined"
      ) {
        setParcela(null);
      } else {
        const data = resp.data;
        setParcela({
          ...data,
          dataVencimento: new Date(data.dataVencimento).toLocaleDateString("pt-BR"),
          valor: data.valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        });
      }
      setErrorMsg("");
    } catch (err) {
      if (err.response?.status === 404) {
        setParcela(null);
      } else {
        setErrorMsg("Erro ao buscar parcela. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProxima();
  }, [idEmprestimo]);

  const handlePagar = async () => {
    if (!parcela) return;
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await emprestimoService.pagarParcela(idEmprestimo);
      setSuccessMsg(`Parcela ${parcela.numeroParcela} paga com sucesso!`);
      await fetchProxima();
    } catch {
      setErrorMsg("Falha ao pagar a parcela. Tente novamente.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAntecipar = async () => {
    if (!parcela) return;
    const count = Math.max(1, parseInt(anticipateCount, 10) || 1);
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await emprestimoService.anteciparParcelas(idEmprestimo, count);
      setSuccessMsg(`Antecipadas ${count} parcela(s) com sucesso!`);
      await fetchProxima();
    } catch {
      setErrorMsg("Falha ao antecipar parcela(s). Tente novamente.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main id="main-content" className="container-lg my-5">
      <div className="row justify-content-center">
        <div className="col-sm-12 col-md-8 col-lg-6">
          <div className="br-card">
            <div className="card-header text-center">
              <h2>Fatura do Empréstimo</h2>
            </div>
            <div className="card-content p-4">
              
              {/* Tabs GOV.BR */}
              <div className="br-tab" data-counter="false">
                <nav className="tab-nav">
                  <ul>
                    <li className={`tab-item ${activeTab === "pagar" ? "is-active" : ""}`}>
                      <button type="button" onClick={() => setActiveTab("pagar")}>
                        <span className="name">Pagar</span>
                      </button>
                    </li>
                    <li className={`tab-item ${activeTab === "antecipar" ? "is-active" : ""}`}>
                      <button type="button" onClick={() => setActiveTab("antecipar")}>
                        <span className="name">Antecipar</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>

              {loading ? (
                <p className="text-center my-4">Carregando dados da parcela…</p>
              ) : (
                <>
                  {/* <<<<<<<<<<<< MENSAGENS GLOBAIS >>>>>>>>>> */}
                  {successMsg && (
                    <Message
                      type="success"
                      title="Sucesso. "
                      className="mb-4"
                      onClose={() => setSuccessMsg("")}
                    >
                      {successMsg}
                    </Message>
                  )}
                  {errorMsg && (
                    <Message
                      type="danger"
                      title="Erro. "
                      className="mb-4"
                      onClose={() => setErrorMsg("")}
                    >
                      {errorMsg}
                    </Message>
                  )}

                  {/* Sem parcelas pendentes */}
                  {!parcela ? (
                    <>
                      <p className="text-center text-down-01 my-4">
                        Não há parcelas pendentes para este empréstimo.
                      </p>
                      <div className="d-flex justify-content-center mb-4">
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                          Voltar
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Detalhes da parcela */}
                      <div className="br-row gutter mb-4">
                        <div className="br-col-xs-12 mb-2">
                          <strong>Parcela:</strong> {parcela.numeroParcela}
                        </div>
                        <div className="br-col-xs-12 mb-2">
                          <strong>Vencimento:</strong> {parcela.dataVencimento}
                        </div>
                        <div className="br-col-xs-12 mb-2">
                          <strong>Valor:</strong> {parcela.valor}
                        </div>
                      </div>

                      {/* Painel PAGAR */}
                      {activeTab === "pagar" && (
                        <div className="d-flex justify-content-between mb-3">
                          <Button variant="secondary" onClick={() => navigate(-1)}>
                            Voltar
                          </Button>
                          <Button
                            variant="primary"
                            disabled={actionLoading}
                            onClick={handlePagar}
                          >
                            {actionLoading ? "…" : "Pagar"}
                          </Button>
                        </div>
                      )}

                      {/* Painel ANTECIPAR */}
                      {activeTab === "antecipar" && (
                        <>
                          <div className="br-input mb-4">
                            <label htmlFor="anticipateCount">N° parcelas</label>
                            <input
                              id="anticipateCount"
                              type="number"
                              min="1"
                              className="w-100"
                              value={anticipateCount}
                              onChange={e => setAnticipateCount(e.target.value)}
                              disabled={actionLoading}
                            />
                          </div>
                          <div className="d-flex justify-content-between mb-3">
                            <Button variant="secondary" onClick={() => navigate(-1)}>
                              Voltar
                            </Button>
                            <Button
                              variant="primary"
                              disabled={actionLoading}
                              onClick={handleAntecipar}
                            >
                              {actionLoading ? "…" : "Antecipar"}
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}