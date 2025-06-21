
import React, { useState } from 'react';
import { Plus, Settings, Copy, Trash2, Calculator, Cpu, HardDrive, Database } from 'lucide-react';

const PRECOS = {
  vcpu_hora: 0.0347,
  ram_hora: 0.0278,
  horas_mes: 720,
  ssd_gb: 0.55,
  fcm_gb: 0.75,
  backup_padrao: 0.30,
  backup_duplo: 0.55,
  backup_triplo: 0.75,
  monitoramento: 100,
  windows_server: 55, // por 2 vCPUs
  sql_server_std: 800, // por 2 vCPUs, requer Windows
  sql_server_web: 140,
  rhel: 1200,
  suse: 900,
  mysql_enterprise: 800,
  mongodb_enterprise: 1200,
  antivirus: 55,
  thinprint: 850,
  tsplus: {
    3: 140, 5: 180, 10: 310, 15: 390,
    25: 550, 35: 730, 49: 990, ilimitado: 1190
  },
  waf_pro: 200,
  waf_business: 1600,
  waf_enterprise: 15600,
  ip_adicional: 70
};

interface VM {
  id: string;
  nome: string;
  vcpu: number;
  ram: number;
  ssd: number;
  fcm: number;
  sistemaOperacional: string;
  bancoDados: string;
  antivirus: boolean;
  thinprint: boolean;
  tsplus: string;
  waf: string;
  ipsAdicionais: number;
  desconto: number;
}

