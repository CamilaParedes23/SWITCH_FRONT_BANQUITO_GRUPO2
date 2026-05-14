import { mockQueueItems } from '../../data/mockData';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Clock, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ProcessingQueue() {
  const handleForceProcessing = (id: string) => {
    toast.success('Procesamiento iniciado manualmente');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0D1B4B]">Cola de Procesamiento</h1>
        <p className="text-gray-600 mt-1">Lotes encolados para procesamiento automático</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0D1B4B]">
              Lotes encolados ({mockQueueItems.length})
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Actualizado hace 2 minutos</span>
            </div>
          </div>
        </div>

        {mockQueueItems.length === 0 ? (
          <div className="p-12 text-center text-gray-600">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No hay lotes en cola</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID Lote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha programada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Prioridad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Intentos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockQueueItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {item.batchId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{item.batch.companyName}</p>
                        <p className="text-xs text-gray-500">{item.batch.companyRuc}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.batch.serviceType === 'NOM' ? 'Nómina' : 'Proveedores'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.scheduledDate} {item.scheduledTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.attempts}/3
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleForceProcessing(item.id)}
                        className="text-[#0D1B4B] hover:text-[#C9A84C] font-medium flex items-center gap-1"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Forzar procesamiento
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-medium text-[#0D1B4B] mb-2">API Endpoints:</p>
        <ul className="font-mono text-xs text-gray-600 space-y-1">
          <li>GET /api/v1/switch/cola-procesamiento</li>
          <li>POST /api/v1/switch/cola-procesamiento/{'{id}'}/procesar</li>
        </ul>
      </div>
    </div>
  );
}
