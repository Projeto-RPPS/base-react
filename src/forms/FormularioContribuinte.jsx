import React, { useState } from "react";
import Input from "../components/Input"; // Componente customizado para os campos de entrada

const FormularioContribuinte = () => {
  const [formData, setFormData] = useState({
    nomeCivil: "",
    nomeSocial: "",
    cpf: "",
    listaEmails: [{ email: "" }],
    listaEnderecos: [{ cep: "", numeroMoradia: "", estado: "" }],
    listaTelefones: [{ numeroTelefone: "", tipoTelefone: "" }],
    listaParentes: [{ nomeParente: "", cpfParente: "", idTipoParentesco: "" }],
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Para adicionar novos campos de email, endereço, telefone ou parente
  const handleAddField = (field) => {
    // Inicializamos os campos vazios com base no tipo de lista
    let emptyObject = {};
    
    switch(field) {
      case "listaEmails":
        emptyObject = { email: "" };
        break;
      case "listaEnderecos":
        emptyObject = { cep: "", numeroMoradia: "", estado: "" };
        break;
      case "listaTelefones":
        emptyObject = { numeroTelefone: "", tipoTelefone: "" };
        break;
      case "listaParentes":
        emptyObject = { nomeParente: "", cpfParente: "", idTipoParentesco: "" };
        break;
      default:
        break;
    }

    setFormData({
      ...formData,
      [field]: [...formData[field], emptyObject],
    });
  };

  // Para alterar um campo específico dentro das listas (emails, endereços, telefones ou parentes)
  const handleListChange = (e, field, index) => {
    const { id, value } = e.target;
    const updatedList = [...formData[field]];
    updatedList[index] = {
      ...updatedList[index],
      [id]: value,
    };

    setFormData({
      ...formData,
      [field]: updatedList,
    });
  };

  const handleRemoveField = (field, index) => {
    // Não permitir remover o último item
    if (formData[field].length <= 1) return;
    
    const updatedList = [...formData[field]];
    updatedList.splice(index, 1);
    
    setFormData({
      ...formData,
      [field]: updatedList,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Estrutura final do JSON a ser enviado
    const jsonFinal = {
      contribuinte: {
        nomeCivil: formData.nomeCivil,
        nomeSocial: formData.nomeSocial,
        cpf: formData.cpf,
        ativo: true, // ou conforme o estado do componente
        idCategoria: 9007199254740991, // valor fixo ou variável, conforme necessidade
      },
      listaEmails: formData.listaEmails.map((email) => ({
        idContribuinte: 9007199254740991,
        email: email.email,
      })),
      listaEnderecos: formData.listaEnderecos.map((endereco) => ({
        idContribuinte: 9007199254740991,
        cep: endereco.cep,
        numeroMoradia: endereco.numeroMoradia,
        estado: endereco.estado,
      })),
      listaTelefones: formData.listaTelefones.map((telefone) => ({
        idContribuinte: 9007199254740991,
        numeroTelefone: telefone.numeroTelefone,
        tipoTelefone: telefone.tipoTelefone,
      })),
      listaParentes: formData.listaParentes.map((parente) => ({
        parenteDTO: {
          nomeParente: parente.nomeParente,
          cpfParente: parente.cpfParente,
        },
        idTipoParentesco: parente.idTipoParentesco,
      })),
    };

    console.log(JSON.stringify(jsonFinal, null, 2));
    // Aqui você pode enviar os dados para a API
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-sm">
          <fieldset>
            <legend>Dados do Contribuinte</legend>
            <div className="row">
              <Input
                id="nomeCivil"
                label="Nome Civil"
                value={formData.nomeCivil}
                onChange={handleChange}
              />
              <Input
                id="nomeSocial"
                label="Nome Social"
                value={formData.nomeSocial}
                onChange={handleChange}
                placeholder="Opcional"
              />
              <Input
                id="cpf"
                label="CPF"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="Apenas números"
              />
            </div>
          </fieldset>
        </div>

        {/* Adicionando seções de Email, Endereço, Telefone e Parente */}
        <div className="col-sm">
          <fieldset>
            <legend>Emails</legend>
            {formData.listaEmails.map((email, index) => (
              <div key={index} className="row align-items-end">
                <div className="col">
                  <Input
                    id="email"
                    label={`Email ${index + 1}`}
                    value={email.email || ""}
                    onChange={(e) => handleListChange(e, "listaEmails", index)}
                  />
                </div>
                {formData.listaEmails.length > 1 && (
                  <div className="col-auto mb-3">
                    <button 
                      type="button" 
                      className="br-button secondary small" 
                      onClick={() => handleRemoveField("listaEmails", index)}
                    >
                      Remover
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="br-button secondary small" 
              onClick={() => handleAddField("listaEmails")}
            >
              Adicionar Email
            </button>
          </fieldset>

          <fieldset>
            <legend>Endereços</legend>
            {formData.listaEnderecos.map((endereco, index) => (
              <div key={index}>
                <div className="row">
                  <div className="col">
                    <Input
                      id="cep"
                      label={`CEP ${index + 1}`}
                      value={endereco.cep || ""}
                      onChange={(e) => handleListChange(e, "listaEnderecos", index)}
                    />
                  </div>
                  <div className="col">
                    <Input
                      id="numeroMoradia"
                      label={`Número ${index + 1}`}
                      value={endereco.numeroMoradia || ""}
                      onChange={(e) => handleListChange(e, "listaEnderecos", index)}
                    />
                  </div>
                  <div className="col">
                    <Input
                      id="estado"
                      label={`Estado ${index + 1}`}
                      value={endereco.estado || ""}
                      onChange={(e) => handleListChange(e, "listaEnderecos", index)}
                    />
                  </div>
                </div>
                {formData.listaEnderecos.length > 1 && (
                  <div className="row">
                    <div className="col-auto mb-3">
                      <button 
                        type="button" 
                        className="br-button secondary small" 
                        onClick={() => handleRemoveField("listaEnderecos", index)}
                      >
                        Remover Endereço
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="br-button secondary small" 
              onClick={() => handleAddField("listaEnderecos")}
            >
              Adicionar Endereço
            </button>
          </fieldset>

          <fieldset>
            <legend>Telefones</legend>
            {formData.listaTelefones.map((telefone, index) => (
              <div key={index}>
                <div className="row">
                  <div className="col">
                    <Input
                      id="numeroTelefone"
                      label={`Telefone ${index + 1}`}
                      value={telefone.numeroTelefone || ""}
                      onChange={(e) => handleListChange(e, "listaTelefones", index)}
                    />
                  </div>
                  <div className="col">
                    <Input
                      id="tipoTelefone"
                      label={`Tipo ${index + 1}`}
                      value={telefone.tipoTelefone || ""}
                      onChange={(e) => handleListChange(e, "listaTelefones", index)}
                    />
                  </div>
                </div>
                {formData.listaTelefones.length > 1 && (
                  <div className="row">
                    <div className="col-auto mb-3">
                      <button 
                        type="button" 
                        className="br-button secondary small" 
                        onClick={() => handleRemoveField("listaTelefones", index)}
                      >
                        Remover Telefone
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="br-button secondary small" 
              onClick={() => handleAddField("listaTelefones")}
            >
              Adicionar Telefone
            </button>
          </fieldset>

          <fieldset>
            <legend>Parentes</legend>
            {formData.listaParentes.map((parente, index) => (
              <div key={index}>
                <div className="row">
                  <div className="col">
                    <Input
                      id="nomeParente"
                      label={`Nome do Parente ${index + 1}`}
                      value={parente.nomeParente || ""}
                      onChange={(e) => handleListChange(e, "listaParentes", index)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <Input
                      id="cpfParente"
                      label={`CPF do Parente ${index + 1}`}
                      value={parente.cpfParente || ""}
                      onChange={(e) => handleListChange(e, "listaParentes", index)}
                    />
                  </div>
                  <div className="col">
                    <Input
                      id="idTipoParentesco"
                      label={`Tipo de Parentesco ${index + 1}`}
                      value={parente.idTipoParentesco || ""}
                      onChange={(e) => handleListChange(e, "listaParentes", index)}
                    />
                  </div>
                </div>
                {formData.listaParentes.length > 1 && (
                  <div className="row">
                    <div className="col-auto mb-3">
                      <button 
                        type="button" 
                        className="br-button secondary small" 
                        onClick={() => handleRemoveField("listaParentes", index)}
                      >
                        Remover Parente
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="br-button secondary small" 
              onClick={() => handleAddField("listaParentes")}
            >
              Adicionar Parente
            </button>
          </fieldset>
        </div>
      </div>

      <button type="submit" className="br-button primary mt-3">
        Cadastrar Contribuinte
      </button>
    </form>
  );
};

export default FormularioContribuinte;