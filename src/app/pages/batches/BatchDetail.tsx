import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { 
  ArrowLeft, RefreshCw, ShieldCheck, Download, 
  Play, Receipt, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { BatchService } from '../../services/batchService';
import { ConfigService } from '../../services/configService';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { ConfirmModal } from '../../components/shared/ConfirmModal';
import { toast } from 'sonner';

export function BatchDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [batch, setBatch] = useState<any>(location.state?.batch || null);
  const [lines, setLines] = useState<any[]>([]);
  const [fees, setFees] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lines' | 'settlement'>('lines');
  
  const [showActionModal, setShowActionModal] = useState<{ type: 'VALIDATE' | 'PROCESS' | 'LIQUIDATE' | 'ANNUL' | null }>({ type: null });
  const [annulReason, setAnnulReason] = useState('');

  // Lógica de Tarifaje REAL (Sincronizada con el Backend y Rangos de la DB)
  const calculateCommission = (successfulCount: number) => {
    if (!successfulCount || successfulCount <= 0) {
      return { rate: 0, subtotal: 0, iva: 0, total: 0 };
    }
    
    let rate = 0;
    
    // Si tenemos las tarifas del back, buscamos el rango
    if (fees?.rangos) {
      const matchedRango = fees.rangos.find((r: any) => 
        successfulCount >= r.rangoDesde && (r.rangoHasta === null || successfulCount <= r.rangoHasta)
      );
      if (matchedRango) rate = matchedRango.tarifaUnitaria;
    } else {
      // Fallback a lógica estándar si falla el servicio de tarifas
      rate = 0.50;
      if (successfulCount > 10) rate = 0.40;
      if (successfulCount > 100) rate = 0.30;
      if (successfulCount > 500) rate = 0.20;
    }
    
    const subtotal = successfulCount * rate;
    const iva = subtotal * 0.15; // IVA según RF-07
    return { rate, subtotal, iva, total: subtotal + iva };
  };

  const fetchData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      // 1. Obtener Lote (Fallback a lista si no hay estado)
      let currentBatch = batch;
      if (!currentBatch) {
        const listResponse = await BatchService.getBatches({ tamano: '100' });
        currentBatch = listResponse.contenido?.find((b: any) => b.uuidLote === id);
        if (currentBatch) setBatch(currentBatch);
      }

      // 2. Obtener Tarifas Reales del Back (Nuevo!)
      if (currentBatch) {
        try {
          const feesData = await ConfigService.getPricingRules(currentBatch.tipoServicio);
          setFees(feesData);
        } catch (e) { console.error('No se pudieron cargar tarifas reales'); }
      }

      // 3. Obtener Líneas
      const linesData = await BatchService.getBatchLines(id, { size: '100' });
      setLines(linesData.contenido || []);
      
    } catch (error) {
      console.error('Error fetching batch detail:', error);
      toast.error('Error al sincronizar con el motor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Polling Inteligente (Auto-refresco para estados en transición)
  useEffect(() => {
    let interval: any;

    const transitionalStates = ['VALIDANDO', 'ENCOLADO', 'PROCESANDO'];
    
    if (batch && transitionalStates.includes(batch.estado)) {
      interval = setInterval(() => {
        console.log('Polling backend for status update...');
        fetchData();
      }, 5000); // Cada 5 segundos
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [batch?.estado, id]);

  const handleAction = async () => {
    if (!id) return;
    try {
      if (showActionModal.type === 'VALIDATE') await BatchService.validateBatch(id);
      if (showActionModal.type === 'PROCESS') await BatchService.processBatch(id);
      if (showActionModal.type === 'LIQUIDATE') await BatchService.liquidateBatch(id);
      if (showActionModal.type === 'ANNUL') await BatchService.annulBatch(id, annulReason);
      
      toast.success('Petición procesada por el Switch.');
      setShowActionModal({ type: null });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Error en la operación bancaria.');
    }
  };

  const handleDownloadReport = async (type: 'NOVEDADES' | 'COMPROBANTE') => {
    try {
      const data = type === 'NOVEDADES' 
        ? await BatchService.getBatchNovedades(id!) 
        : await BatchService.getBatchComprobante(id!);
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte_${type}_${id?.substring(0,8)}.json`;
      a.click();
      toast.success(`Archivo de ${type} descargado.`);
    } catch (error) {
      toast.error('Reporte no disponible para este estado.');
    }
  };

  if (isLoading && !batch) return <div className="p-20 text-center italic text-gray-400">Consultando PostgreSQL...</div>;
  if (!batch) return <div className="p-20 text-center text-gray-600">No se encontró el registro.</div>;

  const successfulLines = lines.filter(l => l.estado === 'EXITOSA').length;
  const settlement = calculateCommission(batch.totalRegistrosValidados || successfulLines);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-[#0D1B4B]"><ArrowLeft /></button>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-[#0D1B4B]">Gestión Operativa</h1>
            <StatusBadge status={batch.estado} size="lg" />
          </div>
          <p className="text-xs font-mono text-gray-400 mt-1">{batch.uuidLote}</p>
        </div>
        <div className="flex gap-2">
          {batch.estado === 'CERRADO' && (
            <>
              <button onClick={() => handleDownloadReport('NOVEDADES')} className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50"><Download className="w-4 h-4"/> Reporte Novedades</button>
              <button onClick={() => handleDownloadReport('COMPROBANTE')} className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1e3a8a]"><Download className="w-4 h-4"/> Comprobante</button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entidad Emisora</p>
          <p className="font-bold text-gray-900 mt-1">{batch.rucEmpresa}</p>
          <p className="text-[10px] text-gray-500 italic truncate">{batch.nombreArchivo}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cuenta de Cargo</p>
          <p className="font-mono text-sm font-bold text-blue-600 mt-1">
            {batch.cuentaMatrizCargo || sessionStorage.getItem(`account_${batch.uuidLote}`) || 'CTA-CORRIENTE-VINCULADA'}
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monto Declarado</p>
          <p className="text-xl font-black text-gray-900 mt-1">${batch.montoTotalDeclarado.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registros</p>
          <p className="text-xl font-black text-gray-900 mt-1">{batch.totalRegistrosDeclarado}</p>
        </div>
      </div>

      <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Acciones de Control Operativo
        </h3>
        <div className="flex flex-wrap gap-4">
          {batch.estado === 'RECIBIDO' && (
            <button onClick={() => setShowActionModal({ type: 'VALIDATE' })} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all">
              <ShieldCheck className="w-5 h-5"/> Verificar Archivo
            </button>
          )}
          {batch.estado === 'VALIDADO' && (
            <button onClick={() => setShowActionModal({ type: 'PROCESS' })} className="flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#0D1B4B] rounded-lg font-bold shadow-lg hover:bg-[#b8973b] transition-all">
              <Play className="w-5 h-5"/> Ejecutar Pagos
            </button>
          )}
          {['PROCESANDO', 'PROCESADO_TOTAL', 'VALIDADO'].includes(batch.estado) && (
            <button onClick={() => setShowActionModal({ type: 'LIQUIDATE' })} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-bold shadow-lg hover:bg-green-700 transition-all">
              <Receipt className="w-5 h-5"/> Cobrar Comisiones
            </button>
          )}
          {['RECIBIDO', 'VALIDADO', 'ENCOLADO'].includes(batch.estado) && (
            <button onClick={() => setShowActionModal({ type: 'ANNUL' })} className="flex items-center gap-2 px-6 py-3 bg-white border border-red-200 text-red-600 rounded-lg font-bold hover:bg-red-50 transition-all">
              <AlertCircle className="w-5 h-5"/> Anular Operación
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50">
          <button onClick={() => setActiveTab('lines')} className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'lines' ? 'bg-white border-t-2 border-[#C9A84C] text-[#0D1B4B]' : 'text-gray-400'}`}>Detalle de Pagos</button>
          <button onClick={() => setActiveTab('settlement')} className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'settlement' ? 'bg-white border-t-2 border-[#C9A84C] text-[#0D1B4B]' : 'text-gray-400'}`}>Resumen de Comisiones</button>
        </div>

        <div className="p-6">
          {activeTab === 'lines' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
                    <th className="pb-3">Sec.</th>
                    <th className="pb-3">Beneficiario</th>
                    <th className="pb-3 text-right">Monto</th>
                    <th className="pb-3 text-center">Estado</th>
                    <th className="pb-3">Mensaje Motor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {lines.map((l) => (
                    <tr key={l.uuidOperacionSwitch} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-gray-400 font-mono">{l.secuencial}</td>
                      <td className="py-4">
                        <p className="font-bold text-gray-900">{l.nombreBeneficiario}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{l.identificacionBeneficiario} | {l.cuentaDestino}</p>
                      </td>
                      <td className="py-4 text-right font-bold text-gray-900">${l.monto.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 text-center"><StatusBadge status={l.estado} size="sm" /></td>
                      <td className="py-4 text-xs italic text-gray-400">{l.mensajeError || (l.estado === 'EXITOSA' ? <CheckCircle2 className="w-4 h-4 text-green-500 inline"/> : '-')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'settlement' && (
            <div className="max-w-xl mx-auto space-y-6 py-4">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="text-sm font-bold text-[#0D1B4B] mb-4 flex justify-between items-center">
                  Resumen Financiero 
                  {fees?.moneda && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Tarifa en {fees.moneda}</span>}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-gray-600"><span>Pagos Ejecutados Exitosamente</span><span className="font-bold">{batch.totalRegistrosValidados || successfulLines}</span></div>
                  <div className="flex justify-between text-xs text-gray-600"><span>Tarifa Unitaria (vía API)</span><span className="font-bold">${settlement.rate.toFixed(2)}</span></div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-sm"><span>Comisión Neta</span><span className="font-bold">${settlement.subtotal.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between text-sm"><span>IVA Servicio (15%)</span><span className="font-bold">${settlement.iva.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span></div>
                  <div className="bg-[#0D1B4B] text-white p-5 rounded-lg flex justify-between items-center mt-6 shadow-lg">
                    <div>
                      <p className="text-[10px] font-bold uppercase opacity-60">Total a Debitar de Cuenta</p>
                      <p className="text-2xl font-black">${settlement.total.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <Receipt className="w-8 h-8 opacity-20" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showActionModal.type !== null}
        title={showActionModal.type === 'PROCESS' ? 'Ejecución de Dispersión' : 'Confirmar Acción'}
        variant={showActionModal.type === 'ANNUL' ? 'danger' : 'warning'}
        confirmText="Confirmar"
        message={
          <div className="space-y-4 text-gray-600">
            {showActionModal.type === 'PROCESS' && "Está a punto de ejecutar la transferencia masiva de fondos. Esta acción afectará los saldos del Core Bancario inmediatamente."}
            {showActionModal.type === 'LIQUIDATE' && "Se procederá al cobro de comisiones e IVA. El lote pasará a estado CERRADO."}
            {showActionModal.type === 'ANNUL' && "Ingrese el motivo de anulación para el registro oficial de auditoría:"}
            {showActionModal.type === 'ANNUL' && (
              <textarea className="w-full p-3 border rounded-lg text-sm font-sans" rows={3} value={annulReason} onChange={(e) => setAnnulReason(e.target.value)} placeholder="Motivo de la anulación..." />
            )}
          </div>
        }
        onConfirm={handleAction}
        onCancel={() => setShowActionModal({ type: null })}
      />
    </div>
  );
}
