import { User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          {user.companyName && (
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.companyName}</h2>
              {user.companyRuc && <p className="text-sm text-gray-600">RUC: {user.companyRuc}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Shield className="w-4 h-4 inline mr-1" />
              Empresa
            </span>

            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-900">{user.username}</span>
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
