import api from "./api";

export const getContratos = () => api.get("/contratos");

export const getContratosById = (id) => api.get(`/contratos/${id}`);

export const createContrato = (data) => api.post("/contratos", data);

export const updateContrato = (id, data) => api.put(`/contratos/${id}`, data);