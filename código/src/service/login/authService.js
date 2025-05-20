import api, { setToken } from './api';

export default {
  /**
   * Registra o usuário no endpoint público /users/register
   * @param {{cpf: string, password: string}}
   */
  async register({ cpf, password }) {
    return api.post('/users/register', { cpf, password });
  },

  /**
   * Faz login e guarda JWT
   * @param {{cpf: string, password: string}}
   */
  async login({ cpf, password }) {
    await api.post('/auth/login', { cpf, password });
  },

  /**
   * Busca dados do usuário logado
   */
  async me() {
    const { data } = await api.get('/auth/me');
    return data; // { cpf, role }
  },

  async logout() {
   await api.post('/auth/logout');
 },
};
