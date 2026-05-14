export type UserRole = 'EMPRESA' | 'OPERADOR' | 'AUDITOR' | 'ADMIN';

export type BatchStatus =
  | 'RECIBIDO'
  | 'VALIDANDO'
  | 'VALIDADO'
  | 'RECHAZADO'
  | 'ENCOLADO'
  | 'PROCESANDO'
  | 'PROCESADO_PARCIAL'
  | 'PROCESADO_TOTAL'
  | 'CERRADO'
  | 'ANULADO';

export type ServiceType = 'NOM' | 'PRV';

export type Channel = 'PORTAL_WEB' | 'SFTP';

export type LineStatus = 'PENDIENTE' | 'EXITOSA' | 'RECHAZADA' | 'FALLIDA';

export type NotificationStatus = 'PENDIENTE' | 'ENVIADA' | 'ERROR' | 'CANCELADA';

export type NotificationType = 'PAGO_EXITOSO' | 'PAGO_RECHAZADO';

export type SettlementStatus = 'PENDIENTE' | 'COMPLETADO' | 'RECHAZADO';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  companyName?: string;
  companyRuc?: string;
  email: string;
}

export interface Batch {
  id: string;
  fileName: string;
  fileHash: string;
  serviceType: ServiceType;
  channel: Channel;
  companyRuc: string;
  companyName: string;
  accountNumber: string;
  declaredTotal: number;
  validatedTotal?: number;
  totalRecords: number;
  successfulRecords?: number;
  rejectedRecords?: number;
  status: BatchStatus;
  receptionDate: string;
  processingDate?: string;
  closingDate?: string;
  rejectionReason?: string;
  scheduledDate?: string;
  processedLines?: number;
}

export interface PaymentLine {
  id: string;
  batchId: string;
  lineNumber: number;
  beneficiaryName: string;
  beneficiaryId: string;
  destinationAccount: string;
  destinationBank: string;
  amount: number;
  status: LineStatus;
  errorCode?: string;
  errorMessage?: string;
  switchUuid?: string;
  debitUuid?: string;
  creditUuid?: string;
  processedDate?: string;
}

export interface ServiceTypeConfig {
  codigo: string;
  nombre: string;
  descripcion: string;
  estado: string;
}

export interface TransactionLimit {
  id: string;
  serviceType: ServiceType;
  minAmount: number;
  maxAmount: number;
  currency: string;
  validFrom: string;
  validTo?: string;
  active: boolean;
}

export interface Tariff {
  id: string;
  serviceType: ServiceType;
  rangeFrom: number;
  rangeTo: number | null;
  unitRate: number;
  validFrom: string;
  validTo?: string;
  active: boolean;
}

export interface SystemParameter {
  code: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'TIME';
  description: string;
}

export interface StateHistory {
  id: string;
  batchId: string;
  previousState: BatchStatus | null;
  newState: BatchStatus;
  reason?: string;
  actor: string;
  actorType: 'EMPRESA' | 'USUARIO_CORE' | 'SISTEMA' | 'API';
  timestamp: string;
}

export interface QueueItem {
  id: string;
  batchId: string;
  batch: Batch;
  scheduledDate: string;
  scheduledTime: string;
  priority: number;
  attempts: number;
  queueStatus: 'ENCOLADO' | 'PROCESANDO' | 'COMPLETADO' | 'ERROR';
}

export interface QueueAttempt {
  id: string;
  queueId: string;
  attemptNumber: number;
  startDate: string;
  endDate?: string;
  status: 'EN_PROCESO' | 'EXITOSO' | 'ERROR';
  errorCode?: string;
  coreResponse?: any;
}

export interface Settlement {
  id: string;
  batchId: string;
  successfulTransactions: number;
  appliedUnitRate: number;
  commissionSubtotal: number;
  ivaAmount: number;
  totalDebited: number;
  debitStatus: SettlementStatus;
  debitDate?: string;
  debitAccountMovementId?: string;
}

export interface Notification {
  id: string;
  batchId: string;
  lineId: string;
  beneficiaryEmail: string;
  beneficiaryName: string;
  type: NotificationType;
  status: NotificationStatus;
  sentDate?: string;
  retries: number;
  errorMessage?: string;
}

export interface Report {
  id: string;
  batchId: string;
  type: 'COMPROBANTE_LIQUIDACION' | 'REPORTE_NOVEDADES';
  generationDate: string;
  downloadedByCompany: boolean;
  downloadDate?: string;
  format: 'PDF' | 'CSV' | 'XLSX' | 'JSON';
  fileUrl: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorType: 'EMPRESA' | 'USUARIO_CORE' | 'SISTEMA' | 'API';
  actorId: string;
  companyRuc?: string;
  action: string;
  entity: string;
  entityId: string;
  ipAddress: string;
  correlationId: string;
}

export interface SystemHealth {
  switchStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  postgresStatus: 'CONNECTED' | 'DISCONNECTED';
  coreIntegrationStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  smtpIntegrationStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  lastCheckTimestamp: string;
}

export interface DashboardSummary {
  processedBatches: number;
  enqueuedBatches: number;
  rejectedBatches: number;
  totalDispersed: number;
  totalCommissions: number;
  failedBatches: number;
  batchesPerDay: Array<{ date: string; count: number }>;
}
