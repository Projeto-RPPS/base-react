import React, { useEffect, useState } from 'react';
import { listarBeneficios, criarBeneficio, atualizarBeneficio, desativarBeneficio } from "../service/beneficio/beneficioService";
import FormularioBeneficio from '../forms/beneficioApi/FormularioBeneficio' ;
import ListaBeneficios from '../components/beneficioComponent/ListaBeneficios';
import Header from "../components/global/Header";
import Footer from "../components/global/Footer";
import NavigationRoutes from "../components/global/NavigationRoutes";
import SecondaryButton from "../components/global/SecundaryButton";

export default function BeneficiosPage() {
    const [beneficios, setBeneficios] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [showEdit, setShowEdit] = useState(false);
  
    const carregarBeneficios = async () => {
      try {
        const data = await listarBeneficios();
        setBeneficios(data);
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
        handleRefreshPage();
      } catch (error) {
        console.error('Erro ao criar benefício:', error);
      }
    };
  
    const handleEditar = async (beneficio) => {
      const novoTipo = prompt("Digite o novo tipo:");
      const novoBeneficio = { ...beneficio, tipo: novoTipo };
      try {
        await atualizarBeneficio(beneficio.idBeneficio, novoBeneficio);
        carregarBeneficios();
      } catch (error) {
        console.error('Erro ao atualizar benefício:', error);
      }
    };
  
    const handleDesativar = async (id) => {
      try {
        await desativarBeneficio(id);
        carregarBeneficios();
      } catch (error) {
        console.error('Erro ao desativar benefício:', error);
      }
    };
  
    const handleCadastrarClick = () => {
      setShowForm(true);
      setShowButton(false);
      setShowEdit(false);
    };
  
    const handleEditarClick = () => {
      setShowForm(false);
      setShowButton(false);
      setShowEdit(true);
    };
  
    const handleRefreshPage = () => {
      setShowForm(false);
      setShowEdit(false);
      setShowButton(true);
      carregarBeneficios();
    };
  
    return (
      <div className="container mt-4">
        <NavigationRoutes />
        <h1>Benefícios</h1>
  
        {showButton && (
          <div className="col mb-3">
            <SecondaryButton label={"Cadastrar novo Benefício"} onClick={handleCadastrarClick} />
            <SecondaryButton label={"Editar Benefícios"} onClick={handleEditarClick} />
          </div>
        )}
  
        {showForm && (
          <>
            <h2>Cadastrar Benefício</h2>
            <FormularioBeneficio onSalvar={handleSalvar} />
            <br />
            <SecondaryButton label={"Voltar ao menu de Benefícios"} onClick={handleRefreshPage} />
          </>
        )}
  
        {showEdit && (
          <>
            <h2>Editar Benefícios Ativos</h2>
            <ListaBeneficios 
              beneficios={beneficios} 
              onEditar={handleEditar} 
              onExcluir={handleDesativar} 
            />
            <br />
            <SecondaryButton label={"Voltar ao menu de Benefícios"} onClick={handleRefreshPage} />
          </>
        )}
      </div>
    );
  }