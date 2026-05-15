import { ShieldCheck, Play, Receipt, AlertCircle } from 'lucide-react';

interface BatchActionsProps {
  estado?: string;
  userRole?: string;
  onValidate: () => void;
  onProcess: () => void;
  onLiquidate: () => void;
  onAnnul: () => void;
}

export function BatchActions({ estado, userRole, onValidate, onProcess, onLiquidate, onAnnul }: BatchActionsProps) {
  const canValidate = userRole === 'OPERADOR' || userRole === 'ADMIN';
  const canProcess = userRole === 'OPERADOR' || userRole === 'ADMIN';
  const canLiquidate = userRole === 'OPERADOR' || userRole === 'ADMIN';
  const canAnnul = userRole === 'OPERADOR' || userRole === 'ADMIN';
  
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
            onClick={onValidate}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all"
          >
            <ShieldCheck className="w-5 h-5" /> Verificar Archivo
          </button>
        )}
        {estado === 'VALIDADO' && canProcess && (
          <button
            onClick={onProcess}
            className="flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#0D1B4B] rounded-lg font-bold shadow-lg hover:bg-[#b8973b] transition-all"
          >
            <Play className="w-5 h-5" /> Ejecutar Pagos
          </button>
        )}
        {['PROCESADO_TOTAL', 'PROCESADO_PARCIAL'].includes(estado || '') && canLiquidate && (
          <button
            onClick={onLiquidate}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-bold shadow-lg hover:bg-green-700 transition-all"
          >
            <Receipt className="w-5 h-5" /> Cobrar Comisiones
          </button>
        )}
        {['RECIBIDO', 'VALIDADO', 'ENCOLADO', 'VALIDANDO', 'RECHAZADO'].includes(estado || '') && canAnnul && (
          <button
            onClick={onAnnul}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-red-200 text-red-600 rounded-lg font-bold hover:bg-red-50 transition-all"
          >
            <AlertCircle className="w-5 h-5" /> Anular Operación
          </button>
        )}
      </div>
    </div>
  );
}
