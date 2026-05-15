import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Download, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { BatchService } from '../../services/batchService';
import {
  comprobanteLiquidacionToCsv,
  downloadTextFile,
  reporteNovedadesToCsv,
} from '../../utils/batchReportExport';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { ConfirmModal } from '../../components/shared/ConfirmModal';
import { toast } from 'sonner';
import { useBatchDetail } from '../../hooks/useBatchDetail';
import { BatchHeader } from './BatchDetail/BatchHeader';
import { BatchActions } from './BatchDetail/BatchActions';
import { BatchLinesTable } from './BatchDetail/BatchLinesTable';
import { SettlementTab } from './BatchDetail/SettlementTab';
import { NovedadesTab } from './BatchDetail/NovedadesTab';
import { ComprobanteTab } from './BatchDetail/ComprobanteTab';

export function BatchDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    batch,
    lines,
    fees,
    liquidationResult,
    setLiquidationResult,
    validationErrors,
    setValidationErrors,
    novedades,
    comprobante,
    isLoadingReports,
    settlement,
    successfulLines,
    fetchData,
  } = useBatchDetail(id);

  const [activeTab, setActiveTab] = useState<'lines' | 'settlement' | 'novedades' | 'comprobante'>('lines');
  const [showActionModal, setShowActionModal] = useState<{ type: 'VALIDATE' | 'PROCESS' | 'LIQUIDATE' | 'ANNUL' | null }>({ type: null });
  const [annulReason, setAnnulReason] = useState('');

  const handleAction = async () => {
    if (!id) return;
    try {
      if (showActionModal.type === 'VALIDATE') {
        const res = await BatchService.validateBatch(id);
        setValidationErrors(res.errores || []);
        if (res.errores?.length > 0) {
          toast.error(`Validación completada con ${res.errores.length} error(es) estructural(es).`);
        } else {
          toast.success('Archivo validado exitosamente. Sin errores estructurales.');
        }
      }
      if (showActionModal.type === 'PROCESS') await BatchService.processBatch(id);
      if (showActionModal.type === 'LIQUIDATE') {
        const res = await BatchService.liquidateBatch(id);
        setLiquidationResult(res);
        void BatchService.getBatchNovedades(id)
          .then(() => {
            toast.message('Notificaciones registradas al generar el reporte de novedades.');
          })
          .catch(() => {});
      }
      if (showActionModal.type === 'ANNUL') await BatchService.annulBatch(id, annulReason);

      toast.success('Petición procesada por el Switch.');
      setShowActionModal({ type: null });
      fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error en la operación bancaria.';
      toast.error(message);
    }
  };

  const handleDownloadReport = async (type: 'NOVEDADES' | 'COMPROBANTE', format: 'csv' | 'json') => {
    try {
      const data = type === 'NOVEDADES'
        ? await BatchService.getBatchNovedades(id!)
        : await BatchService.getBatchComprobante(id!);

      const shortId = id?.substring(0, 8) ?? 'lote';
      if (format === 'json') {
        downloadTextFile(`Reporte_${type}_${shortId}.json`, JSON.stringify(data, null, 2), 'application/json');
      } else if (type === 'NOVEDADES') {
        downloadTextFile(`Reporte_NOVEDADES_${shortId}.csv`, reporteNovedadesToCsv(data), 'text/csv;charset=utf-8');
      } else {
        downloadTextFile(`Comprobante_LIQUIDACION_${shortId}.csv`, comprobanteLiquidacionToCsv(data), 'text/csv;charset=utf-8');
      }
      toast.success(`Descarga ${format.toUpperCase()} lista.`);
    } catch {
      toast.error('Reporte no disponible para este estado.');
    }
  };

  if (!batch.uuidLote) return <div className="p-20 text-center italic text-gray-400">Consultando PostgreSQL...</div>;


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-[#0D1B4B]"><ArrowLeft /></button>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-[#0D1B4B]">Gestión Operativa</h1>
            {batch.estado && <StatusBadge status={batch.estado} size="lg" />}
          </div>
          <p className="text-xs font-mono text-gray-400 mt-1">{batch.uuidLote}</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {batch.estado === 'CERRADO' && (
            <>
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => handleDownloadReport('NOVEDADES', 'csv')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#0D1B4B] rounded-md hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" /> Novedades .csv
                </button>
                <span className="text-gray-200">|</span>
                <button
                  type="button"
                  onClick={() => handleDownloadReport('NOVEDADES', 'json')}
                  className="px-2 py-2 text-[10px] font-semibold text-gray-500 hover:text-[#0D1B4B]"
                >
                  JSON
                </button>
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-[#0D1B4B] bg-[#0D1B4B] p-0.5">
                <button
                  type="button"
                  onClick={() => handleDownloadReport('COMPROBANTE', 'csv')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white rounded-md hover:bg-[#1e3a8a]"
                >
                  <Download className="w-4 h-4" /> Comprobante .csv
                </button>
                <span className="text-white/30">|</span>
                <button
                  type="button"
                  onClick={() => handleDownloadReport('COMPROBANTE', 'json')}
                  className="px-2 py-2 text-[10px] font-semibold text-white/80 hover:text-white"
                >
                  JSON
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <BatchHeader batch={batch} />

      {batch.motivoRechazoGlobal && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
          <div className="w-5 h-5 text-red-600 mt-0.5 shrink-0">!</div>
          <div>
            <h4 className="text-sm font-bold text-red-800">Lote Rechazado</h4>
            <p className="text-sm text-red-700 mt-1">{batch.motivoRechazoGlobal}</p>
          </div>
        </div>
      )}

      {batch.fechas && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Trazabilidad del Lote</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Recepción', value: batch.fechas.fechaRecepcion },
              { label: 'Inicio Validación', value: batch.fechas.fechaInicioValidacion },
              { label: 'Fin Validación', value: batch.fechas.fechaFinValidacion },
              { label: 'Inicio Proceso', value: batch.fechas.fechaInicioProceso },
              { label: 'Fin Proceso', value: batch.fechas.fechaFinProceso },
              { label: 'Cierre', value: batch.fechas.fechaCierre },
            ].map((f) => (
              <div key={f.label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase">{f.label}</p>
                <p className="text-xs font-bold text-gray-900 mt-1">
                  {f.value ? new Date(f.value).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h4 className="text-sm font-bold text-red-800 mb-3">
            Errores de Validación Estructural ({validationErrors.length})
          </h4>
          <ul className="space-y-2">
            {validationErrors.map((err, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                <span className="font-mono font-bold text-red-500 shrink-0">{err.codigo}</span>
                <span>{err.mensaje}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <BatchActions
        estado={batch.estado}
        onValidate={() => setShowActionModal({ type: 'VALIDATE' })}
        onProcess={() => setShowActionModal({ type: 'PROCESS' })}
        onLiquidate={() => setShowActionModal({ type: 'LIQUIDATE' })}
        onAnnul={() => setShowActionModal({ type: 'ANNUL' })}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50">
          <button onClick={() => setActiveTab('lines')} className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'lines' ? 'bg-white border-t-2 border-[#C9A84C] text-[#0D1B4B]' : 'text-gray-400'}`}>Detalle de Pagos</button>
          <button onClick={() => setActiveTab('settlement')} className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'settlement' ? 'bg-white border-t-2 border-[#C9A84C] text-[#0D1B4B]' : 'text-gray-400'}`}>Resumen de Comisiones</button>
          {batch.estado === 'CERRADO' && (
            <>
              <button onClick={() => setActiveTab('novedades')} className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'novedades' ? 'bg-white border-t-2 border-[#C9A84C] text-[#0D1B4B]' : 'text-gray-400'}`}><FileText className="w-4 h-4"/> Novedades</button>
              <button onClick={() => setActiveTab('comprobante')} className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'comprobante' ? 'bg-white border-t-2 border-[#C9A84C] text-[#0D1B4B]' : 'text-gray-400'}`}><TrendingUp className="w-4 h-4"/> Comprobante</button>
            </>
          )}
        </div>

        <div className="p-6">
          {activeTab === 'lines' && <BatchLinesTable lines={lines} />}
          {activeTab === 'settlement' && (
            <SettlementTab
              liquidationResult={liquidationResult}
              settlement={settlement}
              successfulCount={successfulLines}
              feesCurrency={fees?.moneda}
            />
          )}
          {activeTab === 'novedades' && <NovedadesTab isLoading={isLoadingReports} data={novedades} />}
          {activeTab === 'comprobante' && <ComprobanteTab isLoading={isLoadingReports} data={comprobante} />}
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
