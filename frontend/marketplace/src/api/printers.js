import api from "./client";

export const getPrinters = () => {
  return api.get("/printers");
};