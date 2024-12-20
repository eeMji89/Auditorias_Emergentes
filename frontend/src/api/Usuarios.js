import api from "./api"; 

export const fetchAuditores = () => api.get("/auditores");

export const fetchAuditorById = (id) => api.get(`/auditores/${id}`);

export const updateAuditor = (id, data) => api.put(`/auditores/${id}`, data);

export const fetchEmpresas = () => api.get("/empresas");

export const getEmpresaById = (id) => api.get(`/empresas/${id}`);

export const updateEmpresa = (id, data) => api.put(`/empresas/${id}`, data);

export const fetchNotifications = () => api.get('/notifications');

export const markNotificationAsRead = (id) => api.put(`/notifications/${id}`);

export const createNotification = (data) => api.post("/notifications",data);