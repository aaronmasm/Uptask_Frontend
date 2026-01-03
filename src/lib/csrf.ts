import api from "@/lib/axios";

interface CSRFResponse {
  csrfToken: string;
}

class CSRFService {
  private token: string | null = null;
  private tokenPromise: Promise<string> | null = null;

  async getToken(): Promise<string> {
    // Si ya tenemos un token válido, retornarlo
    if (this.token) {
      return this.token;
    }

    // Si ya hay una petición en curso, esperar por ella
    if (this.tokenPromise) {
      return this.tokenPromise;
    }

    // Crear nueva petición
    this.tokenPromise = this.fetchToken();

    try {
      this.token = await this.tokenPromise;
      return this.token;
    } finally {
      this.tokenPromise = null;
    }
  }

  private async fetchToken(): Promise<string> {
    try {
      const { data } = await api.get<CSRFResponse>("auth/csrf-token");
      return data.csrfToken;
    } catch (error) {
      console.error("Error obteniendo token CSRF:", error);
      throw new Error("No se pudo obtener el token CSRF");
    }
  }

  clearToken(): void {
    this.token = null;
    this.tokenPromise = null;
  }

  hasToken(): boolean {
    return this.token !== null;
  }
}

export const csrfService = new CSRFService();
