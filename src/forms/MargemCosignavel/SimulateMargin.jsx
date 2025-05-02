// src/forms/Margem/SimulateMargin.jsx
import React, { useState } from "react";
import Header            from "../../components/Header";
import NavigationRoutes  from "../../components/NavigationRoutes";
import Footer            from "../../components/Footer";
import Button            from "../../components/Button";
import emprestimoService from "../../service/emprestimoService";

export default function SimulateMargin() {
  const [cpf, setCpf]       = useState("");
  const [margem, setMargem] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cpf.trim()) return;
    setLoading(true);
    try {
      const res = await emprestimoService.consultarMargem(cpf.trim());
      setMargem(res.data);
    } catch {
      setMargem(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main id="main-content" className="container-lg my-5">
        <NavigationRoutes />

        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-8 col-lg-6">
            <div className="br-card">

              <div className="card-header text-center">
                <h2 className="mb-0" style={{ color: "var(--interactive)" }}>
                  Simular Margem Consignável
                </h2>
              </div>

              <div className="card-content p-4">
                {/* Formulário de CPF */}
                <form onSubmit={handleSubmit} className="row mb-4 align-items-end">
                  <div className="col-8">
                    <div className="br-input mb-0">
                      <label htmlFor="cpfContribuinte">CPF do Contribuinte</label>
                      <input
                        id="cpfContribuinte"
                        type="text"
                        placeholder="00000000000"
                        className="w-100"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="col-4 d-flex justify-content-end">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading || !cpf.trim()}
                      className="block"
                    >
                      {loading ? "Carregando…" : "Buscar"}
                    </Button>
                  </div>
                </form>

                {/* Se já consultou, mostra cards */}
                {margem && (
                  <div className="br-row gutter">
                    {[
                      {
                        label: "Valor do Benefício (R$)",
                        value: margem.valorBeneficio,
                        icon: "fas fa-hand-holding-usd",
                      },
                      {
                        label: "Margem Total (R$)",
                        value: margem.margemTotal,
                        icon: "fas fa-layer-group",
                      },
                      {
                        label: "Valor em Uso (R$)",
                        value: margem.valorEmUso,
                        icon: "fas fa-dollar-sign",
                      },
                      {
                        label: "Margem Disponível (R$)",
                        value: margem.margemDisponivel,
                        icon: "fas fa-wallet",
                      },
                    ].map((card) => (
                      <div key={card.label} className="br-col-xs-6 md-3 mb-4">
                        <div className="br-info-card">
                          <div className="info-card__content">
                            <div className="info-card__value">
                              {card.value.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </div>
                            <div className="info-card__label">{card.label}</div>
                          </div>
                          <div className="info-card__icon">
                            <i className={card.icon} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Caso ainda não tenha consultado e não esteja carregando */}
                {!margem && !loading && (
                  <p className="text-center text-down-01">
                    Informe um CPF e clique em Buscar para ver sua margem disponível.
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