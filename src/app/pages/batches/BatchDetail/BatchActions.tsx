import { ShieldCheck, Play, Receipt, AlertCircle } from 'lucide-react';

interface BatchActionsProps {
  estado?: string;
  userRole?: string;
  isLoading?: boolean;
  onValidate: () => void;
  onProcess: () => void;
  onLiquidate: () => void;
  onAnnul: () => void;
}

export function BatchActions({ estado, userRole, isLoading = false, onValidate, onProcess, onLiquidate, onAnnul }: BatchActionsProps) {
  const canValidate = userRole === 'OPERADOR' || userRole === 'ADMIN';
  const canProcess = userRole === 'OPERADOR' || userRole === 'ADMIN';
  const canLiquidate = userRole === 'OPERADOR' || userRole === 'ADMIN';
  const canAnnul = userRole === 'OPERADOR' || userRole === 'ADMIN';

  const handleValidate = () => {
    if (!isLoading) onValidate();
  };

  const handleProcess = () => {
    if (!isLoading) onProcess();
  };

  const handleLiquidate = () => {
    if (!isLoading) onLiquidate();
  };

  const handleAnnul = () => {
    if (!isLoading) onAnnul();
  };
  
  const hasAnyAction = canValidate || canProcess || canLiquidate || canAnnul;
  
  if (!hasAnyAction) return null;
  
  return (
    <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-6">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" /> Acciones de Control Operativo
      </h3>
      <div className="flex flex-wrap gap-4">
        {(estado === 'RECIBIDO' || estado === 'ENCOLADO') && canValidate && (
          <button
            onClick={handleValidate}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" /> Verificar Archivo
              </>
            )}
          </button>
        )}
        {estado === 'VALIDADO' && canProcess && (
          <button
            onClick={handleProcess}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#0D1B4B] rounded-lg font-bold shadow-lg hover:bg-[#b8973b] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-[#0D1B4B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ejecutando...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" /> Ejecutar Pagos
              </>
            )}
          </button>
        )}
        {['PROCESADO_TOTAL', 'PROCESADO_PARCIAL'].includes(estado || '') && canLiquidate && (
          <button
            onClick={handleLiquidate}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-bold shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cobrando...
              </>
            ) : (
              <>
                <Receipt className="w-5 h-5" /> Cobrar Comisiones
              </>
            )}
          </button>
        )}
        {['RECIBIDO', 'VALIDADO', 'ENCOLADO', 'VALIDANDO', 'RECHAZADO'].includes(estado || '') && canAnnul && (
          <button
            onClick={handleAnnul}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-red-200 text-red-600 rounded-lg font-bold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Anulando...
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" /> Anular Operación
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
