
import { SistemaOperacional, BancoDados } from '@/types';

// Import from focused files
import { sistemasWindows } from './sistemas/windows';
import { linuxEnterprise, linuxGratuitos } from './sistemas/linux';
import { sqlServer } from './bancos/sqlserver';
import { oracle } from './bancos/oracle';
import { bancosGratuitos, bancosEnterprise } from './bancos/opensource';

// Re-export individual categories
export { sistemasWindows, linuxEnterprise, linuxGratuitos };
export { sqlServer, oracle, bancosGratuitos, bancosEnterprise };

// Export combined arrays for backward compatibility
export const todosSistemasOperacionais = [
  ...sistemasWindows,
  ...linuxEnterprise,
  ...linuxGratuitos
];

export const todosBancosDados = [
  ...sqlServer,
  ...oracle,
  ...bancosGratuitos,
  ...bancosEnterprise
];
