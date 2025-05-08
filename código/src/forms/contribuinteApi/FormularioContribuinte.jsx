import React, { useState } from "react";
import Input from "../../components/global/Input";
import SecondaryButton from "../../components/global/SecundaryButton";
import SelectTipoParentesco from "../../components/contribuinteComponent/selects/SelectTipoParentesco";
import SelectCategoria from "../../components/contribuinteComponent/selects/SelectCategoria";
import contribuinteService from "../../service/contribuinte/contribuinteService";
import SelectEstado from "../../components/contribuinteComponent/selects/SelectEstado";
import SelectTipoTelefone from "../../components/contribuinteComponent/selects/SelectTipoTelefone";
import AlertaErro from "../../components/contribuinteComponent/messageComponent/AlertaErro";
import SuccessMessage from "../../components/contribuinteComponent/messageComponent/SuccesMessage";

const FormularioContribuinte = ({formDataInitial}) => {
  const [erro, setErro] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [formData, setFormData] = useState(formDataInitial);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Para adicionar novos campos de email, endereço, telefone ou parente
  const handleAddField = (field) => {
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
        ativo: true,
        idCategoria: Number(formData.idCategoria), // Parse para número
      },
      listaEmails: formData.listaEmails.map((email) => ({
        idContribuinte: Number.MAX_SAFE_INTEGER, // Usando o maior número seguro
        email: email.email,
      })),
      listaEnderecos: formData.listaEnderecos.map((endereco) => ({
        idContribuinte: Number.MAX_SAFE_INTEGER,
        cep: endereco.cep,
        numeroMoradia: endereco.numeroMoradia,
        estado: endereco.estado,
      })),
      listaTelefones: formData.listaTelefones.map((telefone) => ({
        idContribuinte: Number.MAX_SAFE_INTEGER,
        numeroTelefone: telefone.numeroTelefone,
        tipoTelefone: telefone.tipoTelefone,
      })),
      listaParentes: formData.listaParentes.map((parente) => ({
        parenteDTO: {
          nomeParente: parente.nomeParente,
          cpfParente: parente.cpfParente,
        },
        idTipoParentesco: Number(parente.idTipoParentesco), // Parse para número
      })),
    };
  
    console.log(JSON.stringify(jsonFinal, null, 2));
    contribuinteService.cadastrarContribuintes(jsonFinal)
    .then(response => {
      console.log("Contribuinte cadastrado com sucesso:", response.data);
      setErro(null);
      setSuccessMessage(true); // Ativa a mensagem de sucesso
      setFormData(formDataInitial); // Reseta o formulário
    })
    .catch(error => {
      setErro(error);
      setSuccessMessage(false);
    });
};
      const formatCPF = (cpf) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      };

      const formatCEP = (cep) => {
        return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
      };

      const formatPhone = (phone) => {
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      };

      const isFormValid = () => {
        // Valida nome civil (obrigatório, pode conter espaços)
        if (!formData.nomeCivil || formData.nomeCivil.trim() === "") {
          return false;
        }
      
        // Valida CPF (exatamente 11 dígitos)
        if (!formData.cpf || formData.cpf.replace(/\D/g, '').length !== 11) {
          return false;
        }
      
        // Valida categoria (obrigatória)
        if (!formData.idCategoria) {
          return false;
        }
      
        // Valida email principal (obrigatório e formato válido)
        if (formData.listaEmails.length === 0 || 
            !formData.listaEmails[0]?.email?.trim() ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.listaEmails[0].email)) {
          return false;
        }
      
        // Valida endereço principal
        if (formData.listaEnderecos.length === 0) {
          return false;
        }
      
        const primeiroEndereco = formData.listaEnderecos[0];
        // Valida CEP (exatamente 8 dígitos)
        if (!primeiroEndereco?.cep || 
            primeiroEndereco.cep.replace(/\D/g, '').length !== 8) {
          return false;
        }
      
        // Valida número da moradia
        if (!primeiroEndereco?.numeroMoradia?.trim()) {
          return false;
        }
      
        // Valida estado
        if (!primeiroEndereco?.estado) {
          return false;
        }
      
        // Valida telefone principal
        if (formData.listaTelefones.length === 0) {
          return false;
        }
      
        const primeiroTelefone = formData.listaTelefones[0];
        // Valida número de telefone (10 ou 11 dígitos)
        const telDigits = primeiroTelefone?.numeroTelefone?.replace(/\D/g, '') || '';
        if (telDigits.length < 11) {
          return false;
        }
      
        // Valida tipo de telefone
        if (!primeiroTelefone?.tipoTelefone) {
          return false;
        }
      
        // Valida parentes
        for (const parente of formData.listaParentes) {
          // Valida nome do parente (pode conter espaços)
          if (!parente?.nomeParente || parente.nomeParente.trim() === "") {
            return false;
          }
      
          // Valida CPF do parente (exatamente 11 dígitos)
          if (!parente?.cpfParente || parente.cpfParente.replace(/\D/g, '').length !== 11) {
            return false;
          }
      
          // Valida tipo de parentesco
          if (!parente.idTipoParentesco) {
            return false;
          }
        }
      
        return true;
      };

      return (
        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <div className="br-card">
              <div className="card-header">
                <h1 className="text-center">Cadastrar Contribuinte</h1>
              </div>
              <div className="card-content p-4">
                <form onSubmit={handleSubmit} className="form-contribuinte">
                  {/* Dados do Contribuinte */}
                  <fieldset className="br-fieldset mb-4">
                    <legend>Dados do Contribuinte</legend>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <Input
                          id="nomeCivil"
                          label="Nome Civil"
                          value={formData.nomeCivil}
                          onChange={handleChange}
                          placeholder="Nome Completo"
                          required
                          maxLength={100}
                        />
                        <Input
                          id="nomeSocial"
                          label="Nome Social"
                          value={formData.nomeSocial}
                          onChange={handleChange}
                          placeholder="Opcional"
                          maxLength={100}
                        />
                        <Input
                              id="cpf"
                              label="CPF"
                              value={formatCPF(formData.cpf)}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(/\D/g, '');
                                if (rawValue.length <= 11) {
                                  handleChange({
                                    target: {
                                      id: "cpf",
                                      value: rawValue
                                    }
                                  });
                                }
                              }}
                              placeholder="000.000.000-00"
                              required
                              maxLength={14}
                              pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                            />
                      </div>
                      <div className="col-md-3">
                        <SelectCategoria 
                              value={formData.idCategoria}
                              onChange={(e) => handleChange(e)}
                              required
                            />
                        </div>
                    </div>
                  </fieldset>
      
                  {/* Emails */}
                  <fieldset className="br-fieldset mb-4">
                    <legend>Emails</legend>
                    {formData.listaEmails.map((email, index) => (
                      <div key={index} className="row g-3 align-items-end mb-3">
                        <div className="col-md-9">
                          <Input
                            id="email"
                            label={`Email ${index + 1}`}
                            value={email.email || ""}
                            onChange={(e) => handleListChange(e, "listaEmails", index)}
                            type="email"
                            required={index === 0}
                            placeholder="exemplo@dominio.com"
                          />
                        </div>
                        <div className="col-md-3">
                          {formData.listaEmails.length > 1 && (
                            <SecondaryButton 
                              label="Remover" 
                              onClick={() => handleRemoveField("listaEmails", index)}
                              type="button"
                              className="w-100"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="row">
                      <div className="col-md-3">
                        <SecondaryButton 
                          label="Adicionar Email" 
                          onClick={() => handleAddField("listaEmails", { email: "" })}
                          type="button"
                        />
                      </div>
                    </div>
                  </fieldset>
      
                  {/* Endereços */}
                  <fieldset className="br-fieldset mb-4">
                    <legend>Endereços</legend>
                    {formData.listaEnderecos.map((endereco, index) => (
                      <div key={index} className="mb-4">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <Input
                              id="cep"
                              label={`CEP ${index + 1}`}
                              value={formatCEP(endereco.cep || "")}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(/\D/g, '');
                                if (rawValue.length <= 8) {
                                  handleListChange({
                                    target: {
                                      id: "cep",
                                      value: rawValue
                                    }
                                  }, "listaEnderecos", index);
                                }
                              }}
                              required={index === 0}
                              placeholder="00000-000"
                              maxLength={9}
                            />
                          </div>
                          <div className="col-md-4">
                            <SelectEstado 
                              value={endereco.estado} 
                              onChange={(e) => handleListChange(e, "listaEnderecos", index)}
                              required={index === 0} 
                            />
                          </div>
                          <div className="col-md-6">
                            <Input
                              id="numeroMoradia"
                              label={`Número ${index + 1}`}
                              value={endereco.numeroMoradia || ""}
                              onChange={(e) => handleListChange(e, "listaEnderecos", index)}
                              required={index === 0}
                              maxLength={10}
                            />
                          </div>
                        </div>
                        {formData.listaEnderecos.length > 1 && (
                          <div className="row mt-2">
                            <div className="col-md-3">
                              <SecondaryButton 
                                label="Remover Endereço" 
                                onClick={() => handleRemoveField("listaEnderecos", index)}
                                type="button"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="row">
                      <div className="col-md-3">
                        <SecondaryButton 
                          label="Adicionar Endereço" 
                          onClick={() => handleAddField("listaEnderecos", { 
                            cep: "", 
                            numeroMoradia: "", 
                            estado: "" 
                          })}
                          type="button"
                        />
                      </div>
                    </div>
                  </fieldset>
      
                  {/* Telefones */}
                  <fieldset className="br-fieldset mb-4">
                    <legend>Telefones</legend>
                    {formData.listaTelefones.map((telefone, index) => (
                      <div key={index} className="mb-3">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <Input
                              id="numeroTelefone"
                              label={`Telefone ${index + 1}`}
                              value={formatPhone(telefone.numeroTelefone || "")}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(/\D/g, '');
                                if (rawValue.length <= 11) {
                                  handleListChange({
                                    target: {
                                      id: "numeroTelefone",
                                      value: rawValue
                                    }
                                  }, "listaTelefones", index);
                                }
                              }}
                              required={index === 0}
                              placeholder="(00) 00000-0000"
                              maxLength={15}
                            />
                          </div>
                          <div className="col-md-3">
                            <SelectTipoTelefone 
                              value={telefone.tipoTelefone} 
                              onChange={(e) => handleListChange(e, "listaTelefones", index)} 
                              name="tipoTelefone" 
                            />
                          </div>
                        </div>
                        {formData.listaTelefones.length > 1 && (
                          <div className="row mt-2">
                            <div className="col-md-3">
                              <SecondaryButton 
                                label="Remover Telefone" 
                                onClick={() => handleRemoveField("listaTelefones", index)}
                                type="button"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="row">
                      <div className="col-md-3">
                        <SecondaryButton 
                          label="Adicionar Telefone" 
                          onClick={() => handleAddField("listaTelefones", { 
                            numeroTelefone: "", 
                            tipoTelefone: "" 
                          })}
                          type="button"
                        />
                      </div>
                    </div>
                  </fieldset>
      
                  {/* Parentes */}
                  <fieldset className="br-fieldset mb-4">
                    <legend>Parentes</legend>
                    {formData.listaParentes.map((parente, index) => (
                      <div key={index} className="mb-3">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <Input
                              id="nomeParente"
                              label={`Nome do Parente ${index + 1}`}
                              value={parente.nomeParente || ""}
                              onChange={(e) => handleListChange(e, "listaParentes", index)}
                              required
                              maxLength={100}
                            />
                            <Input
                              id="cpfParente"
                              label={`CPF do Parente ${index + 1}`}
                              value={formatCPF(parente.cpfParente || "")}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(/\D/g, '');
                                if (rawValue.length <= 11) {
                                  handleListChange({
                                    target: {
                                      id: "cpfParente",
                                      value: rawValue
                                    }
                                  }, "listaParentes", index);
                                }
                              }}
                              required
                              placeholder="000.000.000-00"
                              maxLength={14}
                            />
                          </div>
                          <div className="col-md-3">
                            <SelectTipoParentesco 
                              key={index}
                              name={`parentesco-${index}`}
                              value={parente.idTipoParentesco}
                              onChange={(e) => handleListChange(e, "listaParentes", index)}
                              required
                            />
                          </div>
                        </div>
                        {formData.listaParentes.length > 1 && (
                          <div className="row mt-2">
                            <div className="col-md-3">
                              <SecondaryButton 
                                label="Remover Parente" 
                                onClick={() => handleRemoveField("listaParentes", index)}
                                type="button"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="row">
                      <div className="col-md-3">
                        <SecondaryButton 
                          label="Adicionar Parente" 
                          onClick={() => handleAddField("listaParentes", { 
                            nomeParente: "", 
                            cpfParente: "", 
                            idTipoParentesco: "" 
                          })}
                          type="button"
                        />
                      </div>
                    </div>
                  </fieldset>
      
                  <div className="text-end mt-4">
                    {erro && (
                      <AlertaErro nomeClasse="Contribuinte" erro={erro} onClose={() => setErro(null)} />
                    )}
                    <SuccessMessage 
                      show={successMessage}
                      onClose={() => setSuccessMessage(false)}
                      title="Cadastro realizado!"
                      message="O contribuinte foi cadastrado com sucesso."
                    />
                    <div className="d-flex justify-content-end gap-3">
                      <button 
                        type="submit" 
                        className={`br-button ${isFormValid() ? 'primary' : 'primary mr-3'}`}
                        disabled={!isFormValid()}
                        aria-disabled={!isFormValid()}
                      >
                        {isFormValid() ? 'Cadastrar Contribuinte' : 'Preencha todos os campos'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
};

export default FormularioContribuinte;