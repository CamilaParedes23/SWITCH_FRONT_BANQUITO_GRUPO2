import { ENV } from '../config/env';

const API_BASE_URL = ENV.API_BASE_URL;

/**
 * Cliente HTTP base para el proyecto Switch.
 * Maneja automáticamente las variables de entorno, los headers y los errores.
 */
export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Si body es FormData, el navegador necesita poner el Content-Type automáticamente con el boundary.
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('--- DETALLE ERROR BACKEND ---', errorData);
    const errorMessage = errorData.mensaje || errorData.message || `Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  // Identificar qué tipo de respuesta es para procesarla
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  if (contentType && (contentType.includes('text/csv') || contentType.includes('application/octet-stream'))) {
      return response.blob();
  }

  // Si es un status 204 o no hay body
  if (response.status === 204) return null;
  
  return response.text();
};
