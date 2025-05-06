import React, { useState } from 'react';

export default function FormularioBeneficio({ onSalvar }) {
  const [form, setForm] = useState({
    tipo: '',
    descricao: '',
    tempoMinimoMeses: '',
    percentualBaseMedioContribuicoes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(form);
    // Limpa o formulário após salvar
    setForm({
      tipo: '',
      descricao: '',
      tempoMinimoMeses: '',
      percentualBaseMedioContribuicoes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label>Tipo:</label>
        <input
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          className="br-input"
          required
        />
      </div>

      <div className="mb-3">
        <label>Descrição:</label>
        <input
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          className="br-input"
          required
        />
      </div>

      <div className="mb-3">
        <label>Tempo mínimo (meses):</label>
        <input
          type="number"
          name="tempoMinimoMeses"
          value={form.tempoMinimoMeses}
          onChange={handleChange}
          className="br-input"
          required
        />
      </div>

      <div className="mb-3">
        <label>Percentual médio de contribuição (%):</label>
        <input
          type="number"
          name="percentualBaseMedioContribuicoes"
          value={form.percentualBaseMedioContribuicoes}
          onChange={handleChange}
          className="br-input"
          required
        />
      </div>

      <button className="br-button primary block mb-3" type="submit">
        Cadastrar Benefício
      </button>
    </form>
  );
}

