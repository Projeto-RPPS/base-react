import React, { useEffect, useState } from 'react';
import { listarBeneficios, criarBeneficio } from "../service/beneficiosService"
import FormularioBeneficio from '../forms/FormularioBeneficio';
import ListaBeneficios from '../components/ListaBeneficios';

export default function BeneficiosPage() {
  const [beneficios, setBeneficios] = useState([]);

  const carregarBeneficios = async () => {
    try {
      const res = await listarBeneficios();
      setBeneficios(res.data);
    } catch (error) {
      console.error('Erro ao carregar benefícios:', error);
    }
  };

  useEffect(() => {
    carregarBeneficios();
  }, []);

  const handleSalvar = async (dados) => {
    try {
      await criarBeneficio(dados);
      carregarBeneficios();
    } catch (error) {
      console.error('Erro ao criar benefício:', error);
    }
  };

  return (
    <>
      <h1>Cadastro de Benefício</h1>
      <FormularioBeneficio onSalvar={handleSalvar} />

      <h2 className="mt-4">Benefícios Ativos</h2>
      <ListaBeneficios beneficios={beneficios} />
    </>
  );
}

