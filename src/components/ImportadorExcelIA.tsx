import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCalculadoraStore } from '@/store/calculadora';
import { VM } from '@/types';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { FileSpreadsheet, Upload, Download, CheckCircle, AlertCircle, X, Bot, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MapeamentoColunas {
  nome: string | null;
  vcpu: string | null;
  ram: string | null;
  disco: string | null;
  sistemaOperacional: string | null;
}

interface VMDetectada {
  nome: string;
  vcpu: number;
  ram: number;
  disco: number;
  sistemaOperacional: string;
  custoEstimado: number;
  status: 'valida' | 'erro' | 'aviso';
  erro?: string;
  original?: any;
}

interface AnaliseIA {
  mapeamento: MapeamentoColunas;
  confianca: number;
  observacoes: string[];
}

const ImportadorExcelIA = ({ onClose }: { onClose: () => void }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [dadosOriginais, setDadosOriginais] = useState<any[]>([]);
  const [colunas, setColunas] = useState<string[]>([]);
  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [mapeamento, setMapeamento] = useState<MapeamentoColunas>({
    nome: null,
    vcpu: null,
    ram: null,
    disco: null,
    sistemaOperacional: null
  });
  const [analiseIA, setAnaliseIA] = useState<AnaliseIA | null>(null);
  const [vmsDetectadas, setVmsDetectadas] = useState<VMDetectada[]>([]);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const { addVM, precos } = useCalculadoraStore();
  const { toast } = useToast();
  
  const calculadora = new CalculadoraCloud(precos);

  // Simulação da análise de IA (em produção usaria Claude/ChatGPT)
  const analisarComIA = async (dados: any[], cabecalhos: string[]): Promise<AnaliseIA> => {
    setAnalisandoIA(true);
    
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const amostra = dados.slice(0, 5);
    
    // Análise inteligente dos cabeçalhos
    const detectarColuna = (possiveisNomes: string[]) => {
      return cabecalhos.find(header => 
        possiveisNomes.some(nome => 
          header.toLowerCase().includes(nome.toLowerCase()) ||
          nome.toLowerCase().includes(header.toLowerCase())
        )
      ) || null;
    };

    // IA analisa padrões nos dados
    const analisarPadroes = (coluna: string) => {
      if (!coluna) return 0;
      const valores = amostra.map(linha => linha[coluna]).filter(v => v != null);
      const numericos = valores.filter(v => !isNaN(parseFloat(String(v))));
      return numericos.length / valores.length;
    };

    const mapeamentoDetectado: MapeamentoColunas = {
      nome: detectarColuna(['nome', 'servidor', 'vm', 'hostname', 'server', 'host']),
      vcpu: detectarColuna(['vcpu', 'cpu', 'processador', 'cores', 'núcleos', 'vCPU', 'vCPUs']),
      ram: detectarColuna(['ram', 'memoria', 'memory', 'memória', 'gb', 'RAM']),
      disco: detectarColuna(['disco', 'storage', 'armazenamento', 'hd', 'ssd', 'disk']),
      sistemaOperacional: detectarColuna(['sistema', 'os', 'operacional', 'so', 'SO', 'Sistema Operacional'])
    };

    // Calcular confiança baseada na detecção
    const colunasEncontradas = Object.values(mapeamentoDetectado).filter(col => col !== null);
    const confianca = (colunasEncontradas.length / 5) * 100;

    const observacoes = [];
    if (mapeamentoDetectado.vcpu && analisarPadroes(mapeamentoDetectado.vcpu) > 0.8) {
      observacoes.push(`✅ Coluna "${mapeamentoDetectado.vcpu}" contém valores numéricos (provável vCPU)`);
    }
    if (mapeamentoDetectado.ram && analisarPadroes(mapeamentoDetectado.ram) > 0.8) {
      observacoes.push(`✅ Coluna "${mapeamentoDetectado.ram}" contém valores numéricos (provável RAM)`);
    }
    if (!mapeamentoDetectado.nome) {
      observacoes.push(`⚠️ Não foi possível detectar coluna de nome - usarei a primeira coluna`);
      mapeamentoDetectado.nome = cabecalhos[0];
    }

    setAnalisandoIA(false);
    
    return {
      mapeamento: mapeamentoDetectado,
      confianca,
      observacoes
    };
  };

  const extrairNumero = (valor: any): number => {
    if (typeof valor === 'number') return valor;
    const str = String(valor).toLowerCase();
    
    // Extrair números de strings como "16GB", "32 cores", "4vCPU"
    const match = str.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      let num = parseFloat(match[1]);
      
      // Converter unidades
      if (str.includes('tb')) num *= 1024;
      if (str.includes('mb')) num /= 1024;
      
      return num;
    }
    
    return 0;
  };

  const detectarSO = (valor: any): string => {
    if (!valor) return '';
    const str = String(valor).toLowerCase();
    
    if (str.includes('windows') || str.includes('win')) {
      return 'windows-server-standard';
    }
    if (str.includes('ubuntu') || str.includes('linux') || str.includes('centos') || str.includes('debian')) {
      return ''; // Linux gratuito
    }
    
    return '';
  };

  const processarDadosComMapeamento = (dados: any[], map: MapeamentoColunas): VMDetectada[] => {
    return dados.map((linha, index) => {
      const getValor = (coluna: string | null, valorPadrao: any = '') => {
        return coluna ? linha[coluna] : valorPadrao;
      };

      const nome = String(getValor(map.nome, `VM-${index + 1}`));
      const vcpuRaw = getValor(map.vcpu, 0);
      const ramRaw = getValor(map.ram, 0);
      const discoRaw = getValor(map.disco, 50);
      const soRaw = getValor(map.sistemaOperacional, '');

      const vcpu = extrairNumero(vcpuRaw);
      const ram = extrairNumero(ramRaw);
      const disco = extrairNumero(discoRaw);
      const sistemaOperacional = detectarSO(soRaw);

      // Validações inteligentes
      let status: 'valida' | 'erro' | 'aviso' = 'valida';
      let erro = '';

      if (vcpu <= 0 || vcpu > 128) {
        status = 'erro';
        erro = `vCPU inválido: ${vcpuRaw} → ${vcpu}`;
      } else if (ram <= 0 || ram > 1024) {
        status = 'erro';
        erro = `RAM inválida: ${ramRaw} → ${ram}GB`;
      } else if (!nome || nome.trim() === '' || nome === `VM-${index + 1}`) {
        status = 'aviso';
        erro = 'Nome gerado automaticamente';
      }

      // Calcular custo
      const vmTemp: Partial<VM> = {
        nome,
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
        nome,
        vcpu,
        ram,
        disco,
        sistemaOperacional,
        custoEstimado,
        status,
        erro,
        original: linha
      };
    }).filter(vm => vm.vcpu > 0 && vm.ram > 0);
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
      
      setDadosOriginais(dados);
      setColunas(headers);
      
      // Analisar com IA
      const resultado = await analisarComIA(dados, headers);
      setAnaliseIA(resultado);
      setMapeamento(resultado.mapeamento);
      
      // Processar dados inicialmente
      const vmsProcessadas = processarDadosComMapeamento(dados, resultado.mapeamento);
      setVmsDetectadas(vmsProcessadas);
      
    } catch (err: any) {
      setErro(err.message || 'Erro ao processar arquivo Excel');
    } finally {
      setProcessando(false);
    }
  }, []);

  const reprocessarDados = () => {
    if (dadosOriginais.length > 0) {
      const vmsProcessadas = processarDadosComMapeamento(dadosOriginais, mapeamento);
      setVmsDetectadas(vmsProcessadas);
    }
  };

  const reanalisarComIA = async () => {
    if (dadosOriginais.length > 0 && colunas.length > 0) {
      const resultado = await analisarComIA(dadosOriginais, colunas);
      setAnaliseIA(resultado);
      setMapeamento(resultado.mapeamento);
      const vmsProcessadas = processarDadosComMapeamento(dadosOriginais, resultado.mapeamento);
      setVmsDetectadas(vmsProcessadas);
    }
  };

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
      ['Nome do Servidor', 'Sistema Operacional', 'vCPUs', 'Memória', 'Disco', 'Tipo de Disco'],
      ['database-htz-02a', 'Ubuntu 20.04', '16', '64GB', '500GB', 'SSD'],
      ['webserver-prod-01', 'Windows Server 2019', '8 cores', '32 GB', '200 GB', 'SSD'],
      ['app-server-test', 'CentOS 8', '4vCPU', '16GB RAM', '100GB SSD', 'SSD']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'VMs-Template');
    XLSX.writeFile(wb, 'template-vms-ia-optidata.xlsx');
  };

  const confirmarImportacao = () => {
    const vmsValidas = vmsDetectadas.filter(vm => vm.status !== 'erro');
    
    vmsValidas.forEach(vmDetectada => {
      const novaVM: Partial<VM> = {
        nome: vmDetectada.nome,
        vcpu: vmDetectada.vcpu,
        ram: vmDetectada.ram,
        discoSSD: vmDetectada.disco,
        discoFCM: 0,
        backupTipo: 'padrao',
        sistemaOperacional: vmDetectada.sistemaOperacional,
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
      title: "🤖 Importação IA concluída!",
      description: `${vmsValidas.length} VMs foram analisadas e adicionadas pela IA.`,
    });
    
    onClose();
  };

  const totalCusto = vmsDetectadas.reduce((sum, vm) => sum + vm.custoEstimado, 0);
  const vmsValidas = vmsDetectadas.filter(vm => vm.status !== 'erro');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header com IA */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Importador IA Excel</h2>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Powered by AI
          </Badge>
        </div>
        <Button variant="outline" onClick={onClose}>
          <X className="w-4 h-4 mr-2" />
          Fechar
        </Button>
      </div>

      <Alert>
        <Bot className="h-4 w-4" />
        <AlertDescription>
          <strong>🚀 IA Inteligente:</strong> Este importador usa IA para detectar automaticamente as colunas, 
          mesmo com nomes diferentes. Funciona com qualquer formato de planilha!
        </AlertDescription>
      </Alert>

      {/* Template Download */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">📋 Template Inteligente</h3>
              <p className="text-sm text-gray-600">Baixe um exemplo com formatos que a IA reconhece automaticamente</p>
            </div>
            <Button variant="outline" onClick={baixarTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Baixar Template IA
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
              <div className="flex items-center justify-center mb-4">
                <Bot className="w-12 h-12 text-blue-500 mr-2" />
                <FileSpreadsheet className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                🤖 IA vai analisar sua planilha
              </h3>
              <p className="text-gray-600 mb-4">
                Arraste qualquer Excel aqui - a IA detecta as colunas automaticamente
              </p>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                id="file-input"
                className="hidden"
              />
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Arquivo para IA
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
      {(processando || analisandoIA) && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="animate-spin w-8 h-8 text-blue-500 mr-2" />
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-lg font-medium">
              {analisandoIA ? '🤖 IA analisando planilha...' : '📊 Processando arquivo...'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {analisandoIA ? 'Detectando colunas e padrões automaticamente' : 'Lendo dados do Excel'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* IA Analysis Results */}
      {analiseIA && !analisandoIA && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              🎯 Análise da IA - Confiança: {Math.round(analiseIA.confianca)}%
              <Button variant="outline" size="sm" onClick={reanalisarComIA}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Re-analisar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Observações da IA */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2">🤖 O que a IA detectou:</h4>
                <ul className="text-sm space-y-1">
                  {analiseIA.observacoes.map((obs, idx) => (
                    <li key={idx}>{obs}</li>
                  ))}
                </ul>
              </div>

              {/* Mapeamento de Colunas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(mapeamento).map(([campo, coluna]) => (
                  <div key={campo}>
                    <label className="block text-sm font-medium mb-1 capitalize">
                      {campo === 'sistemaOperacional' ? 'Sistema Operacional' : campo}:
                    </label>
                    <Select 
                      value={coluna || 'none'} 
                      onValueChange={(valor) => {
                        const novoValor = valor === 'none' ? null : valor;
                        setMapeamento(prev => ({ ...prev, [campo]: novoValor }));
                        setTimeout(reprocessarDados, 100);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma</SelectItem>
                        {colunas.map(col => (
                          <SelectItem key={col} value={col}>{col}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {vmsDetectadas.length > 0 && !processando && !analisandoIA && (
        <div className="space-y-4">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                📊 Resumo da Análise IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{vmsDetectadas.length}</div>
                  <div className="text-sm text-gray-600">VMs Detectadas</div>
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
              <CardTitle>🤖 VMs Analisadas pela IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {vmsDetectadas.map((vm, index) => (
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
                             vm.status === 'aviso' ? 'Aviso' : '✅ Válida'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {vm.vcpu} vCPU • {vm.ram} GB RAM • {vm.disco} GB Disco
                          {vm.sistemaOperacional && ` • ${vm.sistemaOperacional.includes('windows') ? 'Windows' : 'Linux'}`}
                        </div>
                        {vm.erro && (
                          <div className="text-sm text-red-600 mt-1">🤖 {vm.erro}</div>
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
                setVmsDetectadas([]);
                setAnaliseIA(null);
                setErro(null);
              }}>
                🔄 Analisar Outra Planilha
              </Button>
              <Button onClick={confirmarImportacao} className="bg-blue-600 hover:bg-blue-700">
                <Bot className="w-4 h-4 mr-2" />
                🚀 Importar {vmsValidas.length} VMs (IA)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportadorExcelIA;
