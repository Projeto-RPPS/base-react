// src/pages/SimulateLoan.jsx
import React, { useState } from "react";
import Header from "../../components/Header";
import NavigationRoutes from "../../components/NavigationRoutes";
import Footer from "../../components/Footer";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function SimulateLoan() {
  const [cpf, setCpf] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [quantidadeParcelas, setQuantidadeParcelas] = useState("");

  // Reseta os campos do formulário
  const resetForm = () => {
    setCpf("");
    setValorTotal("");
    setQuantidadeParcelas("");
  };

  // Quando o usuário clicar em "Simular Empréstimo"
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      cpfContribuinte: String(cpf).trim(),
      valorTotal: Number(valorTotal) || 0,
      quantidadeParcelas: parseInt(quantidadeParcelas, 10) || 0,
    };

    // Exibe no console de forma formatada
    console.log(JSON.stringify(payload, null, 2));

    // A chamada real à API ficaria aqui:
    // emprestimoService.simularEmprestimo(payload)
    //   .then(res => { … })
    //   .catch(err => { … });
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
                <h2 className="mb-0" style={{ color: "var(--interactive)" }}>
                  Simular Empréstimo
                </h2>
              </div>

              {/* Conteúdo do card */}
              <div className="card-content p-4">
                <form onSubmit={handleSubmit} className="d-flex flex-column">

                  {/* CPF */}
                  <Input
                    id="cpfContribuinte"
                    label="CPF do Contribuinte"
                    placeholder="00000000000"
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                    className="mb-4"
                  />

                  {/* Valor Total */}
                  <Input
                    id="valorTotal"
                    label="Valor Total (R$)"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={valorTotal}
                    onChange={e => setValorTotal(e.target.value)}
                    className="mb-4"
                  />

                  {/* Quantidade de Parcelas */}
                  <Input
                    id="quantidadeParcelas"
                    label="Quantidade de Parcelas"
                    type="number"
                    placeholder="Ex: 12"
                    value={quantidadeParcelas}
                    onChange={e => setQuantidadeParcelas(e.target.value)}
                    className="mb-4"
                  />

                  {/* Botões */}
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={resetForm}
                      className="mr-2"
                    >
                      <i className="fas fa-eraser mr-1" />
                      Limpar
                    </Button>
                    <Button variant="primary" type="submit">
                      <i className="fas fa-calculator mr-1" />
                      Simular Empréstimo
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