import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Upload,
  RefreshCw,
  Ban
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BatchService } from '../services/batchService';
import { StatusBadge } from '../components/shared/StatusBadge';

export function Dashboard() {
  const { user } = useAuth();
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLotes: 0,
    montoTotal: 0,
    pendientes: 0,
    enProceso: 0,
    anulados: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const params: any = { tamano: '100' };
        if (user?.role === 'EMPRESA') params.rucEmpresa = user.companyRuc;
        
        const response = await BatchService.getBatches(params);
        const data = response.contenido || [];
        setBatches(data.slice(0, 5));

        const summary = data.reduce((acc: any, b: any) => {
          acc.totalLotes++;
          acc.montoTotal += (b.montoTotalDeclarado || 0);
          
          // Clasificación operativa por el usuario
          if (['RECIBIDO', 'VALIDADO'].includes(b.estado)) acc.pendientes++;
          if (['ENCOLADO', 'PROCESANDO'].includes(b.estado)) acc.enProceso++;
          if (b.estado === 'ANULADO') acc.anulados++;
          
          return acc;
        }, { totalLotes: 0, montoTotal: 0, pendientes: 0, enProceso: 0, anulados: 0 });

        setStats(summary);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <RefreshCw className="w-10 h-10 animate-spin text-[#0D1B4B] mb-4 opacity-20" />
        <p className="text-gray-400 italic">Cargando tablero operativo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1B4B]">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'EMPRESA'
              ? `Resumen para ${user.companyName}`
              : 'Control Central del Switch de Pagos'}
          </p>
        </div>
        {user?.role === 'EMPRESA' && (
          <Link
            to="/batches/upload"
            className="bg-[#0D1B4B] hover:bg-[#1e3a8a] text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all font-medium"
          >
            <Upload className="w-5 h-5" />
            Cargar Lote
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lotes Totales</p>
              <p className="text-3xl font-bold text-[#0D1B4B] mt-2">{stats.totalLotes}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Volumen Total</p>
              <p className="text-xl font-bold text-green-600 mt-2">
                ${stats.montoTotal.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Por Atender</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendientes}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-full">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lotes Anulados</p>
              <p className="text-3xl font-bold text-gray-400 mt-2">{stats.anulados}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-full">
              <Ban className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#0D1B4B]">Actividad Reciente</h2>
          <Link to="/batches" className="text-xs font-bold text-blue-600 hover:underline">Ver Historial Completo →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase">UUID Lote</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase">Empresa</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase text-right">Monto</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase text-center">Estado</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase text-center">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {batches.map((batch) => (
                <tr key={batch.uuidLote} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[11px] text-gray-400">{batch.uuidLote.substring(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{batch.rucEmpresa}</td>
                  <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                    ${batch.montoTotalDeclarado.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={batch.estado} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/batches/${batch.uuidLote}`}
                      state={{ batch }}
                      className="inline-flex items-center justify-center px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#0D1B4B] bg-white border border-gray-200 rounded-md hover:bg-[#0D1B4B] hover:text-white transition-all shadow-sm"
                    >
                      GESTIONAR
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
