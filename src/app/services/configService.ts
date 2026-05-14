import { apiClient } from './apiClient';

export const ConfigService = {
  // Conectado al HorarioCorteController del Backend
  getCutoffTimes: () => 
    apiClient('/pagos-masivos/horarios-corte', { method: 'GET' }),

  // Alias con nombre más claro para SystemParameters
  getOperatingHours: () =>
    apiClient('/pagos-masivos/horarios-corte', { method: 'GET' }),

  // Conectado al TarifajeController para obtener las reglas de cobro
  getPricingRules: () => apiClient('/pagos-masivos/tarifas', { method: 'GET' }),

  // Health check usando la API existente (con CORS habilitado) en lugar de /actuator
  getSystemHealth: () =>
    apiClient('/pagos-masivos/horarios-corte', { method: 'GET' }),

  // Alias para compatibilidad con componentes viejos
  getServiceTypes: () => 
    apiClient('/pagos-masivos/tipos-servicio', { method: 'GET' })
};

export const CatalogService = {
  // Conectado al TipoServicioController para obtener NOM, PRV, etc.
  getServiceTypes: () => 
    apiClient('/pagos-masivos/tipos-servicio', { method: 'GET' })
};
