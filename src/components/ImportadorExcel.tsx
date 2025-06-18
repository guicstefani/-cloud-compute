
import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useCalculadoraStore } from '@/store/calculadora';
import { VM } from '@/types';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { FileSpreadsheet, Upload, Download, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VMImportada {
  nome: string;
  vcpu: number;
  ram: number;
  disco: number;
  sistemaOperacional: string;
  custoEstimado: number;
  status: 'valida' | 'erro' | 'aviso';
  erro?: string;
}

const ImportadorExcel = ({ onClose }: { onClose: () => void }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [vmsImportadas, setVmsImportadas] = useState<VMImportada[]>([]);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const { addVM, precos } = useCalculadoraStore();
  const { toast } = useToast();
  
  const calculadora = new CalculadoraCloud(precos);

  const detectarColuna = (headers: string[], possiveisNomes: string[]): string | null => {
    const header = headers.find(h => 
      possiveisNomes.some(nome => 
        h.toLowerCase().includes(nome.toLowerCase())
      )
    );
    return header || null;
  };

  const processarExcel = useCallback(async (file: File) => {
    setProcessando(true);
    setErro(null);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      
      if (jsonData.length < 2) {
        throw new Error('Arquivo deve conter pelo menos uma linha de cabeçalho e uma de dados');
      }
      
      const headers = jsonData[0] as string[];
      const dados = jsonData.slice(1);
      
      // Detectar colunas automaticamente
      const colunaNome = detectarColuna(headers, ['nome', 'servidor', 'vm', 'host']);
      const colunaVCPU = detectarColuna(headers, ['vcpu', 'cpu', 'processador', 'cores']);
      const colunaRAM = detectarColuna(headers, ['ram', 'memoria', 'memory', 'mb', 'gb']);
      const colunaDisco = detectarColuna(headers, ['disco', 'storage', 'armazenamento', 'hd', 'ssd']);
      const colunaSO = detectarColuna(headers, ['sistema', 'os', 'operacional', 'so']);
      
      if (!colunaVCPU || !colunaRAM) {
        throw new Error('Não foi possível identificar as colunas de vCPU e RAM. Verifique se o arquivo contém essas informações.');
      }
      
      const vmsProcessadas: VMImportada[] = dados.map((linha, index) => {
        const getValor = (coluna: string | null, valorPadrao: any = '') => {
          if (!coluna) return valorPadrao;
          const idx = headers.indexOf(coluna);
          return idx >= 0 ? linha[idx] : valorPadrao;
        };
        
        const nome = getValor(colunaNome, `VM-${index + 1}`);
        const vcpuRaw = getValor(colunaVCPU, 0);
        const ramRaw = getValor(colunaRAM, 0);
        const discoRaw = getValor(colunaDisco, 50);
        const soRaw = getValor(colunaSO, '');
        
        // Converter valores
        const vcpu = parseInt(String(vcpuRaw)) || 0;
        const ram = parseInt(String(ramRaw)) || 0;
        const disco = parseInt(String(discoRaw)) || 50;
        const so = String(soRaw).toLowerCase();
        
        // Detectar sistema operacional
        let sistemaOperacional = '';
        if (so.includes('windows') || so.includes('win')) {
          sistemaOperacional = 'windows-server-standard';
        } else if (so.includes('ubuntu') || so.includes('linux') || so.includes('centos') || so.includes('debian')) {
          sistemaOperacional = ''; // Linux gratuito
        }
        
        // Validações
        let status: 'valida' | 'erro' | 'aviso' = 'valida';
        let erro = '';
        
        if (vcpu <= 0 || vcpu > 128) {
          status = 'erro';
          erro = 'vCPU deve estar entre 1 e 128';
        } else if (ram <= 0 || ram > 1024) {
          status = 'erro';
          erro = 'RAM deve estar entre 1 e 1024 GB';
        } else if (!nome || nome.toString().trim() === '') {
          status = 'aviso';
          erro = 'Nome gerado automaticamente';
        }
        
        // Calcular custo estimado
        const vmTemp: Partial<VM> = {
          nome: String(nome),
          vcpu,
          ram,
          discoSSD: disco,
          discoFCM: 0,
          backupTipo: 'padrao',
          sistemaOperacional,
          bancoDados: '',
          antivirus: false,
          tsplus: { enabled: false, usuarios: 5, advancedSecurity: false, twoFactor: false },
          thinprint: false,
          ipsAdicionais: 0,
          waf: 'none',
          descontoIndividual: 0
        };
        
        const custoEstimado = calculadora.calcularVM(vmTemp as VM).total;
        
        return {
          nome: String(nome),
          vcpu,
          ram,
          disco,
          sistemaOperacional,
          custoEstimado,
          status,
          erro
        };
      }).filter(vm => vm.vcpu > 0 && vm.ram > 0);
      
      if (vmsProcessadas.length === 0) {
        throw new Error('Nenhuma VM válida foi encontrada no arquivo');
      }
      
      if (vmsProcessadas.length > 100) {
        throw new Error('Máximo de 100 VMs por importação');
      }
      
      setVmsImportadas(vmsProcessadas);
      
    } catch (err: any) {
      setErro(err.message || 'Erro ao processar arquivo Excel');
    } finally {
      setProcessando(false);
    }
  }, [calculadora]);

  const handleFileSelect = (file: File) => {
    const extensao = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls'].includes(extensao || '')) {
      setErro('Apenas arquivos Excel (.xlsx, .xls) são aceitos');
      return;
    }
    
    setArquivo(file);
    processarExcel(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const baixarTemplate = () => {
    const template = [
      ['Nome do Servidor', 'Sistema Operacional', 'vCPU', 'Memória (GB)', 'Disco (GB)', 'Tipo de Disco'],
      ['servidor-web-01', 'Ubuntu 20.04', 4, 8, 100, 'SSD'],
      ['servidor-db-01', 'Windows Server 2019', 8, 32, 500, 'SSD'],
      ['servidor-app-01', 'CentOS 8', 2, 4, 50, 'SSD']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'VMs');
    XLSX.writeFile(wb, 'template-vms-optidata.xlsx');
  };

  const confirmarImportacao = () => {
    const vmsValidas = vmsImportadas.filter(vm => vm.status !== 'erro');
    
    vmsValidas.forEach(vmImportada => {
      const novaVM: Partial<VM> = {
        nome: vmImportada.nome,
        vcpu: vmImportada.vcpu,
        ram: vmImportada.ram,
        discoSSD: vmImportada.disco,
        discoFCM: 0,
        backupTipo: 'padrao',
        sistemaOperacional: vmImportada.sistemaOperacional,
        bancoDados: '',
        antivirus: false,
        tsplus: { enabled: false, usuarios: 5, advancedSecurity: false, twoFactor: false },
        thinprint: false,
        ipsAdicionais: 0,
        waf: 'none',
        descontoIndividual: 0,
        status: 'rascunho'
      };
      
      addVM(novaVM);
    });
    
    toast({
      title: "Importação concluída!",
      description: `${vmsValidas.length} VMs foram adicionadas à calculadora.`,
    });
    
    onClose();
  };

  const totalCusto = vmsImportadas.reduce((sum, vm) => sum + vm.custoEstimado, 0);
  const vmsValidas = vmsImportadas.filter(vm => vm.status !== 'erro');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Importar VMs do Excel</h2>
          <p className="text-gray-600">Importe múltiplas VMs de uma planilha Excel</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          <X className="w-4 h-4 mr-2" />
          Fechar
        </Button>
      </div>

      {/* Template Download */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Não tem um arquivo Excel?</h3>
              <p className="text-sm text-gray-600">Baixe nosso template com exemplos de formatação</p>
            </div>
            <Button variant="outline" onClick={baixarTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Baixar Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      {!arquivo && (
        <Card>
          <CardContent className="p-8">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Arraste seu arquivo Excel aqui
              </h3>
              <p className="text-gray-600 mb-4">
                ou clique para selecionar um arquivo (.xlsx, .xls)
              </p>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                id="file-input"
                className="hidden"
              />
              <Button asChild>
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Arquivo
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {erro && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}

      {/* Processing */}
      {processando && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Processando arquivo Excel...</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {vmsImportadas.length > 0 && !processando && (
        <div className="space-y-4">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Resumo da Importação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{vmsImportadas.length}</div>
                  <div className="text-sm text-gray-600">VMs Encontradas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{vmsValidas.length}</div>
                  <div className="text-sm text-gray-600">VMs Válidas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalCusto)}</div>
                  <div className="text-sm text-gray-600">Custo Total/Mês</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* VMs List */}
          <Card>
            <CardHeader>
              <CardTitle>VMs Identificadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {vmsImportadas.map((vm, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    vm.status === 'erro' ? 'border-red-200 bg-red-50' :
                    vm.status === 'aviso' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{vm.nome}</h4>
                          <Badge variant={
                            vm.status === 'erro' ? 'destructive' :
                            vm.status === 'aviso' ? 'secondary' : 'default'
                          }>
                            {vm.status === 'erro' ? 'Erro' :
                             vm.status === 'aviso' ? 'Aviso' : 'Válida'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {vm.vcpu} vCPU • {vm.ram} GB RAM • {vm.disco} GB Disco
                          {vm.sistemaOperacional && ` • ${vm.sistemaOperacional.includes('windows') ? 'Windows' : 'Linux'}`}
                        </div>
                        {vm.erro && (
                          <div className="text-sm text-red-600 mt-1">{vm.erro}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(vm.custoEstimado)}</div>
                        <div className="text-sm text-gray-600">por mês</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {vmsValidas.length > 0 && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setArquivo(null);
                setVmsImportadas([]);
                setErro(null);
              }}>
                Tentar Novamente
              </Button>
              <Button onClick={confirmarImportacao} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Importar {vmsValidas.length} VMs
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportadorExcel;
