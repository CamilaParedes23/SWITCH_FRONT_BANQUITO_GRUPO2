import { StateHistory } from '../../types';
import { Circle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface StateTimelineProps {
  history: StateHistory[];
}

export function StateTimeline({ history }: StateTimelineProps) {
  const getIcon = (state: string) => {
    if (state.includes('RECHAZADO') || state.includes('ANULADO')) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    if (state === 'CERRADO' || state.includes('PROCESADO')) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (state.includes('VALIDANDO') || state.includes('PROCESANDO')) {
      return <Clock className="w-5 h-5 text-blue-500" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="space-y-4">
      {history.map((entry, index) => (
        <div key={entry.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            {getIcon(entry.newState)}
            {index < history.length - 1 && (
              <div className="w-px h-12 bg-gray-300 my-1"></div>
            )}
          </div>
          <div className="flex-1 pb-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-medium text-gray-900">
                {entry.previousState || 'INICIAL'} → {entry.newState}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(entry.timestamp).toLocaleString('es-EC')}
              </span>
            </div>
            <p className="text-sm text-gray-600">{entry.reason}</p>
            <p className="text-xs text-gray-500 mt-1">
              {entry.actorType}: {entry.actor}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
