
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { VM } from '@/types';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import VMDiscountSection from '@/components/VMDiscountSection';
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
    <div className="space-y-6">
      {/* Header da VM */}
      <div className="flex items-center justify-between">
        <div>
          <Input
            value={vm.nome}
            onChange={(e) => handleUpdate({ nome: e.target.value })}
            className="text-lg font-semibold border-none shadow-none p-0 h-auto"
            placeholder="Nome da VM"
          />
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-2xl">{getOSIcon()}</span>
            <Badge variant="outline" className="text-xs">
              {vm.status === 'rascunho' ? 'Rascunho' : 'Finalizada'}
            </Badge>
            {vm.descontoIndividual > 0 && (
              <Badge className="text-xs bg-green-100 text-green-700">
                Desconto {vm.descontoIndividual}%
              </Badge>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-optidata-blue">
            {formatCurrency(custo.total)}
          </div>
          <div className="text-sm text-optidata-gray-600">por mês</div>
          {custo.descontoIndividual > 0 && (
            <div className="text-xs text-green-600">
              Economia: {formatCurrency(custo.descontoIndividual)}
            </div>
          )}
        </div>
      </div>

      {/* Recursos Computacionais */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Cpu className="w-5 h-5 text-optidata-blue" />
          <h3 className="text-lg font-semibold">Recursos Computacionais</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* vCPU com slider + input manual */}
          <div className="space-y-3">
            <Label className="flex items-center justify-between">
              <span>vCPU</span>
              <span className="text-sm text-optidata-gray-600">
                {formatCurrency(custo.vcpu)}
              </span>
            </Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Slider
                  value={[vm.vcpu]}
                  onValueChange={([value]) => handleUpdate({ vcpu: value })}
                  min={1}
                  max={128}
                  step={1}
                  className="w-full"
                />
              </div>
              <Input
                type="number"
                value={vm.vcpu}
                onChange={(e) => handleUpdate({ vcpu: Number(e.target.value) })}
                min={1}
                max={128}
                className="w-20 text-center"
              />
            </div>
            <div className="flex justify-between text-xs text-optidata-gray-500">
              <span>{vm.vcpu} × R$ 0,0347 × 720h</span>
              <span className="font-medium">= {formatCurrency(vm.vcpu * 0.0347 * 720)}</span>
            </div>
          </div>

          {/* RAM com slider + input manual */}
          <div className="space-y-3">
            <Label className="flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <MemoryStick className="w-4 h-4" />
                <span>RAM (GB)</span>
              </span>
              <span className="text-sm text-optidata-gray-600">
                {formatCurrency(custo.ram)}
              </span>
            </Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Slider
                  value={[vm.ram]}
                  onValueChange={([value]) => handleUpdate({ ram: value })}
                  min={1}
                  max={1024}
                  step={1}
                  className="w-full"
                />
              </div>
              <Input
                type="number"
                value={vm.ram}
                onChange={(e) => handleUpdate({ ram: Number(e.target.value) })}
                min={1}
                max={1024}
                className="w-20 text-center"
              />
            </div>
            <div className="flex justify-between text-xs text-optidata-gray-500">
              <span>{vm.ram}GB × R$ 0,0278 × 720h</span>
              <span className="font-medium">= {formatCurrency(vm.ram * 0.0278 * 720)}</span>
            </div>
          </div>
        </div>

        {/* Validação vCPU/RAM */}
        {vm.ram / vm.vcpu < 2 && (
          <div className="mt-4 p-3 bg-optidata-warning/10 border border-optidata-warning/20 rounded-lg">
            <div className="flex items-center space-x-2 text-optidata-warning">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">
                Proporção vCPU/RAM baixa. Recomendado: 1:2 a 1:8
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Armazenamento */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <HardDrive className="w-5 h-5 text-optidata-blue" />
          <h3 className="text-lg font-semibold">Armazenamento</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Disco FCM */}
          <div className="space-y-3">
            <Label>
              Disco FCM (GB)
              <span className="text-xs text-optidata-gray-500 ml-1">
                - Alta capacidade
              </span>
            </Label>
            <Input
              type="number"
              value={vm.discoFCM}
              onChange={(e) => handleUpdate({ discoFCM: Number(e.target.value) })}
              min={0}
              step={10}
            />
          </div>

          {/* Disco SSD */}
          <div className="space-y-3">
            <Label>
              Disco SSD (GB)
              <span className="text-xs text-optidata-gray-500 ml-1">
                - Alta performance
              </span>
            </Label>
            <Input
              type="number"
              value={vm.discoSSD}
              onChange={(e) => handleUpdate({ discoSSD: Number(e.target.value) })}
              min={0}
              step={10}
            />
          </div>
        </div>

        {/* Tipo de Backup */}
        <div className="mt-6 space-y-3">
          <Label>Tipo de Backup</Label>
          <RadioGroup
            value={vm.backupTipo}
            onValueChange={(value: any) => handleUpdate({ backupTipo: value })}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="padrao" id="padrao" />
              <Label htmlFor="padrao">Padrão</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="duplo" id="duplo" />
              <Label htmlFor="duplo">Duplo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="triplo" id="triplo" />
              <Label htmlFor="triplo">Triplo</Label>
            </div>
          </RadioGroup>
          <div className="text-sm text-optidata-gray-600">
            Custo do backup: {formatCurrency(custo.backup)}
          </div>
        </div>
      </Card>

      {/* Sistema Operacional - ATUALIZADO */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Server className="w-5 h-5 text-optidata-blue" />
          <h3 className="text-lg font-semibold">Sistema Operacional</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <Switch
                id="windows"
                checked={vm.windowsServer}
                onCheckedChange={(checked) => handleUpdate({ windowsServer: checked })}
              />
              <Computer className="w-5 h-5 text-blue-600" />
              <div>
                <Label htmlFor="windows">Windows Server</Label>
                <div className="text-xs text-gray-500">
                  {Math.ceil(vm.vcpu / 2)} licença(s) × R$ 55 = R$ {Math.ceil(vm.vcpu / 2) * 55}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <Switch
                id="rhel"
                checked={vm.rhel}
                onCheckedChange={(checked) => handleUpdate({ rhel: checked })}
              />
              <Terminal className="w-5 h-5 text-red-600" />
              <div>
                <Label htmlFor="rhel">Red Hat Enterprise Linux (RHEL)</Label>
                <div className="text-xs text-gray-500">
                  R$ 1.200,00/mês por servidor
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <Switch
                id="suse"
                checked={vm.suse}
                onCheckedChange={(checked) => handleUpdate({ suse: checked })}
              />
              <Terminal className="w-5 h-5 text-green-600" />
              <div>
                <Label htmlFor="suse">SUSE Linux Enterprise</Label>
                <div className="text-xs text-gray-500">
                  R$ 900,00/mês por servidor
                </div>
              </div>
            </div>
          </div>

          {/* Aviso sobre seleção de SO */}
          <div className="text-xs text-gray-600 flex items-center gap-1 p-2 bg-gray-50 rounded">
            <Info className="w-3 h-3" />
            Apenas um sistema operacional pode ser selecionado por VM
          </div>
        </div>
      </Card>

      {/* Banco de Dados - ATUALIZADO */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="w-5 h-5 text-optidata-blue" />
          <h3 className="text-lg font-semibold">Banco de Dados</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sqlstd">SQL Server Standard</Label>
              <div className="text-xs text-gray-500">
                {Math.ceil(vm.vcpu / 2)} licença(s) × R$ 800 = R$ {Math.ceil(vm.vcpu / 2) * 800}
              </div>
              {!vm.windowsServer && (
                <div className="text-xs text-optidata-warning">
                  Requer Windows Server
                </div>
              )}
            </div>
            <Switch
              id="sqlstd"
              checked={vm.sqlServerSTD}
              disabled={!vm.windowsServer}
              onCheckedChange={(checked) => handleUpdate({ sqlServerSTD: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sqlweb">SQL Server Web</Label>
            <Switch
              id="sqlweb"
              checked={vm.sqlServerWEB}
              onCheckedChange={(checked) => handleUpdate({ sqlServerWEB: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="hana">SAP HANA</Label>
            <Switch
              id="hana"
              checked={vm.hana}
              onCheckedChange={(checked) => handleUpdate({ hana: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Terminal Services */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-optidata-blue" />
          <h3 className="text-lg font-semibold">Terminal Services (TSPlus)</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="tsplus">Ativar TSPlus</Label>
            <Switch
              id="tsplus"
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
                <Label>Número de Usuários</Label>
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
                  <SelectTrigger>
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

              <div className="flex items-center justify-between">
                <Label htmlFor="advsec">Advanced Security</Label>
                <Switch
                  id="advsec"
                  checked={vm.tsplus.advancedSecurity}
                  onCheckedChange={(checked) =>
                    handleUpdate({
                      tsplus: { ...vm.tsplus, advancedSecurity: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="2fa">Two-Factor Authentication</Label>
                <Switch
                  id="2fa"
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
      </Card>

      {/* Segurança e Extras */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-optidata-blue" />
          <h3 className="text-lg font-semibold">Segurança e Extras</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="antivirus">Antivírus</Label>
            <Switch
              id="antivirus"
              checked={vm.antivirus}
              onCheckedChange={(checked) => handleUpdate({ antivirus: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Web Application Firewall (WAF)</Label>
            <Select
              value={vm.waf}
              onValueChange={(value: any) => handleUpdate({ waf: value })}
            >
              <SelectTrigger>
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

          <div className="flex items-center justify-between">
            <Label htmlFor="thinprint">ThinPrint</Label>
            <Switch
              id="thinprint"
              checked={vm.thinprint}
              onCheckedChange={(checked) => handleUpdate({ thinprint: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>IPs Adicionais</Label>
            <Input
              type="number"
              value={vm.ipsAdicionais}
              onChange={(e) => handleUpdate({ ipsAdicionais: Number(e.target.value) })}
              min={0}
              max={10}
            />
          </div>
        </div>
      </Card>

      {/* Nova seção de desconto individual */}
      <VMDiscountSection
        vm={vm}
        totalInfra={custo.subtotalInfraOriginal}
        onUpdate={handleUpdate}
      />

      <Separator />

      {/* Resumo de Custos - ATUALIZADO */}
      <Card className="p-6 bg-optidata-gray-50">
        <div className="flex items-center space-x-2 mb-4">
          <Monitor className="w-5 h-5 text-optidata-blue" />
          <h3 className="text-lg font-semibold">Resumo de Custos</h3>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Computação (vCPU + RAM)</span>
            <span>{formatCurrency(custo.vcpu + custo.ram)}</span>
          </div>
          <div className="flex justify-between">
            <span>Armazenamento + Backup</span>
            <span>{formatCurrency(custo.storage + custo.backup)}</span>
          </div>
          <div className="flex justify-between">
            <span>Monitoramento</span>
            <span>{formatCurrency(custo.monitoramento)}</span>
          </div>
          
          {/* Mostrar desconto individual se aplicado */}
          {custo.descontoIndividual > 0 && (
            <>
              <div className="flex justify-between text-gray-500">
                <span>Subtotal Infraestrutura</span>
                <span className="line-through">{formatCurrency(custo.subtotalInfraOriginal)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Desconto Individual ({vm.descontoIndividual}%)</span>
                <span>-{formatCurrency(custo.descontoIndividual)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Infraestrutura com Desconto</span>
                <span>{formatCurrency(custo.subtotalInfra)}</span>
              </div>
            </>
          )}
          
          {Object.keys(custo.licencas).length > 0 && (
            <div className="flex justify-between">
              <span>Licenças (sem desconto)</span>
              <span>{formatCurrency(custo.subtotalLicencas)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Mensal</span>
            <span className="text-optidata-blue">{formatCurrency(custo.total)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VMConfigurator;
