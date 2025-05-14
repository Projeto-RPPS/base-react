import api from "./api";

export default {
  // Empréstimos
    criarEmprestimo: (payload) =>
    api.post("/emprestimos", payload),

    simularEmprestimo: (payload) =>
    api.post("/emprestimos/simulacao", payload),

    listarEmprestimosPorCpf: (cpf) =>
    api.get(`/emprestimos/${cpf}`),

    pagarParcela: (idEmprestimo) =>
    api.post(`/emprestimos/${idEmprestimo}/parcelas/pagar`),

    anteciparParcelas: (idEmprestimo, quantidadeParcelas) =>
    api.post(
        `/emprestimos/${idEmprestimo}/parcelas/antecipar`,
        null,                        
        { params: { quantidadeParcelas } }  
    ),

    listarParcelas: (idEmprestimo) =>
    api.get(`/emprestimos/${idEmprestimo}/parcelas`),

    proximaPendente: (idEmprestimo) =>
    api.get(`/emprestimos/${idEmprestimo}/parcelas/proximaPendente`),

    consultarMargem: (cpf) =>
    api.get(`/emprestimos/margem-consignavel/${cpf}`)
};