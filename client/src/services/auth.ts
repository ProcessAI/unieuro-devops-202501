import axios from 'axios';

const production = false;

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const login = async (email: string, senha: string) => {
  const response = await API.post('/login', { email, senha });
  if (response.status === 200) {
    const { accessToken, refreshToken } = response.data;
    document.cookie = `accessToken=${accessToken}; path=/;`;
    document.cookie = `refreshToken=${refreshToken}; path=/;`;
  }
  return response.data;
};

export const refreshAccessToken = async () => {
  return API.post('/refresh');
};

export const logout = async () => {
  return API.post('/logout');
};
