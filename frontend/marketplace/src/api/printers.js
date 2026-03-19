import { api } from "./client";

export const getPrinters = () => api("/printers");