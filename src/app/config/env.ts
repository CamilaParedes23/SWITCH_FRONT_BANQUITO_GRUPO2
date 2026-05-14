/**
 * Configuración centralizada de variables de entorno para todo el proyecto.
 * Esto permite usar las variables en CUALQUIER componente, servicio o contexto
 * importando este objeto ENV.
 */
export const ENV = {
  // API
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  
  // Aplicación
  APP_NAME: import.meta.env.VITE_APP_NAME || 'BanQuito',
  APP_SUBTITLE: import.meta.env.VITE_APP_SUBTITLE || 'Switch Pagos Masivos',
  
  // Autenticación (útil para el AuthContext)
  MOCK_AUTH_ENABLED: import.meta.env.VITE_MOCK_AUTH_ENABLED === 'true',
  DEFAULT_ADMIN_USER: import.meta.env.VITE_DEFAULT_ADMIN_USER || 'admin',
  
  // Entorno
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
};
