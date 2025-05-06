import React, { useEffect, useState } from "react";
import FormularioContribuinte from "../forms/FormularioContribuinte";
import contribuinteService from "../service/contribuinteService";

export default function ContribuintePage() {
  const [contribuintes, setContribuintes] = useState([]);

  useEffect(() => {
    contribuinteService.listarContribuintes()
      .then(response => {
        setContribuintes(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar contribuintes:", error);
      });
  }, []);

  return (
    <>
      <h1>Contribuintes</h1>
      <p>Parágrafo de exemplo <a href="">link de exemplo</a>.</p>

      <h5>Lista de Contribuintes:</h5>
      <ul>
        {contribuintes.map((c) => (
          <li key={c.idContribuinte}>{c.nomeCivil}</li>
        ))}
      </ul>

      <FormularioContribuinte />
    </>
  );
}


