import api from "./api";

export const getSolicitudes = () => api.get("/solicitudes");
export const getSolicitudById = (id) => api.get(`/solicitudes/${id}`);
export const createSolicitud = (data) => api.post("/solicitudes", data);
export const deleteSolicitud = (id) => api.delete(`/solicitudes/${id}`);
