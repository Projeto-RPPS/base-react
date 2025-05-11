import React from "react";
import SecondaryButton from "../../components/global/SecundaryButton";

const ListaBeneficios = ({ beneficios, onEditar, onExcluir }) => {
  return (
    <div className="br-card mt-4">
      <div className="card-header">
        <h2 className="text-center">Benefícios Ativos</h2>
      </div>
      <div className="card-content p-4">
        {beneficios.length > 0 ? (
          <ul className="list-group">
            {beneficios.map((beneficio) => (
              <li key={beneficio.idBeneficio} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{beneficio.tipo}</strong>: {beneficio.descricao} 
                  <br />
                  <span className="text-muted">Mínimo: {beneficio.tempoMinimoMeses} meses - Percentual: {beneficio.percentualBaseMedioContribuicoes}%</span>
                </div>
                <div className="d-flex gap-2">
                  {onEditar && (
                    <SecondaryButton 
                      label="Editar" 
                      onClick={() => onEditar(beneficio)}
                    />
                  )}
                  {onExcluir && (
                    <SecondaryButton 
                      label="Desativar" 
                      onClick={() => onExcluir(beneficio.idBeneficio)}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Nenhum benefício ativo encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default ListaBeneficios;