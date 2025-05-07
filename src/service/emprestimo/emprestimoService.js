import api from "./api";

export default {
  // Empréstimos
    criarEmprestimo: (payload) =>
    api.post("/emprestimos", payload),

    simularEmprestimo: (payload) =>
    api.post("/emprestimos/simulacao", payload),

    listarEmprestimosPorCpf: (cpf) =>
    api.get(`/emprestimos/${cpf}`),

//   pagarParcela: (idEmprestimo, parcelaId) =>
//     api.post(`/emprestimos/${idEmprestimo}/parcelas/pagar`, { parcelaId }),

//   anteciparParcela: (idEmprestimo, parcelaId) =>
//     api.post(`/emprestimos/${idEmprestimo}/parcelas/antecipar`, { parcelaId }),

//   listarParcelas: (idEmprestimo) =>
//     api.get(`/emprestimos/${idEmprestimo}/parcelas`),

//   proximaPendente: (idEmprestimo) =>
//     api.get(`/emprestimos/${idEmprestimo}/parcelas/proximaPendente`),

    consultarMargem: (cpf) =>
    api.get(`/emprestimos/margem-consignavel/${cpf}`)
};