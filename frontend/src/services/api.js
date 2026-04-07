import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDomains = () => api.get('/domains');

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

export const getSlots = (validatorId, available) => api.get(`/slots?validatorId=${validatorId}&available=${available}`);
export const getSlotsByDomain = (domainId, available) => api.get(`/slots?domainId=${domainId}&available=${available}`);
export const getValidatorsByDomain = (domainId) => api.get(`/validators?domainId=${domainId}`);
export const getValidatorProfile = (id) => api.get(`/validators/${id}`);
export const createSlot = (data) => api.post('/slots', data);
export const updateSlot = (id, data) => api.put(`/slots/${id}`, data);
export const deleteSlot = (id) => api.delete(`/slots/${id}`);

export const bookSession = (data) => api.post('/sessions/book', data);
export const getMySessions = () => api.get('/sessions/my');

export const submitEvaluation = (data) => api.post('/evaluations', data);
export const getMyEvaluations = () => api.get('/evaluations/my');
export const startEvaluation = (sessionId) => api.post(`/evaluations/start/${sessionId}`);

export const getRankings = (domainId) => api.get(`/rankings?domainId=${domainId}`);

export default api;