const CloudCalculator = () => {
  const [vms, setVms] = useState<VM[]>([]);
  const [editingVm, setEditingVm] = useState<string | null>(null);

  const criarNovaVM = () => {
    const novaVM: VM = {
      id: Date.now().toString(),
      nome: `VM ${vms.length + 1}`,
      vcpu: 2,
      ram: 4,
      ssd: 50,
      fcm: 0,
      sistemaOperacional: 'ubuntu',
      bancoDados: 'nenhum',
      antivirus: false,
      thinprint: false,
      tsplus: 'nenhum',
      waf: 'nenhum',
      ipsAdicionais: 0,
      desconto: 0
    };
    setVms([...vms, novaVM]);
  };

  const duplicarVM = (id: string) => {
    const vm = vms.find(v => v.id === id);
    if (vm) {
      const duplicada = { ...vm, id: Date.now().toString(), nome: `${vm.nome} (Cópia)` };
      setVms([...vms, duplicada]);
    }
  };

  const removerVM = (id: string) => {
    setVms(vms.filter(v => v.id !== id));
  };

  const atualizarVM = (id: string, campo: keyof VM, valor: any) => {
    setVms(vms.map(vm => vm.id === id ? { ...vm, [campo]: valor } : vm));
  };

  const calcularVM = (vm: VM) => {
    let custo = 0;
    
    // Infraestrutura base
    const custoVCPU = vm.vcpu * PRECOS.vcpu_hora * PRECOS.horas_mes;
    const custoRAM = vm.ram * PRECOS.ram_hora * PRECOS.horas_mes;
    const custoSSD = vm.ssd * PRECOS.ssd_gb;
    const custoFCM = vm.fcm * PRECOS.fcm_gb;
    
    custo += custoVCPU + custoRAM + custoSSD + custoFCM + PRECOS.monitoramento;
    
    // Sistema Operacional
    if (vm.sistemaOperacional === 'windows') {
      custo += Math.ceil(vm.vcpu / 2) * PRECOS.windows_server;
    } else if (vm.sistemaOperacional === 'rhel') {
      custo += PRECOS.rhel;
    } else if (vm.sistemaOperacional === 'suse') {
      custo += PRECOS.suse;
    }
    
    // Banco de Dados
    if (vm.bancoDados === 'sql-server-std') {
      custo += Math.ceil(vm.vcpu / 2) * PRECOS.sql_server_std;
    } else if (vm.bancoDados === 'sql-server-web') {
      custo += Math.ceil(vm.vcpu / 2) * PRECOS.sql_server_web;
    } else if (vm.bancoDados === 'mysql-enterprise') {
      custo += PRECOS.mysql_enterprise;
    } else if (vm.bancoDados === 'mongodb-enterprise') {
      custo += PRECOS.mongodb_enterprise;
    }
    
    // Aplicações
    if (vm.antivirus) custo += PRECOS.antivirus;
    if (vm.thinprint) custo += PRECOS.thinprint;
    if (vm.tsplus !== 'nenhum') {
      custo += PRECOS.tsplus[vm.tsplus as keyof typeof PRECOS.tsplus] || 0;
    }
    
    // WAF
    if (vm.waf === 'pro') custo += PRECOS.waf_pro;
    else if (vm.waf === 'business') custo += PRECOS.waf_business;
    else if (vm.waf === 'enterprise') custo += PRECOS.waf_enterprise;
    
    // IPs Adicionais
    custo += vm.ipsAdicionais * PRECOS.ip_adicional;
    
    // Desconto
    const desconto = custo * (vm.desconto / 100);
    
    return {
      infraestrutura: custoVCPU + custoRAM + custoSSD + custoFCM + PRECOS.monitoramento,
      licenciamento: custo - (custoVCPU + custoRAM + custoSSD + custoFCM + PRECOS.monitoramento),
      subtotal: custo,
      desconto,
      total: custo - desconto
    };
  };

  const calcularTotal = () => {
    return vms.reduce((total, vm) => total + calcularVM(vm).total, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const vmEmEdicao = editingVm ? vms.find(vm => vm.id === editingVm) : null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#2d2d2d] p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] bg-clip-text text-transparent">
              Optidata Cloud Calculator
            </h1>
            <p className="text-gray-400 mt-1">Calculadora Premium de Custos</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Mensal</p>
              <p className="text-2xl font-bold text-[#DCAE1D]">
                {formatCurrency(calcularTotal())}
              </p>
            </div>
            <button
              onClick={criarNovaVM}
              className="bg-[#DCAE1D] text-[#0f0f0f] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#B8941A] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nova VM
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Lista de VMs */}
          <div className="lg:col-span-8">
            {vms.length === 0 ? (
              <div className="bg-[#1e1e1e] rounded-lg p-12 text-center border border-[#2d2d2d]">
                <div className="w-16 h-16 bg-[#2d2d2d] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-[#DCAE1D]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nenhuma VM configurada</h3>
                <p className="text-gray-400 mb-6">Comece criando sua primeira máquina virtual</p>
                <button
                  onClick={criarNovaVM}
                  className="bg-[#DCAE1D] text-[#0f0f0f] px-6 py-3 rounded-lg font-semibold"
                >
                  Criar primeira VM
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {vms.map(vm => {
                  const custo = calcularVM(vm);
                  const isEditing = editingVm === vm.id;
                  
                  return (
                    <div
                      key={vm.id}
                      className="bg-[#1e1e1e] rounded-lg border border-[#2d2d2d] overflow-hidden"
                    >
                      {/* Header do Card */}
                      <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#DCAE1D] to-[#F4C430] rounded-lg flex items-center justify-center">
                            <Cpu className="w-6 h-6 text-[#0f0f0f]" />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={vm.nome}
                              onChange={(e) => atualizarVM(vm.id, 'nome', e.target.value)}
                              className="text-lg font-semibold bg-transparent border-none text-white focus:outline-none focus:bg-[#0f0f0f] rounded px-2 py-1"
                            />
                            <p className="text-sm text-gray-400">
                              {vm.vcpu} vCPU • {vm.ram} GB RAM • {vm.ssd + vm.fcm} GB Storage
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-[#DCAE1D]">
                            {formatCurrency(custo.total)}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingVm(isEditing ? null : vm.id)}
                              className="p-2 text-gray-400 hover:text-[#DCAE1D] hover:bg-[#2d2d2d] rounded-lg transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => duplicarVM(vm.id)}
                              className="p-2 text-gray-400 hover:text-[#DCAE1D] hover:bg-[#2d2d2d] rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removerVM(vm.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Configuração Expandida */}
                      {isEditing && (
                        <div className="px-6 pb-6 border-t border-[#2d2d2d]">
                          <div className="grid md:grid-cols-2 gap-6 mt-6">
                            {/* Coluna Esquerda - Recursos */}
                            <div className="space-y-6">
                              <div>
                                <label className="block text-sm font-medium mb-3 text-gray-300 flex items-center gap-2">
                                  <Cpu className="w-4 h-4 text-[#DCAE1D]" />
                                  vCPU: {vm.vcpu}
                                </label>
                                <input
                                  type="range"
                                  min="1"
                                  max="128"
                                  value={vm.vcpu}
                                  onChange={(e) => atualizarVM(vm.id, 'vcpu', parseInt(e.target.value))}
                                  className="w-full h-2 bg-[#2d2d2d] rounded-lg appearance-none cursor-pointer slider-gold"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                  <span>1</span>
                                  <span>64</span>
                                  <span>128</span>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-3 text-gray-300 flex items-center gap-2">
                                  <Database className="w-4 h-4 text-[#DCAE1D]" />
                                  RAM: {vm.ram} GB
                                </label>
                                <input
                                  type="range"
                                  min="1"
                                  max="1024"
                                  value={vm.ram}
                                  onChange={(e) => atualizarVM(vm.id, 'ram', parseInt(e.target.value))}
                                  className="w-full h-2 bg-[#2d2d2d] rounded-lg appearance-none cursor-pointer slider-gold"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                  <span>1 GB</span>
                                  <span>512 GB</span>
                                  <span>1024 GB</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2 text-gray-300">
                                    SSD: {vm.ssd} GB
                                  </label>
                                  <input
                                    type="range"
                                    min="20"
                                    max="1000"
                                    step="10"
                                    value={vm.ssd}
                                    onChange={(e) => atualizarVM(vm.id, 'ssd', parseInt(e.target.value))}
                                    className="w-full h-2 bg-[#2d2d2d] rounded-lg appearance-none cursor-pointer slider-gold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2 text-gray-300">
                                    FCM: {vm.fcm} GB
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="2000"
                                    step="50"
                                    value={vm.fcm}
                                    onChange={(e) => atualizarVM(vm.id, 'fcm', parseInt(e.target.value))}
                                    className="w-full h-2 bg-[#2d2d2d] rounded-lg appearance-none cursor-pointer slider-gold"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Coluna Direita - Software */}
                            <div className="space-y-6">
                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                  Sistema Operacional
                                </label>
                                <select
                                  value={vm.sistemaOperacional}
                                  onChange={(e) => atualizarVM(vm.id, 'sistemaOperacional', e.target.value)}
                                  className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-lg px-4 py-3 text-white focus:border-[#DCAE1D] focus:outline-none"
                                >
                                  <option value="ubuntu">Ubuntu 22.04 LTS (Grátis)</option>
                                  <option value="centos">CentOS 7 (Grátis)</option>
                                  <option value="debian">Debian 12 (Grátis)</option>
                                  <option value="windows">Windows Server 2022 (+R$ {PRECOS.windows_server}/2vCPU)</option>
                                  <option value="rhel">Red Hat Enterprise Linux (+R$ {PRECOS.rhel})</option>
                                  <option value="suse">SUSE Linux Enterprise (+R$ {PRECOS.suse})</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                  Banco de Dados
                                </label>
                                <select
                                  value={vm.bancoDados}
                                  onChange={(e) => atualizarVM(vm.id, 'bancoDados', e.target.value)}
                                  className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-lg px-4 py-3 text-white focus:border-[#DCAE1D] focus:outline-none"
                                >
                                  <option value="nenhum">Nenhum</option>
                                  <option value="postgresql">PostgreSQL (Grátis)</option>
                                  <option value="mysql">MySQL Community (Grátis)</option>
                                  <option value="mariadb">MariaDB (Grátis)</option>
                                  <option value="sql-server-web">SQL Server Web (+R$ {PRECOS.sql_server_web}/2vCPU)</option>
                                  <option value="sql-server-std">SQL Server Standard (+R$ {PRECOS.sql_server_std}/2vCPU)</option>
                                  <option value="mysql-enterprise">MySQL Enterprise (+R$ {PRECOS.mysql_enterprise})</option>
                                  <option value="mongodb-enterprise">MongoDB Enterprise (+R$ {PRECOS.mongodb_enterprise})</option>
                                </select>
                              </div>

                              <div className="space-y-3">
                                <label className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg border border-[#2d2d2d] cursor-pointer hover:border-[#DCAE1D]/50">
                                  <span>Antivírus Premium</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-[#DCAE1D]">R$ {PRECOS.antivirus}/mês</span>
                                    <input
                                      type="checkbox"
                                      checked={vm.antivirus}
                                      onChange={(e) => atualizarVM(vm.id, 'antivirus', e.target.checked)}
                                      className="w-4 h-4 accent-[#DCAE1D]"
                                    />
                                  </div>
                                </label>

                                <label className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg border border-[#2d2d2d] cursor-pointer hover:border-[#DCAE1D]/50">
                                  <span>ThinPrint</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-[#DCAE1D]">R$ {PRECOS.thinprint}/mês</span>
                                    <input
                                      type="checkbox"
                                      checked={vm.thinprint}
                                      onChange={(e) => atualizarVM(vm.id, 'thinprint', e.target.checked)}
                                      className="w-4 h-4 accent-[#DCAE1D]"
                                    />
                                  </div>
                                </label>
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                  TSPlus (Terminal Server)
                                </label>
                                <select
                                  value={vm.tsplus}
                                  onChange={(e) => atualizarVM(vm.id, 'tsplus', e.target.value)}
                                  className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-lg px-4 py-3 text-white focus:border-[#DCAE1D] focus:outline-none"
                                >
                                  <option value="nenhum">Nenhum</option>
                                  <option value="3">3 usuários (+R$ {PRECOS.tsplus[3]})</option>
                                  <option value="5">5 usuários (+R$ {PRECOS.tsplus[5]})</option>
                                  <option value="10">10 usuários (+R$ {PRECOS.tsplus[10]})</option>
                                  <option value="15">15 usuários (+R$ {PRECOS.tsplus[15]})</option>
                                  <option value="25">25 usuários (+R$ {PRECOS.tsplus[25]})</option>
                                  <option value="35">35 usuários (+R$ {PRECOS.tsplus[35]})</option>
                                  <option value="49">49 usuários (+R$ {PRECOS.tsplus[49]})</option>
                                  <option value="ilimitado">Ilimitado (+R$ {PRECOS.tsplus.ilimitado})</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                  WAF (Web Application Firewall)
                                </label>
                                <select
                                  value={vm.waf}
                                  onChange={(e) => atualizarVM(vm.id, 'waf', e.target.value)}
                                  className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-lg px-4 py-3 text-white focus:border-[#DCAE1D] focus:outline-none"
                                >
                                  <option value="nenhum">Nenhum</option>
                                  <option value="pro">WAF Pro (+R$ {PRECOS.waf_pro})</option>
                                  <option value="business">WAF Business (+R$ {PRECOS.waf_business})</option>
                                  <option value="enterprise">WAF Enterprise (+R$ {PRECOS.waf_enterprise})</option>
                                </select>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2 text-gray-300">
                                    IPs Adicionais: {vm.ipsAdicionais}
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={vm.ipsAdicionais}
                                    onChange={(e) => atualizarVM(vm.id, 'ipsAdicionais', parseInt(e.target.value))}
                                    className="w-full h-2 bg-[#2d2d2d] rounded-lg appearance-none cursor-pointer slider-gold"
                                  />
                                  <p className="text-xs text-gray-400 mt-1">R$ {PRECOS.ip_adicional}/IP</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Desconto: {vm.desconto}%
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={vm.desconto}
                                    onChange={(e) => atualizarVM(vm.id, 'desconto', parseInt(e.target.value))}
                                    className="w-full h-2 bg-[#2d2d2d] rounded-lg appearance-none cursor-pointer slider-gold"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar de Cálculo */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <div className="bg-[#1e1e1e] rounded-lg p-6 border border-[#2d2d2d]">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#DCAE1D]" />
                  Resumo do Investimento
                </h3>

                <div className="space-y-4">
                  {vms.map(vm => {
                    const custo = calcularVM(vm);
                    return (
                      <div key={vm.id} className="flex justify-between items-center py-2 border-b border-[#2d2d2d]">
                        <span className="text-sm text-gray-300">{vm.nome}</span>
                        <span className="font-semibold">{formatCurrency(custo.total)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-[#DCAE1D]/30">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Mensal:</span>
                    <span className="text-3xl font-bold text-[#DCAE1D]">
                      {formatCurrency(calcularTotal())}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {vms.length} VM{vms.length !== 1 ? 's' : ''} configurada{vms.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {vms.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <button className="w-full bg-[#DCAE1D] text-[#0f0f0f] py-3 rounded-lg font-semibold hover:bg-[#B8941A] transition-colors">
                      Gerar Proposta
                    </button>
                    <button className="w-full border-2 border-[#DCAE1D] text-[#DCAE1D] py-3 rounded-lg font-semibold hover:bg-[#DCAE1D] hover:text-[#0f0f0f] transition-colors">
                      Exportar PDF
                    </button>
                  </div>
                )}
              </div>

              {/* TCO Preview */}
              {vms.length > 0 && (
                <div className="bg-[#1e1e1e] rounded-lg p-6 mt-6 border border-[#2d2d2d]">
                  <h4 className="font-semibold mb-4">Projeção TCO</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">12 meses</span>
                      <span className="font-semibold">{formatCurrency(calcularTotal() * 12)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">24 meses</span>
                      <span className="font-semibold">{formatCurrency(calcularTotal() * 24)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#2d2d2d]">
                      <span className="text-sm font-medium">36 meses</span>
                      <span className="font-bold text-[#DCAE1D]">{formatCurrency(calcularTotal() * 36)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider-gold::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #DCAE1D;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(220, 174, 29, 0.3);
        }
        
        .slider-gold::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #DCAE1D;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(220, 174, 29, 0.3);
        }
      `}</style>
    </div>
  );
};

export default CloudCalculator;
