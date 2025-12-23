import { Link, useLocation } from 'react-router-dom';
import { Calendar, ListTodo, BarChart3, Settings, HelpCircle } from 'lucide-react';

const navigationItems = [
  {
    name: 'Calendrier',
    href: '/dashboard',
    icon: Calendar,
    description: 'Vue d\'ensemble'
  },
  {
    name: 'Événements',
    href: '/events',
    icon: ListTodo,
    description: 'Tous les événements'
  },
  {
    name: 'Statistiques',
    href: '/stats',
    icon: BarChart3,
    description: 'Analyses'
  },
  {
    name: 'Paramètres',
    href: '/settings',
    icon: Settings,
    description: 'Configuration'
  },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Navigation principale */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Navigation
          </h3>
        </div>

        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                ${isActive
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <div className="flex-1">
                <p className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Section d'aide */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h4 className="font-semibold text-gray-900 text-sm">
              Besoin d'aide ?
            </h4>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Consultez notre guide pour bien démarrer
          </p>
          <button className="w-full px-3 py-2 text-xs font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
            Voir le guide
          </button>
        </div>
      </div>
    </aside>
  );
};