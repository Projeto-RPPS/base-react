import React, { useEffect, useState } from "react";
import filiacaoService from "../../../service/contribuinte/filiacaoService";
import Table from "../../global/Table";

export default function TableArvoreGenealogica({ cpf, exibir }) {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (exibir && cpf) {
      setCarregando(true);
      setErro("");

      filiacaoService.gerarArvore(cpf)
        .then((res) => {
          setDados(res.data);
          console.log(res.data)
        })
        .catch((err) => {
          console.error("Erro ao buscar árvore genealógica:", err);
          setErro("Erro ao carregar os dados.");
        })
        .finally(() => {
          setCarregando(false);
        });
    }
  }, [exibir, cpf]);

  const colunas = [
    { header: "Nome do Parente", accessor: "nomeParente" },
    { header: "Parentesco", accessor: "descricaoParentesco" }
  ];

  return (
    <div className="mt-3">
      {carregando && <div className="br-loading">Carregando...</div>}
      {erro && <div className="br-message warning">{erro}</div>}
      {!carregando && !erro && exibir && (
        <Table
          title="Árvore Genealógica"
          columns={colunas}
          data={dados}
          density="medium"
        />
      )}
    </div>
  );
}