
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
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Shield, 
  Database, 
  Users, 
  Monitor,
  Server,
  AlertTriangle
} from 'lucide-react';

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

  const getOSIcon = () => {
    if (vm.windowsServer) return '🪟';
    if (vm.suse) return '🦎';
    if (vm.redhat) return '🎩';
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
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-optidata-blue">
            {formatCurrency(custo.total)}
          </div>
          <div className="text-sm text-optidata-gray-600">por mês</div>
        </div>
      </div>

      {/* Recursos Computacionais */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Cpu className="w-5 h-5 text-optidata-blue" />
          <h3 className="text-lg font-semibold">Recursos Computacionais</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* vCPU */}
          <div className="space-y-3">
            <Label className="flex items-center justify-between">
              <span>vCPU</span>
              <span className="text-sm text-optidata-gray-600">
                {formatCurrency(custo.vcpu)}
              </span>
            </Label>
            <div className="space-y-2">
              <Slider
                value={[vm.vcpu]}
                onValueChange={([value]) => handleUpdate({ vcpu: value })}
                min={1}
                max={128}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-optidata-gray-500">
                <span>1</span>
                <span className="font-medium">{vm.vcpu} vCPU</span>
                <span>128</span>
              </div>
            </div>
          </div>

          {/* RAM */}
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
            <div className="space-y-2">
              <Slider
                value={[vm.ram]}
                onValueChange={([value]) => handleUpdate({ ram: value })}
                min={1}
                max={1024}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-optidata-gray-500">
                <span>1</span>
                <span className="font-medium">{vm.ram}GB</span>
                <span>1024</span>
              </div>
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

      {/* Sistema Operacional */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Server className="w-5 h-5 text-optidata-blue" />
          <h3 className="text-lg font-semibold">Sistema Operacional</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="windows">Windows Server</Label>
            <Switch
              id="windows"
              checked={vm.windowsServer}
              onCheckedChange={(checked) => handleUpdate({ windowsServer: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suse">SUSE Linux Enterprise</Label>
            <Switch
              id="suse"
              checked={vm.suse}
              onCheckedChange={(checked) => handleUpdate({ suse: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="redhat">Red Hat Enterprise</Label>
            <Switch
              id="redhat"
              checked={vm.redhat}
              onCheckedChange={(checked) => handleUpdate({ redhat: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Banco de Dados */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="w-5 h-5 text-optidata-blue" />
          <h3 className="text-lg font-semibold">Banco de Dados</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sqlstd">SQL Server Standard</Label>
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

      <Separator />

      {/* Resumo de Custos */}
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
            <span>Armazenamento</span>
            <span>{formatCurrency(custo.storage)}</span>
          </div>
          <div className="flex justify-between">
            <span>Backup</span>
            <span>{formatCurrency(custo.backup)}</span>
          </div>
          <div className="flex justify-between">
            <span>Monitoramento</span>
            <span>{formatCurrency(custo.monitoramento)}</span>
          </div>
          {Object.keys(custo.licencas).length > 0 && (
            <div className="flex justify-between">
              <span>Licenças</span>
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
