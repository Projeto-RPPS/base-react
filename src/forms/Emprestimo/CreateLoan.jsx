// src/pages/CreateLoan.jsx
import React, { useState } from "react";
import Header from "../../components/Header";
import NavigationRoutes from "../../components/NavigationRoutes";
import Footer from "../../components/Footer";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function CreateLoan() {
  const [cpf, setCpf] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [quantidadeParcelas, setQuantidadeParcelas] = useState("");

  const resetForm = () => {
    setCpf("");
    setValorTotal("");
    setQuantidadeParcelas("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      cpfContribuinte: String(cpf).trim(),
      valorTotal: Number(valorTotal) || 0,
      quantidadeParcelas: parseInt(quantidadeParcelas, 10) || 0,
    };
    console.log(JSON.stringify(payload, null, 2));
    // aqui você poderia chamar emprestimoService.criarEmprestimo(payload)
  };

  return (
    <>
      <Header />

      <main id="main-content" className="container-lg my-5">
        <NavigationRoutes />

        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-8 col-lg-6">
            <div className="br-card">

              {/* Cabeçalho do card */}
              <div className="card-header text-center">
                <h2 className="mb-1" style={{ color: "var(--interactive)" }}>
                  Criar Empréstimo
                </h2>
              </div>

              {/* Conteúdo do formulário */}
              <div className="card-content p-4">
                <form onSubmit={handleSubmit}>

                  {/* Seção: Dados do Contribuinte */}
                  <fieldset className="br-fieldset mb-4">
                    <legend>Dados do Contribuinte</legend>
                    <div className="row">
                      <Input
                        id="cpfContribuinte"
                        label="CPF do Contribuinte"
                        placeholder="00000000000"
                        value={cpf}
                        onChange={e => setCpf(e.target.value)}
                        className="col-12"
                      />
                    </div>
                  </fieldset>

                  {/* Seção: Detalhes do Empréstimo */}
                  <fieldset className="br-fieldset mb-4">
                    <legend>Detalhes do Empréstimo</legend>
                    <div className="row">
                      <Input
                        id="valorTotal"
                        label="Valor Total (R$)"
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={valorTotal}
                        onChange={e => setValorTotal(e.target.value)}
                        className="col-12 mb-3"
                      />
                      <Input
                        id="quantidadeParcelas"
                        label="Quantidade de Parcelas"
                        type="number"
                        placeholder="Ex: 12"
                        value={quantidadeParcelas}
                        onChange={e => setQuantidadeParcelas(e.target.value)}
                        className="col-12"
                      />
                    </div>
                  </fieldset>

                  {/* Botões de ação */}
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={resetForm}
                      className="mr-2"
                    >
                      <i className="fas fa-eraser mr-1" aria-hidden="true" />
                      Limpar
                    </Button>
                    <Button variant="primary" type="submit">
                      <i className="fas fa-check mr-1" aria-hidden="true" />
                      Solicitar Empréstimo
                    </Button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}