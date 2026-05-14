import { mockTransactionLimits } from '../../data/mockData';

export function TransactionLimits() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0D1B4B]">Límites de Transacción</h1>
        <p className="text-gray-600 mt-1">Límites mínimos y máximos por tipo de servicio</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Servicio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto Mínimo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto Máximo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moneda</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vigente desde</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTransactionLimits.map((limit) => (
                <tr key={limit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {limit.serviceType === 'NOM' ? 'Nómina' : 'Proveedores'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${limit.minAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${limit.maxAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {limit.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(limit.validFrom).toLocaleDateString('es-EC')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      limit.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {limit.active ? 'Activo' : 'Inactivo'}
                    </span>
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
