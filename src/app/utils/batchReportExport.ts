function csvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsvRow(cells: unknown[]): string {
  return cells.map(csvCell).join(',');
}

export type ReporteNovedadesApi = {
  uuidLote?: string;
  tipoReporte?: string;
  formato?: string;
  fechaGeneracion?: string;
  resumen?: {
    totalLineas?: number;
    exitosas?: number;
    rechazadas?: number;
    fallidas?: number;
  };
  lineas?: Array<{
    secuencial?: number;
    estado?: string;
    codigoError?: string | null;
    mensajeError?: string | null;
    monto?: number | string;
    cuentaDestino?: string;
    nombreBeneficiario?: string;
  }>;
};

export type ComprobanteLiquidacionApi = {
  uuidLote?: string;
  tipoReporte?: string;
  formato?: string;
  fechaGeneracion?: string;
  empresa?: { rucEmpresa?: string; cuentaMatrizCargo?: string };
  resumenPagos?: {
    transaccionesExitosas?: number;
    transaccionesRechazadas?: number;
    montoTotalDispersado?: number | string;
  };
  liquidacionServicio?: {
    tarifaUnitariaAplicada?: number | string;
    subtotalComision?: number | string;
    ivaPorcentajeAplicado?: number | string;
    montoIva?: number | string;
    totalDebitado?: number | string;
  };
};

export function reporteNovedadesToCsv(data: ReporteNovedadesApi): string {
  const lines: string[] = [];
  lines.push('# Reporte de novedades — Switch BanQuito');
  lines.push(toCsvRow(['uuidLote', data.uuidLote ?? '']));
  lines.push(toCsvRow(['tipoReporte', data.tipoReporte ?? '']));
  lines.push(toCsvRow(['fechaGeneracion', data.fechaGeneracion ?? '']));
  lines.push('');
  lines.push(toCsvRow(['totalLineas', 'exitosas', 'rechazadas', 'fallidas']));
  const r = data.resumen;
  lines.push(
    toCsvRow([r?.totalLineas ?? '', r?.exitosas ?? '', r?.rechazadas ?? '', r?.fallidas ?? ''])
  );
  lines.push('');
  lines.push(
    toCsvRow([
      'secuencial',
      'estado',
      'codigoError',
      'mensajeError',
      'monto',
      'cuentaDestino',
      'nombreBeneficiario',
    ])
  );
  for (const l of data.lineas ?? []) {
    lines.push(
      toCsvRow([
        l.secuencial ?? '',
        l.estado ?? '',
        l.codigoError ?? '',
        l.mensajeError ?? '',
        l.monto ?? '',
        l.cuentaDestino ?? '',
        l.nombreBeneficiario ?? '',
      ])
    );
  }
  return lines.join('\r\n');
}

export function comprobanteLiquidacionToCsv(data: ComprobanteLiquidacionApi): string {
  const lines: string[] = [];
  lines.push('# Comprobante de liquidación corporativa — Switch BanQuito');
  lines.push(toCsvRow(['uuidLote', data.uuidLote ?? '']));
  lines.push(toCsvRow(['fechaGeneracion', data.fechaGeneracion ?? '']));
  lines.push('');
  lines.push(toCsvRow(['rucEmpresa', 'cuentaMatrizCargo']));
  lines.push(
    toCsvRow([data.empresa?.rucEmpresa ?? '', data.empresa?.cuentaMatrizCargo ?? ''])
  );
  lines.push('');
  lines.push(
    toCsvRow(['transaccionesExitosas', 'transaccionesRechazadas', 'montoTotalDispersado'])
  );
  const rp = data.resumenPagos;
  lines.push(
    toCsvRow([
      rp?.transaccionesExitosas ?? '',
      rp?.transaccionesRechazadas ?? '',
      rp?.montoTotalDispersado ?? '',
    ])
  );
  lines.push('');
  lines.push(
    toCsvRow([
      'tarifaUnitariaAplicada',
      'subtotalComision',
      'ivaPorcentajeAplicado',
      'montoIva',
      'totalDebitado',
    ])
  );
  const liq = data.liquidacionServicio;
  lines.push(
    toCsvRow([
      liq?.tarifaUnitariaAplicada ?? '',
      liq?.subtotalComision ?? '',
      liq?.ivaPorcentajeAplicado ?? '',
      liq?.montoIva ?? '',
      liq?.totalDebitado ?? '',
    ])
  );
  return lines.join('\r\n');
}

export function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
