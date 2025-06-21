import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { VM } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import VMDiscountSection from '@/components/VMDiscountSection';
import TouchInput from '@/components/TouchInput';
import CollapsibleCard from '@/components/CollapsibleCard';
import SistemaOperacionalButton from '@/components/SistemaOperacionalButton';
import BancoDadosButton from '@/components/BancoDadosButton';
import PremiumButton from '@/components/PremiumButton';
import PremiumInput from '@/components/PremiumInput';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Shield, 
  Database, 
  Users,
  Monitor,
  Server,
  AlertTriangle,
  Terminal,
  Info,
  Check,
  Heart,
  Zap,
  Tag,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { 
  sistemasWindows,
  linuxEnterprise,
  linuxGratuitos,
  sqlServer,
  oracle,
  bancosGratuitos,
  bancosEnterprise,
  todosSistemasOperacionais,
  todosBancosDados
} from '@/data/sistemasOperacionais';
import React from 'react';

interface VMConfiguratorProps {
  vm: VM;
  calculadora: CalculadoraCloud;
}

const VMConfigurator = ({ vm, calculadora }: VMConfiguratorProps) => {
  const { updateVM } = useCalculadoraStore();
  const custo = calculadora.calcularVM(vm);

  const handleUpdate = (updates: Partial<VM>) => {
    updateVM(vm.id, updates);
  };

  // Auto-seleção do antivírus quando Windows é selecionado
  React.useEffect(() => {
    const so = getSistemaOperacionalSelecionado();
    if (so && so.categoria === 'windows' && !vm.antivirus) {
      handleUpdate({ antivirus: true });
    }
  }, [vm.sistemaOperacional]);

  // Função para toggle de banco de dados
  const handleBancoDadosToggle = (bancoDadosId: string) => {
    if (vm.bancoDados === bancoDadosId) {
      // Se já está selecionado, deseleciona
      handleUpdate({ bancoDados: '' });
    } else {
      // Se não está selecionado ou é diferente, seleciona
      handleUpdate({ bancoDados: bancoDadosId });
    }
  };

  // Função para calcular apenas a infraestrutura (sem licenças)
  const calcularInfraestrutura = () => {
    return custo.vcpu + custo.ram + custo.storage + custo.backup + custo.monitoramento;
  };

  // Função para encontrar o SO selecionado
  const getSistemaOperacionalSelecionado = () => {
    return todosSistemasOperacionais.find(so => so.id === vm.sistemaOperacional);
  };

  // Função para encontrar o BD selecionado
  const getBancoDadosSelecionado = () => {
    return todosBancosDados.find(bd => bd.id === vm.bancoDados);
  };

  const getOSIcon = () => {
    const so = getSistemaOperacionalSelecionado();
    return so?.icon || '💻';
  };

  // Performance Score calculation
  const calculatePerformanceScore = () => {
    let score = 0;
    const ratio = vm.ram / vm.vcpu;
    
    // Optimal ratio bonus
    if (ratio >= 2 && ratio <= 8) score += 25;
    
    // Storage balance bonus  
    if (vm.discoSSD > 0 && vm.discoFCM > 0) score += 20;
    else if (vm.discoSSD > 0) score += 15;
    
    // Backup bonus
    if (vm.backupTipo === 'triplo') score += 20;
    else if (vm.backupTipo === 'duplo') score += 15;
    else score += 10;
    
    // Security bonus
    if (vm.antivirus) score += 10;
    if (vm.waf !== 'none') score += 15;
    
    // Total possible: 100
    return Math.min(100, score);
  };

  const performanceScore = calculatePerformanceScore();

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Enhanced VM Header with Performance Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <CollapsibleCard
          title={vm.nome || 'Nova VM'}
          icon={<span className="text-xl">{getOSIcon()}</span>}
          subtitle={`${vm.vcpu} vCPU • ${vm.ram}GB RAM`}
          value={formatCurrency(custo.total)}
          defaultExpanded
          className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-white"
        >
          <div className="space-y-4">
            <PremiumInput
              value={vm.nome}
              onChange={(value) => handleUpdate({ nome: value })}
              placeholder="Nome da VM"
              icon={<Server className="w-4 h-4" />}
            />
            
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {vm.status === 'rascunho' ? 'Rascunho' : 'Finalizada'}
                </Badge>
                {vm.descontoIndividual > 0 && (
                  <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                    Desconto {vm.descontoIndividual}%
                  </Badge>
                )}
              </div>
              
              {/* Performance Score Badge */}
              <motion.div
                className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                <Target className="w-4 h-4" />
                <span>Score: {performanceScore}/100</span>
                {performanceScore >= 80 && <Sparkles className="w-4 h-4" />}
              </motion.div>
            </div>

            {custo.descontoIndividual > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">Economia: {formatCurrency(custo.descontoIndividual)}</span>
                </div>
              </motion.div>
            )}
          </div>
        </CollapsibleCard>
      </motion.div>

      {/* Enhanced Recursos Computacionais */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CollapsibleCard
          title="Recursos Computacionais"
          icon={<Cpu className="w-6 h-6 text-blue-500" />}
          value={formatCurrency(custo.vcpu + custo.ram)}
          defaultExpanded
          className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"
        >
          <div className="space-y-6">
            <TouchInput
              label="vCPU"
              icon={<Cpu className="w-4 h-4 text-optidata-gray-500" />}
              value={vm.vcpu}
              onChange={(value) => handleUpdate({ vcpu: value })}
              min={1}
              max={128}
              calculation={`${vm.vcpu} × R$ 0,0347 × 720h`}
              calculatedValue={formatCurrency(custo.vcpu)}
            />

            <TouchInput
              label="RAM"
              icon={<MemoryStick className="w-4 h-4 text-optidata-gray-500" />}
              value={vm.ram}
              onChange={(value) => handleUpdate({ ram: value })}
              min={1}
              max={1024}
              unit="GB"
              calculation={`${vm.ram}GB × R$ 0,0278 × 720h`}
              calculatedValue={formatCurrency(custo.ram)}
            />

            {vm.ram / vm.vcpu < 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <div className="flex items-center space-x-2 text-amber-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">
                    Proporção vCPU/RAM baixa. Recomendado: 1:2 a 1:8
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </CollapsibleCard>
      </motion.div>

      {/* Enhanced Armazenamento */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CollapsibleCard
          title="Armazenamento"
          icon={<HardDrive className="w-6 h-6 text-purple-500" />}
          value={formatCurrency(custo.storage + custo.backup)}
          className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
        >
          <div className="space-y-6">
            <TouchInput
              label="Disco FCM"
              icon={<HardDrive className="w-4 h-4 text-optidata-gray-500" />}
              value={vm.discoFCM}
              onChange={(value) => handleUpdate({ discoFCM: value })}
              min={0}
              max={10000}
              step={10}
              unit="GB - Alta capacidade"
            />

            <TouchInput
              label="Disco SSD"
              icon={<HardDrive className="w-4 h-4 text-orange-500" />}
              value={vm.discoSSD}
              onChange={(value) => handleUpdate({ discoSSD: value })}
              min={0}
              max={10000}
              step={10}
              unit="GB - Alta performance"
            />

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tipo de Backup</h4>
              <div className="space-y-2">
                {['padrao', 'duplo', 'triplo'].map((tipo) => (
                  <motion.button
                    key={tipo}
                    onClick={() => handleUpdate({ backupTipo: tipo as any })}
                    className={`
                      w-full p-3 rounded-lg border-2 text-left transition-all
                      ${vm.backupTipo === tipo 
                        ? 'border-green-500 bg-green-50 text-green-900' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <div className={`
                        w-5 h-5 rounded border-2 mr-3 flex items-center justify-center
                        ${vm.backupTipo === tipo 
                          ? 'bg-green-500 border-green-500' 
                          : 'bg-white border-gray-300'
                        }
                      `}>
                        {vm.backupTipo === tipo && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="capitalize">{tipo}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="text-sm text-optidata-gray-600 text-right">
                Custo do backup: {formatCurrency(custo.backup)}
              </div>
            </div>
          </div>
        </CollapsibleCard>
      </motion.div>

      {/* Sistema Operacional (delay: 0.3) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <CollapsibleCard
          title="Sistema Operacional"
          icon={<Server className="w-6 h-6" />}
          value={formatCurrency(custo.sistemaOperacional)}
        >
          <div className="space-y-6">
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Server className="w-4 h-4 mr-2 text-blue-600" />
                Microsoft Windows Server
              </h5>
              <div className="space-y-2">
                {sistemasWindows.map(so => (
                  <SistemaOperacionalButton 
                    key={so.id}
                    sistema={so}
                    selecionado={vm.sistemaOperacional === so.id}
                    onSelect={() => handleUpdate({ sistemaOperacional: so.id })}
                    vcpu={vm.vcpu}
                  />
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Server className="w-4 h-4 mr-2 text-red-600" />
                Linux Enterprise (com suporte)
              </h5>
              <div className="space-y-2">
                {linuxEnterprise.map(so => (
                  <SistemaOperacionalButton 
                    key={so.id}
                    sistema={so}
                    selecionado={vm.sistemaOperacional === so.id}
                    onSelect={() => handleUpdate({ sistemaOperacional: so.id })}
                    vcpu={vm.vcpu}
                  />
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Terminal className="w-4 h-4 mr-2 text-green-600" />
                Linux Gratuito (sem suporte)
              </h5>
              <div className="space-y-2">
                {linuxGratuitos.map(so => (
                  <SistemaOperacionalButton 
                    key={so.id}
                    sistema={so}
                    selecionado={vm.sistemaOperacional === so.id}
                    onSelect={() => handleUpdate({ sistemaOperacional: so.id })}
                    vcpu={vm.vcpu}
                  />
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-600 flex items-center gap-1 p-2 bg-gray-50 rounded">
              <Info className="w-3 h-3" />
              Apenas um sistema operacional pode ser selecionado por VM
            </div>
          </div>
        </CollapsibleCard>
      </motion.div>

      {/* Banco de Dados (delay: 0.4) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <CollapsibleCard
          title="Banco de Dados"
          icon={<Database className="w-6 h-6" />}
          value={formatCurrency(custo.bancoDados)}
        >
          <div className="space-y-6">
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Database className="w-4 h-4 mr-2 text-blue-600" />
                Microsoft SQL Server
              </h5>
              <div className="space-y-2">
                {sqlServer.map(bd => (
                  <BancoDadosButton 
                    key={bd.id}
                    banco={bd}
                    selecionado={vm.bancoDados === bd.id}
                    onSelect={() => handleBancoDadosToggle(bd.id)}
                    vcpu={vm.vcpu}
                  />
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-red-600" />
                Oracle Database
              </h5>
              <div className="space-y-2">
                {oracle.map(bd => (
                  <BancoDadosButton 
                    key={bd.id}
                    banco={bd}
                    selecionado={vm.bancoDados === bd.id}
                    onSelect={() => handleBancoDadosToggle(bd.id)}
                    vcpu={vm.vcpu}
                  />
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Heart className="w-4 h-4 mr-2 text-green-600" />
                Open Source (Gratuitos)
              </h5>
              <div className="space-y-2">
                {bancosGratuitos.map(bd => (
                  <BancoDadosButton 
                    key={bd.id}
                    banco={bd}
                    selecionado={vm.bancoDados === bd.id}
                    onSelect={() => handleBancoDadosToggle(bd.id)}
                    vcpu={vm.vcpu}
                  />
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-purple-600" />
                Enterprise & NoSQL
              </h5>
              <div className="space-y-2">
                {bancosEnterprise.map(bd => (
                  <BancoDadosButton 
                    key={bd.id}
                    banco={bd}
                    selecionado={vm.bancoDados === bd.id}
                    onSelect={() => handleBancoDadosToggle(bd.id)}
                    vcpu={vm.vcpu}
                  />
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-600 flex items-center gap-1 p-2 bg-amber-50 rounded">
              <Info className="w-3 h-3" />
              ⚠️ Clique novamente no banco selecionado para desselecionar
            </div>
          </div>
        </CollapsibleCard>
      </motion.div>

      {/* Terminal Services (TSPlus) (delay: 0.5) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <CollapsibleCard
          title="Terminal Services (TSPlus)"
          icon={<Users className="w-6 h-6" />}
        >
          <div className="space-y-4">
            <button
              onClick={() => 
                handleUpdate({ 
                  tsplus: { ...vm.tsplus, enabled: !vm.tsplus.enabled }
                })
              }
              className={`
                w-full p-3 rounded-lg border-2 text-left transition-all
                ${vm.tsplus.enabled 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`
                    w-5 h-5 rounded border-2 mr-3 flex items-center justify-center
                    ${vm.tsplus.enabled 
                      ? 'bg-green-500 border-green-500' 
                      : 'bg-white border-gray-300'
                    }
                  `}>
                    {vm.tsplus.enabled && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={vm.tsplus.enabled ? 'text-green-900 font-medium' : ''}>
                    Ativar TSPlus
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {vm.tsplus.usuarios} usuários = R$ {vm.tsplus.enabled ? (calculadora['precos'].tsplus[vm.tsplus.usuarios] || 0) : 0}
                </span>
              </div>
            </button>

            {vm.tsplus.enabled && (
              <div className="space-y-4 pl-4 border-l-2 border-optidata-blue/20">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Número de Usuários</div>
                  <Select
                    value={vm.tsplus.usuarios.toString()}
                    onValueChange={(value) =>
                      handleUpdate({
                        tsplus: { 
                          ...vm.tsplus, 
                          usuarios: value === 'ilimitado' ? 'ilimitado' : Number(value) as any
                        }
                      })
                    }
                  >
                    <SelectTrigger className="input-optidata">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 usuários - R$ 140</SelectItem>
                      <SelectItem value="5">5 usuários - R$ 180</SelectItem>
                      <SelectItem value="10">10 usuários - R$ 310</SelectItem>
                      <SelectItem value="15">15 usuários - R$ 390</SelectItem>
                      <SelectItem value="25">25 usuários - R$ 550</SelectItem>
                      <SelectItem value="35">35 usuários - R$ 730</SelectItem>
                      <SelectItem value="49">49 usuários - R$ 990</SelectItem>
                      <SelectItem value="ilimitado">Ilimitado - R$ 1.190</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <button
                  onClick={() =>
                    handleUpdate({
                      tsplus: { ...vm.tsplus, advancedSecurity: !vm.tsplus.advancedSecurity }
                    })
                  }
                  className={`
                    w-full p-3 rounded-lg border-2 text-left transition-all
                    ${vm.tsplus.advancedSecurity 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                    }
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`
                        w-5 h-5 rounded border-2 mr-3 flex items-center justify-center
                        ${vm.tsplus.advancedSecurity 
                          ? 'bg-green-500 border-green-500' 
                          : 'bg-white border-gray-300'
                        }
                      `}>
                        {vm.tsplus.advancedSecurity && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={vm.tsplus.advancedSecurity ? 'text-green-900 font-medium' : ''}>
                        Advanced Security
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">R$ 140,00/mês</span>
                  </div>
                </button>

                <button
                  onClick={() =>
                    handleUpdate({
                      tsplus: { ...vm.tsplus, twoFactor: !vm.tsplus.twoFactor }
                    })
                  }
                  className={`
                    w-full p-3 rounded-lg border-2 text-left transition-all
                    ${vm.tsplus.twoFactor 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                    }
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`
                        w-5 h-5 rounded border-2 mr-3 flex items-center justify-center
                        ${vm.tsplus.twoFactor 
                          ? 'bg-green-500 border-green-500' 
                          : 'bg-white border-gray-300'
                        }
                      `}>
                        {vm.tsplus.twoFactor && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={vm.tsplus.twoFactor ? 'text-green-900 font-medium' : ''}>
                        Two-Factor Authentication
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">R$ 165,00/mês</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </CollapsibleCard>
      </motion.div>

      {/* Segurança e Extras (delay: 0.6) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <CollapsibleCard
          title="Segurança e Extras"
          icon={<Shield className="w-6 h-6" />}
        >
          <div className="space-y-4">
            <button
              onClick={() => handleUpdate({ antivirus: !vm.antivirus })}
              className={`
                w-full p-3 rounded-lg border-2 text-left transition-all
                ${vm.antivirus 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`
                    w-5 h-5 rounded border-2 mr-3 flex items-center justify-center
                    ${vm.antivirus 
                      ? 'bg-green-500 border-green-500' 
                      : 'bg-white border-gray-300'
                    }
                  `}>
                    {vm.antivirus && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <span className={vm.antivirus ? 'text-green-900 font-medium' : ''}>
                      Antivírus
                    </span>
                    {getSistemaOperacionalSelecionado()?.categoria === 'windows' && vm.antivirus && (
                      <p className="text-xs text-blue-600 mt-1">
                        ✨ Auto-selecionado para Windows (recomendado)
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-500">R$ 55,00/mês</span>
              </div>
            </button>

            <div className="space-y-2">
              <div className="text-sm font-medium">Web Application Firewall (WAF)</div>
              <Select
                value={vm.waf}
                onValueChange={(value: any) => handleUpdate({ waf: value })}
              >
                <SelectTrigger className="input-optidata">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum - R$ 0</SelectItem>
                  <SelectItem value="pro">WAF PRO - R$ 200/mês</SelectItem>
                  <SelectItem value="business">WAF Business - R$ 1.600/mês</SelectItem>
                  <SelectItem value="enterprise">WAF Enterprise - R$ 15.600/mês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <button
              onClick={() => handleUpdate({ thinprint: !vm.thinprint })}
              className={`
                w-full p-3 rounded-lg border-2 text-left transition-all
                ${vm.thinprint 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`
                    w-5 h-5 rounded border-2 mr-3 flex items-center justify-center
                    ${vm.thinprint 
                      ? 'bg-green-500 border-green-500' 
                      : 'bg-white border-gray-300'
                    }
                  `}>
                    {vm.thinprint && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={vm.thinprint ? 'text-green-900 font-medium' : ''}>
                    ThinPrint
                  </span>
                </div>
                <span className="text-sm text-gray-500">R$ 850,00/mês</span>
              </div>
            </button>

            <TouchInput
              label="IPs Adicionais"
              icon={<Monitor className="w-4 h-4 text-optidata-gray-500" />}
              value={vm.ipsAdicionais}
              onChange={(value) => handleUpdate({ ipsAdicionais: value })}
              min={0}
              max={10}
              calculatedValue={vm.ipsAdicionais > 0 ? `R$ ${vm.ipsAdicionais * 70}/mês` : undefined}
            />
          </div>
        </CollapsibleCard>
      </motion.div>

      {/* Enhanced Desconto Section with better animations (delay: 0.7) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
          <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Desconto Exclusivo para esta VM
          </h4>
          
          <div className="space-y-4">
            {/* Enhanced Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Percentual de Desconto
                </span>
                <motion.span 
                  className="text-3xl font-bold text-blue-600"
                  key={vm.descontoIndividual}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {vm.descontoIndividual || 0}%
                </motion.span>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={vm.descontoIndividual || 0}
                  onChange={(e) => handleUpdate({ descontoIndividual: parseInt(e.target.value) })}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(vm.descontoIndividual || 0) * 2}%, #E5E7EB ${(vm.descontoIndividual || 0) * 2}%, #E5E7EB 100%)`
                  }}
                />
                
                {/* Animated progress indicator */}
                <motion.div
                  className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
                  style={{ 
                    width: `${(vm.descontoIndividual || 0) * 2}%`,
                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(vm.descontoIndividual || 0) * 2}%` }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </div>
              
              {/* Labels do slider */}
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Aviso sobre aplicação do desconto */}
            <div className="bg-blue-100 rounded-lg p-3">
              <p className="text-sm text-blue-800 flex items-start">
                <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Aplicado apenas em infraestrutura. Licenças não têm desconto.
              </p>
            </div>

            {/* Enhanced Breakdown with animations */}
            <AnimatePresence>
              {(vm.descontoIndividual || 0) > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 bg-white rounded-lg p-4 border shadow-sm"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Infraestrutura original:</span>
                    <span className="font-medium">{formatCurrency(custo.subtotalInfraOriginal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Com desconto ({vm.descontoIndividual}%):</span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(custo.subtotalInfra)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm font-semibold text-green-600 pt-2 border-t">
                    <span>Economia mensal:</span>
                    <motion.span
                      key={custo.descontoIndividual}
                      initial={{ scale: 1.2, color: '#10b981' }}
                      animate={{ scale: 1, color: '#059669' }}
                    >
                      {formatCurrency(custo.descontoIndividual)}
                    </motion.span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Economia anual:</span>
                    <span>{formatCurrency(custo.descontoIndividual * 12)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Final Summary (delay: 0.8) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <CollapsibleCard
          title="Resumo de Custos"
          icon={<Monitor className="w-6 h-6 text-green-500" />}
          value={formatCurrency(custo.total)}
          defaultExpanded
          className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 shadow-lg"
        >
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm">vCPU ({vm.vcpu} × R$ 0,0347 × 720h)</span>
              <span className="font-medium">{formatCurrency(custo.vcpu)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm">RAM ({vm.ram}GB × R$ 0,0278 × 720h)</span>
              <span className="font-medium">{formatCurrency(custo.ram)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm">Armazenamento + Backup</span>
              <span className="font-medium">{formatCurrency(custo.storage + custo.backup)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm">Monitoramento</span>
              <span className="font-medium">{formatCurrency(custo.monitoramento)}</span>
            </div>
            
            {custo.sistemaOperacional > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm">Sistema Operacional</span>
                <span className="font-medium">{formatCurrency(custo.sistemaOperacional)}</span>
              </div>
            )}
            
            {custo.bancoDados > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm">Banco de Dados</span>
                <span className="font-medium">{formatCurrency(custo.bancoDados)}</span>
              </div>
            )}

            {custo.descontoIndividual > 0 && (
              <>
                <div className="flex justify-between py-2 text-gray-500 border-b border-gray-200">
                  <span className="text-sm">Subtotal Infraestrutura</span>
                  <span className="line-through">{formatCurrency(custo.subtotalInfraOriginal)}</span>
                </div>
                <div className="flex justify-between py-2 text-green-600 border-b border-gray-200">
                  <span className="text-sm">Desconto Individual ({vm.descontoIndividual}%)</span>
                  <span>-{formatCurrency(custo.descontoIndividual)}</span>
                </div>
                <div className="flex justify-between py-2 font-medium border-b border-gray-200">
                  <span className="text-sm">Infraestrutura com Desconto</span>
                  <span>{formatCurrency(custo.subtotalInfra)}</span>
                </div>
              </>
            )}
            
            {Object.keys(custo.licencasAdicionais).length > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm">Licenças Adicionais</span>
                <span className="font-medium">{formatCurrency(Object.values(custo.licencasAdicionais).reduce((a, b) => a + b, 0))}</span>
              </div>
            )}

            <motion.div 
              className="flex justify-between text-xl font-bold pt-2 border-t-2 border-green-400"
              whileHover={{ scale: 1.02 }}
            >
              <span>Total Mensal</span>
              <motion.span 
                className="text-green-600 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                key={custo.total}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                {formatCurrency(custo.total)}
              </motion.span>
            </motion.div>
          </div>
        </CollapsibleCard>
      </motion.div>
    </div>
  );
};

export default VMConfigurator;
