import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { VM } from '@/types';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import VMDiscountSection from '@/components/VMDiscountSection';
import TouchInput from '@/components/TouchInput';
import CollapsibleCard from '@/components/CollapsibleCard';
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
  Computer,
  Terminal,
  Info
} from 'lucide-react';

interface VMConfiguratorProps {
  vm: VM;
  calculadora: CalculadoraCloud;
}

const VMConfigurator = ({ vm, calculadora }: VMConfiguratorProps) => {
  const { updateVM } = useCalculadoraStore();
  const custo = calculadora.calcularVM(vm);

  const handleUpdate = (updates: Partial<VM>) => {
    // Validações importantes
    let finalUpdates = { ...updates };

    // Validação: apenas um SO por vez
    if (updates.windowsServer && (vm.rhel || vm.suse)) {
      finalUpdates.rhel = false;
      finalUpdates.suse = false;
    }
    if (updates.rhel && (vm.windowsServer || vm.suse)) {
      finalUpdates.windowsServer = false;
      finalUpdates.suse = false;
      finalUpdates.sqlServerSTD = false; // SQL Server requer Windows
    }
    if (updates.suse && (vm.windowsServer || vm.rhel)) {
      finalUpdates.windowsServer = false;
      finalUpdates.rhel = false;
      finalUpdates.sqlServerSTD = false; // SQL Server requer Windows
    }

    // Validação: SQL Server requer Windows
    if (updates.sqlServerSTD && !vm.windowsServer && !finalUpdates.windowsServer) {
      alert('SQL Server Standard requer Windows Server');
      finalUpdates.sqlServerSTD = false;
    }

    // Limitar desconto individual a 50%
    if (updates.descontoIndividual !== undefined) {
      finalUpdates.descontoIndividual = Math.max(0, Math.min(50, updates.descontoIndividual));
    }

    updateVM(vm.id, finalUpdates);
  };

  const getOSIcon = () => {
    if (vm.windowsServer) return '🪟';
    if (vm.suse) return '🦎';
    if (vm.rhel) return '🎩';
    if (vm.redhat) return '🔴';
    return '💻';
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
            <div className="text-sm font-medium text-optidata-gray-900">Tipo de Backup</div>
            <RadioGroup
              value={vm.backupTipo}
              onValueChange={(value: any) => handleUpdate({ backupTipo: value })}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="padrao" id="padrao" />
                <label htmlFor="padrao" className="flex-1 text-sm">Padrão</label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="duplo" id="duplo" />
                <label htmlFor="duplo" className="flex-1 text-sm">Duplo</label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="triplo" id="triplo" />
                <label htmlFor="triplo" className="flex-1 text-sm">Triplo</label>
              </div>
            </RadioGroup>
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
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Computer className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium">Windows Server</div>
                <div className="text-xs text-gray-500">
                  {Math.ceil(vm.vcpu / 2)} licença(s) × R$ 55 = R$ {Math.ceil(vm.vcpu / 2) * 55}
                </div>
              </div>
            </div>
            <Switch
              checked={vm.windowsServer}
              onCheckedChange={(checked) => handleUpdate({ windowsServer: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Terminal className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <div className="font-medium">Red Hat Enterprise Linux (RHEL)</div>
                <div className="text-xs text-gray-500">R$ 1.200,00/mês por servidor</div>
              </div>
            </div>
            <Switch
              checked={vm.rhel}
              onCheckedChange={(checked) => handleUpdate({ rhel: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Terminal className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <div className="font-medium">SUSE Linux Enterprise</div>
                <div className="text-xs text-gray-500">R$ 900,00/mês por servidor</div>
              </div>
            </div>
            <Switch
              checked={vm.suse}
              onCheckedChange={(checked) => handleUpdate({ suse: checked })}
            />
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
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <div className="font-medium">SQL Server Standard</div>
              <div className="text-xs text-gray-500">
                {Math.ceil(vm.vcpu / 2)} licença(s) × R$ 800 = R$ {Math.ceil(vm.vcpu / 2) * 800}
              </div>
              {!vm.windowsServer && (
                <div className="text-xs text-amber-600">Requer Windows Server</div>
              )}
            </div>
            <Switch
              checked={vm.sqlServerSTD}
              disabled={!vm.windowsServer}
              onCheckedChange={(checked) => handleUpdate({ sqlServerSTD: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="font-medium">SQL Server Web</div>
            <Switch
              checked={vm.sqlServerWEB}
              onCheckedChange={(checked) => handleUpdate({ sqlServerWEB: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="font-medium">SAP HANA</div>
            <Switch
              checked={vm.hana}
              onCheckedChange={(checked) => handleUpdate({ hana: checked })}
            />
          </div>
        </div>
      </CollapsibleCard>

      {/* Terminal Services */}
      <CollapsibleCard
        title="Terminal Services (TSPlus)"
        icon={<Users className="w-6 h-6" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="font-medium">Ativar TSPlus</div>
            <Switch
              checked={vm.tsplus.enabled}
              onCheckedChange={(checked) => 
                handleUpdate({ 
                  tsplus: { ...vm.tsplus, enabled: checked }
                })
              }
            />
          </div>

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
                    <SelectItem value="3">3 usuários</SelectItem>
                    <SelectItem value="5">5 usuários</SelectItem>
                    <SelectItem value="10">10 usuários</SelectItem>
                    <SelectItem value="15">15 usuários</SelectItem>
                    <SelectItem value="25">25 usuários</SelectItem>
                    <SelectItem value="35">35 usuários</SelectItem>
                    <SelectItem value="49">49 usuários</SelectItem>
                    <SelectItem value="ilimitado">Ilimitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="font-medium">Advanced Security</div>
                <Switch
                  checked={vm.tsplus.advancedSecurity}
                  onCheckedChange={(checked) =>
                    handleUpdate({
                      tsplus: { ...vm.tsplus, advancedSecurity: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="font-medium">Two-Factor Authentication</div>
                <Switch
                  checked={vm.tsplus.twoFactor}
                  onCheckedChange={(checked) =>
                    handleUpdate({
                      tsplus: { ...vm.tsplus, twoFactor: checked }
                    })
                  }
                />
              </div>
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
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="font-medium">Antivírus</div>
            <Switch
              checked={vm.antivirus}
              onCheckedChange={(checked) => handleUpdate({ antivirus: checked })}
            />
          </div>

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
                <SelectItem value="none">Nenhum</SelectItem>
                <SelectItem value="pro">WAF PRO</SelectItem>
                <SelectItem value="business">WAF Business</SelectItem>
                <SelectItem value="enterprise">WAF Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="font-medium">ThinPrint</div>
            <Switch
              checked={vm.thinprint}
              onCheckedChange={(checked) => handleUpdate({ thinprint: checked })}
            />
          </div>

          <TouchInput
            label="IPs Adicionais"
            icon={<Monitor className="w-4 h-4 text-optidata-gray-500" />}
            value={vm.ipsAdicionais}
            onChange={(value) => handleUpdate({ ipsAdicionais: value })}
            min={0}
            max={10}
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
          
          {Object.keys(custo.licencas).length > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm">Licenças (sem desconto)</span>
              <span className="font-medium">{formatCurrency(custo.subtotalLicencas)}</span>
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
