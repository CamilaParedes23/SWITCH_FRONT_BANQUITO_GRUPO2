import { mockNotifications } from '../../data/mockData';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationList() {
  const handleResend = (id: string) => {
    toast.success('Notificación reenviada');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0D1B4B]">Notificaciones a Beneficiarios</h1>
        <p className="text-gray-600 mt-1">Gestión de notificaciones por correo electrónico</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#0D1B4B]">
            Notificaciones ({mockNotifications.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Beneficiario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Correo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Reintentos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha envío
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockNotifications.map((notif) => (
                <tr key={notif.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {notif.beneficiaryName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notif.beneficiaryEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded text-xs ${
                      notif.type === 'PAGO_EXITOSO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {notif.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={notif.status} size="sm" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notif.retries}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notif.sentDate ? new Date(notif.sentDate).toLocaleString('es-EC') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {notif.status === 'ERROR' && (
                      <button
                        onClick={() => handleResend(notif.id)}
                        className="text-[#0D1B4B] hover:text-[#C9A84C] font-medium flex items-center gap-1"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Reenviar
                      </button>
                    )}
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
