import { User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export function Header() {
  const { user, logout, switchRole } = useAuth();

  const roleLabels: Record<UserRole, string> = {
    EMPRESA: 'Empresa',
    OPERADOR: 'Operador',
    AUDITOR: 'Auditor',
    ADMIN: 'Administrador',
  };

  const roleColors: Record<UserRole, string> = {
    EMPRESA: 'bg-blue-100 text-blue-800',
    OPERADOR: 'bg-green-100 text-green-800',
    AUDITOR: 'bg-purple-100 text-purple-800',
    ADMIN: 'bg-red-100 text-red-800',
  };

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          {user.role === 'EMPRESA' && user.companyName && (
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.companyName}</h2>
              {user.companyRuc && <p className="text-sm text-gray-600">RUC: {user.companyRuc}</p>}
            </div>
          )}
          {user.role !== 'EMPRESA' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900">Panel de {roleLabels[user.role]}</h2>
              <p className="text-sm text-gray-600">Gestión del Switch de Pagos Masivos</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleColors[user.role]}`}>
              <Shield className="w-4 h-4 inline mr-1" />
              {roleLabels[user.role]}
            </span>

            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-900">{user.username}</span>
            </div>

            <div className="relative group">
              <button className="text-sm text-blue-600 hover:text-blue-800 underline">
                Cambiar rol →
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {(['EMPRESA', 'OPERADOR', 'AUDITOR', 'ADMIN'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      user.role === role ? 'bg-blue-50 font-medium' : ''
                    }`}
                  >
                    {roleLabels[role]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={logout}
              className="text-gray-600 hover:text-red-600 transition-colors p-2"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
