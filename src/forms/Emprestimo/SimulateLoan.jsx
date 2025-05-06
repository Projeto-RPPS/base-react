// src/pages/SimulateLoan.jsx
import React, { useState, useMemo } from "react";
import Header from "../../components/Header";
import NavigationRoutes from "../../components/NavigationRoutes";
import Footer from "../../components/Footer";
import Input from "../../components/Input";
import Button from "../../components/Button";
import emprestimoService from "../../service/emprestimoService";

export default function SimulateLoan() {
  const [cpf, setCpf] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [quantidadeParcelas, setQuantidadeParcelas] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");     // erros vermelhos
  const [warningMsg, setWarningMsg] = useState(""); // “sem benefício”
  const [resultado, setResultado] = useState(null);

  // máscara e validações de front
  const rawCpf = useMemo(() => cpf.replace(/\D/g, ""), [cpf]);
  const numericValor = useMemo(
    () => parseFloat(valorTotal.replace(",", ".")),
    [valorTotal]
  );
  const numericParcelas = useMemo(
    () => parseInt(quantidadeParcelas, 10),
    [quantidadeParcelas]
  );

  const isCpfValid = rawCpf.length === 11;
  const isValorValid = !isNaN(numericValor) && numericValor > 0;
  const isParcelasValid = !isNaN(numericParcelas) && numericParcelas > 0;
  const isFormValid = isCpfValid && isValorValid && isParcelasValid;

  function handleCpfChange(e) {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    setCpf(v);
  }

  function handleValorChange(e) {
    let v = e.target.value.replace(/[^0-9,\.]/g, "");
    const parts = v.split(/[,.]/);
    if (parts.length > 2) v = parts.shift() + "." + parts.join("");
    setValorTotal(v);
  }

  function handleParcelasChange(e) {
    setQuantidadeParcelas(e.target.value.replace(/\D/g, ""));
  }

  function resetForm() {
    setCpf("");
    setValorTotal("");
    setQuantidadeParcelas("");
    setErrorMsg("");
    setWarningMsg("");
    setResultado(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setErrorMsg("");
    setWarningMsg("");
    setResultado(null);

    try {
      const res = await emprestimoService.simularEmprestimo({
        cpfContribuinte: rawCpf,
        valorTotal: numericValor,
        quantidadeParcelas: numericParcelas,
      });
      const data = res.data;

      // “sem benefício” vindo do back → warning
      if (
        data.status === 200 &&
        Array.isArray(data.erros) &&
        data.erros.length === 0 &&
        typeof data.mensagem === "string" &&
        data.mensagem.includes("Benefício não foi concedido")
      ) {
        setWarningMsg("Benefício não foi concedido para este CPF.");
      } else {
        // normaliza margens
        const margemDisponivel = data.margemDisponivel ?? data.margenDisponivel;
        setResultado({
          poderiaSerAprovado: data.poderiaSerAprovado,
          margemDisponivel,
          margemNecessaria: data.margemNecessaria,
        });
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setErrorMsg("Não encontramos simulação para esses dados.");
      } else if (status === 422) {
        setErrorMsg("Dados inválidos. Verifique os campos.");
      } else {
        setErrorMsg("Erro ao simular empréstimo. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main id="main-content" className="container-lg my-5">
        <NavigationRoutes />
        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-8 col-lg-6">
            <div className="br-card">
              <div className="card-header text-center">
                <h2 style={{ color: "var(--interactive)" }}>
                  Simular Empréstimo
                </h2>
              </div>
              <div className="card-content p-4">
                <form onSubmit={handleSubmit} noValidate>
                  <fieldset className="br-fieldset mb-4">
                    <legend>Dados da Simulação</legend>
                    <Input
                      id="cpfContribuinte"
                      label="CPF"
                      type="text"
                      placeholder="000.000.000-00"
                      inputMode="numeric"
                      value={cpf}
                      onChange={handleCpfChange}
                      className="col-12 mb-3"
                    />
                    <Input
                      id="valorTotal"
                      label="Valor Total (R$)"
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={valorTotal}
                      onChange={handleValorChange}
                      className="col-12 mb-3"
                    />
                    <Input
                      id="quantidadeParcelas"
                      label="N° Parcelas"
                      type="text"
                      inputMode="numeric"
                      placeholder="Ex: 12"
                      value={quantidadeParcelas}
                      onChange={handleParcelasChange}
                      className="col-12"
                    />
                  </fieldset>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={resetForm}
                      disabled={loading}
                      className="mr-2"
                    >
                      <i className="fas fa-eraser mr-1" />
                      Limpar
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={!isFormValid || loading}
                    >
                      {loading ? "Simulando…" : "Simular Empréstimo"}
                    </Button>
                  </div>
                </form>

                {/* sem benefício → WARNING */}
                {warningMsg && (
                  <div className="br-message warning mt-4">
                    <div className="icon">
                      <i className="fas fa-exclamation-triangle fa-lg" />
                    </div>
                    <div className="content" role="alert" aria-label={warningMsg}>
                      <span className="message-title">Atenção. </span>
                      <span className="message-body"> {warningMsg}</span>
                    </div>
                    <div className="close">
                      <button
                        className="br-button circle small"
                        type="button"
                        aria-label="Fechar alerta"
                        onClick={() => setWarningMsg("")}
                      >
                        <i className="fas fa-times" />
                      </button>
                    </div>
                  </div>
                )}

                {/* erro genérico → DANGER */}
                {errorMsg && (
                  <div className="br-message danger mt-4">
                    <div className="icon">
                      <i className="fas fa-times-circle fa-lg" />
                    </div>
                    <div className="content" role="alert" aria-label={errorMsg}>
                      <span className="message-title">Erro. </span>
                      <span className="message-body">{errorMsg}</span>
                    </div>
                    <div className="close">
                      <button
                        className="br-button circle small"
                        type="button"
                        aria-label="Fechar alerta"
                        onClick={() => setErrorMsg("")}
                      >
                        <i className="fas fa-times" />
                      </button>
                    </div>
                  </div>
                )}

                {/* cards */}
                {resultado && (
                  <>
                    <div className="br-row gutter mt-4">
                      <div className="br-col-xs-12 md-6 mb-4">
                        <div className="br-info-card">
                          <div className="info-card__icon">
                            <i className="fas fa-wallet" />
                          </div>
                          <div className="info-card__content">
                            <div className="info-card__value">
                              {resultado.margemDisponivel.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </div>
                            <div className="info-card__label">
                              Margem Disponível
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="br-col-xs-12 md-6 mb-4">
                        <div className="br-info-card">
                          <div className="info-card__icon">
                            <i className="fas fa-calculator" />
                          </div>
                          <div className="info-card__content">
                            <div className="info-card__value">
                              {resultado.margemNecessaria.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </div>
                            <div className="info-card__label">
                              Margem Necessária
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* simulação aprovada / reprovada */}
                    {resultado.poderiaSerAprovado ? (
                      <div className="br-message success">
                        <div className="icon">
                          <i className="fas fa-check-circle fa-lg" />
                        </div>
                        <div
                          className="content"
                          role="alert"
                          aria-label="Simulação aprovada"
                        >
                          <span className="message-title">Simulação Aprovada. </span>
                          <span className="message-body">
                            Você tem margem suficiente para este empréstimo.
                          </span>
                        </div>
                        <div className="close">
                          <button
                            className="br-button circle small"
                            type="button"
                            aria-label="Fechar alerta"
                            onClick={resetForm}
                          >
                            <i className="fas fa-times" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="br-message warning">
                        <div className="icon">
                          <i className="fas fa-exclamation-triangle fa-lg" />
                        </div>
                        <div
                          className="content"
                          role="alert"
                          aria-label="Simulação recusada"
                        >
                          <span className="message-title">Simulação Reprovada. </span>
                          <span className="message-body">
                            Margem necessária excede a disponível.
                          </span>
                        </div>
                        <div className="close">
                          <button
                            className="br-button circle small"
                            type="button"
                            aria-label="Fechar alerta"
                            onClick={resetForm}
                          >
                            <i className="fas fa-times" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
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
