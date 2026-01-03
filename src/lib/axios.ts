import axios from "axios";
import { csrfService } from "./csrf";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Interceptor de request para agregar CSRF automáticamente
api.interceptors.request.use(async (config) => {
  // Solo agregar CSRF a métodos que modifican datos
  const methodsRequiringCSRF = ["post", "put", "delete", "patch"];

  if (methodsRequiringCSRF.includes(config.method?.toLowerCase() || "")) {
    // Excluir rutas públicas que no requieren CSRF
    const publicRoutes = [
      "/auth/login",
      "/auth/create-account",
      "/auth/confirm-account",
      "/auth/request-code",
      "/auth/forgot-password",
      "/auth/validate-token",
      "/auth/update-password",
      "/auth/csrf-token", // No necesita CSRF para obtenerlo
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      config.url?.includes(route),
    );

    if (!isPublicRoute) {
      try {
        const csrfToken = await csrfService.getToken();
        // Agregar _csrf al body de la request
        config.data = {
          ...config.data,
          _csrf: csrfToken,
        };
      } catch (error) {
        console.error("Error obteniendo token CSRF para request:", error);
        // Si no podemos obtener el token, la request fallará apropiadamente
      }
    }
  }

  return config;
});

export default api;
