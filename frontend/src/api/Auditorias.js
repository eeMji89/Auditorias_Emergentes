import api from "./api";

export const getAuditorias = () => api.get("/auditorias");
export const getAuditoriaId = (id) => api.get(`/auditorias/${id}`);
export const createAuditoria = (data) => api.post("/auditorias", data);
