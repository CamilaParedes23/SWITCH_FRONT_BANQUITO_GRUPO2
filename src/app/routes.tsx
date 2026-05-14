import { createBrowserRouter } from 'react-router';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { BatchList } from './pages/batches/BatchList';
import { BatchUpload } from './pages/batches/BatchUpload';
import { BatchDetail } from './pages/batches/BatchDetail';
import { ProcessingQueue } from './pages/queue/ProcessingQueue';
import { NotificationList } from './pages/notifications/NotificationList';
import { ServiceTypes } from './pages/config/ServiceTypes';
import { TransactionLimits } from './pages/config/TransactionLimits';
import { Tariffs } from './pages/config/Tariffs';
import { SystemParameters } from './pages/config/SystemParameters';
import { AuditTrail } from './pages/audit/AuditTrail';
import { SystemHealth } from './pages/health/SystemHealth';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'batches', Component: BatchList },
      { path: 'batches/all', Component: BatchList },
      { path: 'batches/upload', Component: BatchUpload },
      { path: 'batches/:id', Component: BatchDetail },
      { path: 'queue', Component: ProcessingQueue },
      { path: 'notifications', Component: NotificationList },
      { path: 'config/services', Component: ServiceTypes },
      { path: 'config/limits', Component: TransactionLimits },
      { path: 'config/tariffs', Component: Tariffs },
      { path: 'config/parameters', Component: SystemParameters },
      { path: 'audit', Component: AuditTrail },
      { path: 'health', Component: SystemHealth },
    ],
  },
]);
