import React from 'react';

export default function ListaBeneficios({ beneficios }) {
  if (!beneficios || beneficios.length === 0) {
    return <p>Nenhum benefício ativo encontrado.</p>;
  }

  return (
    <ul className="br-list">
      {beneficios.map((b) => (
        <li key={b.idBeneficio}>
          <strong>{b.tipo}</strong>: {b.descricao} — {b.tempoMinimoMeses} meses — {b.percentualBaseMedioContribuicoes}%
        </li>
      ))}
    </ul>
  );
}

