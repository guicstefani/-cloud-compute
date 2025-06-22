
/**
 * SafeSupabase - Cliente Supabase isolado e seguro
 * Pode ser adicionado sem quebrar o código existente
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface OfflineData {
  table: string;
  data: any;
  operation: 'insert' | 'update' | 'delete';
  timestamp: number;
}

class SafeSupabaseService {
  private client: SupabaseClient | null = null;
  private initialized = false;
  private offlineQueue: OfflineData[] = [];
  
  initialize() {
    if (this.initialized) return;
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase não configurado - funcionando em modo offline');
        return;
      }
      
      this.client = createClient(supabaseUrl, supabaseKey);
      this.initialized = true;
      
      // Sincroniza dados offline se houver
      this.syncOfflineQueue();
      
      console.log('✅ Supabase inicializado com sucesso');
    } catch (error) {
      console.error('❌ Falha ao inicializar Supabase:', error);
      // Continua funcionando em modo offline
    }
  }
  
  // Método seguro para salvar dados
  async save(table: string, data: any) {
    if (!this.client) {
      // Modo offline - salva no localStorage
      return this.saveOffline(table, data, 'insert');
    }
    
    try {
      const result = await this.client.from(table).insert(data).select();
      return { data: result.data, error: result.error, offline: false };
    } catch (error) {
      console.error(`Erro ao salvar em ${table}:`, error);
      // Fallback para offline
      return this.saveOffline(table, data, 'insert');
    }
  }
  
  // Método seguro para buscar dados
  async fetch(table: string, filters?: any) {
    if (!this.client) {
      return this.fetchOffline(table);
    }
    
    try {
      let query = this.client.from(table).select('*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      const result = await query;
      return { data: result.data, error: result.error, offline: false };
    } catch (error) {
      console.error(`Erro ao buscar ${table}:`, error);
      return this.fetchOffline(table);
    }
  }
  
  // Salva dados offline
  private saveOffline(table: string, data: any, operation: 'insert' | 'update' | 'delete') {
    try {
      // Adiciona à fila offline
      this.offlineQueue.push({
        table,
        data: { ...data, id: Date.now() }, // ID temporário
        operation,
        timestamp: Date.now(),
      });
      
      // Salva no localStorage
      const key = `offline_${table}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ ...data, _offline: true, _timestamp: Date.now() });
      localStorage.setItem(key, JSON.stringify(existing));
      
      return { 
        data: [{ ...data, id: Date.now() }], 
        error: null, 
        offline: true 
      };
    } catch (error) {
      return { data: null, error, offline: true };
    }
  }
  
  // Busca dados offline
  private fetchOffline(table: string) {
    try {
      const key = `offline_${table}`;
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      return { data, error: null, offline: true };
    } catch (error) {
      return { data: [], error, offline: true };
    }
  }
  
  // Sincroniza dados offline quando Supabase voltar
  private async syncOfflineQueue() {
    if (!this.client || this.offlineQueue.length === 0) return;
    
    console.log(`🔄 Sincronizando ${this.offlineQueue.length} itens offline...`);
    
    for (const item of this.offlineQueue) {
      try {
        switch (item.operation) {
          case 'insert':
            await this.client.from(item.table).insert(item.data);
            break;
          case 'update':
            await this.client.from(item.table).update(item.data).eq('id', item.data.id);
            break;
          case 'delete':
            await this.client.from(item.table).delete().eq('id', item.data.id);
            break;
        }
      } catch (error) {
        console.error(`Erro ao sincronizar item ${item.table}:`, error);
      }
    }
    
    // Limpa a fila após sincronização
    this.offlineQueue = [];
    console.log('✅ Sincronização offline concluída');
  }
  
  // Verifica se está online
  isOnline(): boolean {
    return this.initialized && this.client !== null;
  }
  
  // Getter para acessar o cliente diretamente quando necessário
  get rawClient(): SupabaseClient | null {
    return this.client;
  }
}

// Singleton
export const safeSupabase = new SafeSupabaseService();

// Auto-inicializa se as variáveis estiverem disponíveis
if (typeof window !== 'undefined') {
  safeSupabase.initialize();
}
