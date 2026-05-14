import { apiClient } from './apiClient';

export const BatchService = {
  // 1. Ingesta: Carga de archivos (POST /api/v1/pagos-masivos/lotes)
  uploadBatch: (formData: FormData) => 
    apiClient('/pagos-masivos/lotes', { method: 'POST', body: formData }),

  // 2. Seguimiento: Listado de lotes (GET /api/v1/pagos-masivos/lotes)
  getBatches: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiClient(`/pagos-masivos/lotes${query}`, { method: 'GET' });
  },

  // 3. Consulta de un lote especifico (GET /api/v1/pagos-masivos/lotes/{uuid}) 
  getBatchById: (uuid: string) => 
    apiClient(`/pagos-masivos/lotes/${uuid}`, { method: 'GET' }),

  // 4. Consulta de lineas de pago (GET /api/v1/pagos-masivos/lotes/{uuid}/lineas)
  getBatchLines: (uuid: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiClient(`/pagos-masivos/lotes/${uuid}/lineas${query}`, { method: 'GET' });
  },

  // 5. Gestión Operativa
  validateBatch: (uuid: string) => 
    apiClient(`/pagos-masivos/lotes/${uuid}/validar`, { method: 'POST' }),

  processBatch: (uuid: string) => 
    apiClient(`/pagos-masivos/lotes/${uuid}/procesar`, { method: 'POST' }),

  liquidateBatch: (uuid: string) => 
    apiClient(`/pagos-masivos/lotes/${uuid}/liquidar`, { method: 'POST' }),

  annulBatch: (uuid: string, motivo: string) => 
    apiClient(`/pagos-masivos/lotes/${uuid}`, { 
      method: 'DELETE', 
      body: JSON.stringify({ motivo }),
      headers: { 'Content-Type': 'application/json' }
    }),

  // 6. Reportes y Comprobantes (RF-08)
  getBatchNovedades: (uuid: string) => 
    apiClient(`/pagos-masivos/lotes/${uuid}/novedades?formato=JSON`, { method: 'GET' }),

  getBatchComprobante: (uuid: string) => 
    apiClient(`/pagos-masivos/lotes/${uuid}/comprobante?formato=JSON`, { method: 'GET' }),

  getBatchStatus: (uuid: string) => 
    apiClient(`/pagos-masivos/lotes/${uuid}/estado`, { method: 'GET' })
};
