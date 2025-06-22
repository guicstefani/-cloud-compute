
/**
 * LegacyBridge - Ponte segura entre código novo e antigo
 * Este arquivo é a ÚNICA conexão permitida com código legado
 */

export class LegacyBridge {
  private static instance: LegacyBridge;
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new LegacyBridge();
    }
    return this.instance;
  }
  
  // Método seguro para acessar cálculos legados
  async calculateVM(vmData: any): Promise<any> {
    try {
      // Importa dinamicamente para evitar quebrar se o código legado tiver problemas
      const { CalculadoraCloud } = await import('../../utils/calculadora');
      const calculadora = new CalculadoraCloud(vmData.precos || {});
      return calculadora.calcularVM(vmData);
    } catch (error) {
      console.error('Erro no código legado:', error);
      // Retorna resultado padrão se falhar
      return { 
        total: 0, 
        error: true, 
        message: 'Erro no cálculo - usando valores padrão' 
      };
    }
  }
  
  // Método seguro para gerar PDF
  async generatePDF(data: any): Promise<Blob | null> {
    try {
      const { gerarPDFProposta } = await import('../../utils/pdfGenerator');
      return gerarPDFProposta(data);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      return null;
    }
  }
  
  // Método para acessar store legado de forma segura
  getLegacyStore(): any {
    try {
      // Evita importação direta do store problemático
      if (typeof window !== 'undefined' && (window as any).__LEGACY_STORE__) {
        return (window as any).__LEGACY_STORE__;
      }
      return null;
    } catch (error) {
      console.error('Erro ao acessar store legado:', error);
      return null;
    }
  }
}
