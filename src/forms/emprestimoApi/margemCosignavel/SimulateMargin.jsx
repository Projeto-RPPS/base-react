// src/forms/Margem/SimulateMargin.jsx
import React, { useState } from "react";
import Header from "../../../components/global/Header";
import NavigationRoutes from "../../../components/global/NavigationRoutes";
import Footer from "../../../components/global/Footer";
import Button from "../../../components/global/Button";
import emprestimoService from "../../../service/emprestimo/emprestimoService";

export default function SimulateMargin() {
  const [cpf, setCpf] = useState("");
  const [margem, setMargem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchedOnce, setFetchedOnce] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Formata e limita a entrada do CPF para 11 dígitos
  function handleCpfChange(e) {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 11);
    let formatted = raw;
    if (raw.length > 9) {
      formatted = raw.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
      );
    } else if (raw.length > 6) {
      formatted = raw.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (raw.length > 3) {
      formatted = raw.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }
    setCpf(formatted);
  }

  // Extrai apenas os dígitos
  const rawCpf = cpf.replace(/\D/g, "");
  const isCpfValid = rawCpf.length === 11;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isCpfValid) return;

    setLoading(true);
    setErrorMsg("");
    setMargem(null);

    try {
      const res = await emprestimoService.consultarMargem(rawCpf);
      const data = res.data;

      // “Sem benefício” vindo do back
      if (
        data.status === 200 &&
        Array.isArray(data.erros) &&
        data.erros.length === 0 &&
        typeof data.mensagem === "string" &&
        data.mensagem.includes("Benefício não foi concedido")
      ) {
        // não faz nada aqui — margem fica null ⇒ cai no warning abaixo
      } else {
        // simulação normal: exibe valores
        setMargem({
          valorBeneficio: data.valorBeneficio,
          margemTotal: data.margemTotal,
          valorEmUso: data.valorEmUso,
          margemDisponivel: data.margemDisponivel,
        });
      }
    } catch (err) {
      const resp = err.response;
      if (resp?.data?.mensagem) {
        setErrorMsg(resp.data.mensagem);
      } else {
        setErrorMsg("Ocorreu um erro inesperado. Tente novamente mais tarde.");
      }
    } finally {
      setFetchedOnce(true);
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main id="main-content" className="container-lg my-5">
        <NavigationRoutes />

        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-8 col-lg-6">
            <div className="br-card">
              <div className="card-header text-center">
                <h2 style={{ color: "var(--interactive)" }}>
                  Simular Margem Consignável
                </h2>
              </div>
              <div className="card-content p-4">
                <form
                  onSubmit={handleSubmit}
                  className="row mb-4 align-items-end"
                  noValidate
                >
                  <div className="col-8">
                    <div className="br-input mb-0">
                      <label htmlFor="cpfContribuinte">
                        CPF do Contribuinte
                      </label>
                      <input
                        id="cpfContribuinte"
                        type="text"
                        inputMode="numeric"
                        placeholder="000.000.000-00"
                        className="w-100"
                        value={cpf}
                        onChange={handleCpfChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="col-4 d-flex justify-content-end">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading || !isCpfValid}
                      className="block"
                    >
                      {loading ? "Carregando…" : "Buscar"}
                    </Button>
                  </div>
                </form>

                {/* Erro de API / validação geral */}
                {errorMsg && (
                  <div className="br-message danger mb-4">
                    <div className="icon">
                      <i
                        className="fas fa-times-circle fa-lg"
                        aria-hidden="true"
                      />
                    </div>
                    <div
                      className="content"
                      role="alert"
                      aria-label={errorMsg}
                    >
                      <span className="message-title">Erro</span>
                      <span className="message-body"> {errorMsg}</span>
                    </div>
                    <div className="close">
                      <button
                        className="br-button circle small"
                        type="button"
                        aria-label="Fechar alerta"
                        onClick={() => setErrorMsg("")}
                      >
                        <i className="fas fa-times" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Cards de resultado (ícone → valor → label) */}
                {fetchedOnce && margem && !errorMsg && (
                  <div className="br-row gutter">
                    {[
                      {
                        label: "Valor do Benefício",
                        value: margem.valorBeneficio,
                        icon: "fas fa-hand-holding-usd",
                      },
                      {
                        label: "Margem Total",
                        value: margem.margemTotal,
                        icon: "fas fa-layer-group",
                      },
                      {
                        label: "Valor em Uso",
                        value: margem.valorEmUso,
                        icon: "fas fa-dollar-sign",
                      },
                      {
                        label: "Margem Disponível",
                        value: margem.margemDisponivel,
                        icon: "fas fa-wallet",
                      },
                    ].map(({ label, value, icon }) => (
                      <div key={label} className="br-col-xs-6 md-3 mb-4">
                        <div className="br-info-card">
                          <div className="info-card__icon">
                            <i className={icon} aria-hidden="true" />
                          </div>
                          <div className="info-card__content">
                            <div className="info-card__value">
                              {value.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </div>
                            <div className="info-card__label">{label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* “Nenhum benefício encontrado” em amarelo */}
                {fetchedOnce &&
                  !loading &&
                  !errorMsg &&
                  margem === null && (
                    <div className="br-message warning mt-4">
                      <div className="icon">
                        <i
                          className="fas fa-exclamation-triangle fa-lg"
                          aria-hidden="true"
                        />
                      </div>
                      <div
                        className="content"
                        role="alert"
                        aria-label="Nenhum benefício encontrado para este CPF."
                      >
                        <span className="message-title">Atenção. </span>
                        <span className="message-body">
                          Benefício não foi concedido para este CPF.
                        </span>
                      </div>
                      <div className="close">
                        <button
                          className="br-button circle small"
                          type="button"
                          aria-label="Fechar alerta"
                          onClick={() => setFetchedOnce(false)}
                        >
                          <i className="fas fa-times" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  )}

                {/* Mensagem inicial */}
                {!fetchedOnce && !errorMsg && (
                  <p className="text-center text-down-01">
                    Informe um CPF e clique em Buscar para ver sua margem
                    disponível.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}