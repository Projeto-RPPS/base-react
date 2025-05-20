import { useEffect, useState } from "react";
import beneficioService from "../../../service/beneficio/beneficioService";
import ListaBeneficios from "../../../components/beneficioComponent/ListaBeneficios";

export default function BeneficiosAtivosPage() {
  const [beneficios, setBeneficios] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await beneficioService.listarBeneficios();
        const ativos = data.filter((b) => b.ativo); 
        setBeneficios(ativos);
      } catch (error) {
        console.error("Erro ao carregar benefícios:", error);
      }
    };
    carregar();
  }, []);

  const handleDesativar = async (id) => {
    try {
      await beneficioService.desativarBeneficio(id);
      const atualizados = await beneficioService.listarBeneficios();
      setBeneficios(atualizados.filter((b) => b.ativo));
    } catch (error) {
      console.error("Erro ao desativar benefício:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Editar Benefícios Ativos</h1>
      <ListaBeneficios 
        beneficios={beneficios} 
        onEditar={true} 
        onExcluir={handleDesativar} // ✅ ISSO AQUI!
      />
    </div>
  );
}