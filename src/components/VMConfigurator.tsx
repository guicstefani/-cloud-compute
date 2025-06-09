
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
  Windows,
  Heart,
  Zap
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

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* VM Header */}
      <CollapsibleCard
        title={vm.nome || 'Nova VM'}
        icon={<span className="text-xl">{getOSIcon()}</span>}
        subtitle={`${vm.vcpu} vCPU • ${vm.ram}GB RAM`}
        value={formatCurrency(custo.total)}
        defaultExpanded
        className="border-2 border-optidata-blue/20"
      >
        <div className="space-y-4">
          <Input
            value={vm.nome}
            onChange={(e) => handleUpdate({ nome: e.target.value })}
            className="text-lg font-semibold input-optidata"
            placeholder="Nome da VM"
          />
          
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

          {custo.descontoIndividual > 0 && (
            <div className="text-sm text-green-600 optidata-gradient-light p-3 rounded-lg">
              💰 Economia: {formatCurrency(custo.descontoIndividual)}
            </div>
          )}
        </div>
      </CollapsibleCard>

      {/* Recursos Computacionais */}
      <CollapsibleCard
        title="Recursos Computacionais"
        icon={<Cpu className="w-6 h-6" />}
        value={formatCurrency(custo.vcpu + custo.ram)}
        defaultExpanded
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

          {/* Validação vCPU/RAM */}
          {vm.ram / vm.vcpu < 2 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-2 text-amber-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">
                  Proporção vCPU/RAM baixa. Recomendado: 1:2 a 1:8
                </span>
              </div>
            </div>
          )}
        </div>
      </CollapsibleCard>

      {/* Armazenamento */}
      <CollapsibleCard
        title="Armazenamento"
        icon={<HardDrive className="w-6 h-6" />}
        value={formatCurrency(custo.storage + custo.backup)}
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

          {/* Tipo de Backup */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tipo de Backup</h4>
            <div className="space-y-2">
              {['padrao', 'duplo', 'triplo'].map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => handleUpdate({ backupTipo: tipo as any })}
                  className={`
                    w-full p-3 rounded-lg border-2 text-left transition-all
                    ${vm.backupTipo === tipo 
                      ? 'border-green-500 bg-green-50 text-green-900' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                    }
                  `}
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
                </button>
              ))}
            </div>
            <div className="text-sm text-optidata-gray-600 text-right">
              Custo do backup: {formatCurrency(custo.backup)}
            </div>
          </div>
        </div>
      </CollapsibleCard>

      {/* Sistema Operacional */}
      <CollapsibleCard
        title="Sistema Operacional"
        icon={<Server className="w-6 h-6" />}
        value={formatCurrency(custo.sistemaOperacional)}
      >
        <div className="space-y-6">
          {/* Windows */}
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Windows className="w-4 h-4 mr-2 text-blue-600" />
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

          {/* Linux Enterprise */}
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

          {/* Linux Gratuitos */}
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

      {/* Banco de Dados */}
      <CollapsibleCard
        title="Banco de Dados"
        icon={<Database className="w-6 h-6" />}
        value={formatCurrency(custo.bancoDados)}
      >
        <div className="space-y-6">
          {/* Microsoft SQL Server */}
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
                  onSelect={() => handleUpdate({ bancoDados: bd.id })}
                  vcpu={vm.vcpu}
                />
              ))}
            </div>
          </div>

          {/* Oracle Database */}
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
                  onSelect={() => handleUpdate({ bancoDados: bd.id })}
                  vcpu={vm.vcpu}
                />
              ))}
            </div>
          </div>

          {/* Bancos Open Source */}
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
                  onSelect={() => handleUpdate({ bancoDados: bd.id })}
                  vcpu={vm.vcpu}
                />
              ))}
            </div>
          </div>

          {/* Enterprise NoSQL/Outros */}
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
                  onSelect={() => handleUpdate({ bancoDados: bd.id })}
                  vcpu={vm.vcpu}
                />
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-600 flex items-center gap-1 p-2 bg-amber-50 rounded">
            <Info className="w-3 h-3" />
            ⚠️ Apenas um banco de dados pode ser selecionado por VM
          </div>
        </div>
      </CollapsibleCard>

      {/* Terminal Services (TSPlus) */}
      <CollapsibleCard
        title="Terminal Services (TSPlus)"
        icon={<Users className="w-6 h-6" />}
      >
        <div className="space-y-4">
          {/* TSPlus Enable Checkbox */}
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

              {/* Advanced Security */}
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

              {/* Two-Factor Authentication */}
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

      {/* Segurança e Extras */}
      <CollapsibleCard
        title="Segurança e Extras"
        icon={<Shield className="w-6 h-6" />}
      >
        <div className="space-y-4">
          {/* Antivírus */}
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
                <span className={vm.antivirus ? 'text-green-900 font-medium' : ''}>
                  Antivírus
                </span>
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

          {/* ThinPrint */}
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

      {/* Desconto Individual */}
      <VMDiscountSection
        vm={vm}
        totalInfra={custo.subtotalInfraOriginal}
        onUpdate={handleUpdate}
      />

      {/* Resumo de Custos */}
      <CollapsibleCard
        title="Resumo de Custos"
        icon={<Monitor className="w-6 h-6" />}
        value={formatCurrency(custo.total)}
        defaultExpanded
        className="optidata-gradient-light"
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

          <div className="flex justify-between text-xl font-bold pt-2 border-t-2 border-optidata-blue">
            <span>Total Mensal</span>
            <span className="text-optidata-blue">{formatCurrency(custo.total)}</span>
          </div>
        </div>
      </CollapsibleCard>
    </div>
  );
};

export default VMConfigurator;
