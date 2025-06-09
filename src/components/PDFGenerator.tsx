
import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Font } from '@react-pdf/renderer';
import { VM } from '@/types';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { ProposalData } from './ProposalModal';

// Register Inter font family
Font.register({
  family: 'Inter',
  fonts: [
    { 
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
      fontWeight: 'normal'
    },
    { 
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', 
      fontWeight: 600 
    },
    { 
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2', 
      fontWeight: 700 
    },
  ]
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    backgroundColor: '#FFFFFF',
  },
  
  // PÁGINA 1 - CAPA
  coverPage: {
    position: 'relative',
    height: '100%',
  },
  coverBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: '#1a1a1a',
  },
  coverPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#C7D82B',
    opacity: 0.1,
  },
  coverContent: {
    position: 'absolute',
    top: '25%',
    left: 60,
    right: 60,
  },
  projectTitle: {
    fontSize: 14,
    color: '#C7D82B',
    marginBottom: 10,
    fontWeight: 600,
  },
  clientName: {
    fontSize: 48,
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 30,
  },
  optidataLogo: {
    position: 'absolute',
    bottom: 100,
    left: 60,
    right: 60,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  
  // PÁGINA 2 - YOUR NEXT LEVEL
  nextLevelPage: {
    padding: 60,
  },
  nextLevelTitle: {
    fontSize: 36,
    fontWeight: 700,
    color: '#000000',
  },
  yellowHighlight: {
    color: '#C7D82B',
  },
  nextLevelSubtitle: {
    fontSize: 18,
    color: '#333333',
    lineHeight: 1.6,
    marginTop: 40,
  },
  
  // PÁGINA 3 - NÚMEROS
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  numberCard: {
    width: '30%',
    marginBottom: 30,
    alignItems: 'center',
  },
  numberIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    marginBottom: 15,
  },
  numberValue: {
    fontSize: 28,
    fontWeight: 700,
    color: '#000000',
    marginBottom: 5,
  },
  numberLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  
  // CERTIFICAÇÕES
  certificationsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    paddingTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  certBadge: {
    alignItems: 'center',
  },
  certIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 10,
  },
  
  // TABELAS DE SERVIÇOS
  servicesTable: {
    marginTop: 30,
  },
  tableHeader: {
    backgroundColor: '#C7D82B',
    padding: 15,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#000000',
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    padding: 15,
  },
  vmTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#000000',
    marginBottom: 5,
  },
  vmSpecs: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 1.4,
  },
  
  // RESUMO DE CUSTOS
  costSummary: {
    marginTop: 40,
    padding: 30,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  costLabel: {
    fontSize: 14,
    color: '#666666',
  },
  costValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#000000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#C7D82B',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 700,
    color: '#000000',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 700,
    color: '#000000',
  },
  
  // FOOTER
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageNumber: {
    fontSize: 10,
    color: '#999999',
  },
});

interface PDFDocumentProps {
  vms: VM[];
  calculadora: CalculadoraCloud;
  proposalData: ProposalData;
  totalValue: number;
  economia: number;
}

const PropostaPDF: React.FC<PDFDocumentProps> = ({ 
  vms, 
  calculadora, 
  proposalData, 
  totalValue, 
  economia 
}) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  
  return (
    <Document>
      {/* PÁGINA 1 - CAPA */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <View style={styles.coverBackground} />
          <View style={styles.coverPattern} />
          
          <View style={styles.coverContent}>
            <Text style={styles.projectTitle}>PROJETO</Text>
            <Text style={styles.clientName}>{proposalData.clientName.toUpperCase()}</Text>
          </View>
          
          <View style={styles.optidataLogo}>
            <Text style={styles.logoText}>Optidata</Text>
          </View>
          
          {/* Elementos gráficos decorativos */}
          <View style={{
            position: 'absolute',
            top: 100,
            right: 60,
            width: 300,
            height: 300,
          }}>
            {[...Array(5)].map((_, i) => (
              <View key={i} style={{
                position: 'absolute',
                top: i * 60,
                right: i * 30,
                width: 50,
                height: 50,
                backgroundColor: i % 2 === 0 ? '#C7D82B' : '#8B5CF6',
                opacity: 0.8,
              }} />
            ))}
          </View>
        </View>
      </Page>
      
      {/* PÁGINA 2 - YOUR NEXT LEVEL */}
      <Page size="A4" style={[styles.page, styles.nextLevelPage]}>
        <Text style={styles.nextLevelTitle}>
          YOUR <Text style={styles.yellowHighlight}>→</Text> NEXT
        </Text>
        <Text style={[styles.nextLevelTitle, { marginBottom: 40 }]}>
          LEVEL
        </Text>
        
        <Text style={styles.nextLevelSubtitle}>
          Organizar, armazenar e processar,{'\n'}
          permitindo que você foque no seu{'\n'}
          negócio para gerar mais resultados.
        </Text>
        
        {/* Imagens ilustrativas */}
        <View style={{ flexDirection: 'row', marginTop: 60, gap: 10 }}>
          {[1, 2, 3].map(i => (
            <View key={i} style={{
              width: 150,
              height: 100,
              backgroundColor: '#F5F5F5',
              borderRadius: 8,
            }} />
          ))}
        </View>
      </Page>
      
      {/* PÁGINA 3 - NÚMEROS DA OPTIDATA */}
      <Page size="A4" style={[styles.page, { padding: 60 }]}>
        <Text style={[styles.nextLevelTitle, { marginBottom: 40 }]}>
          Optidata em números.
        </Text>
        
        <View style={styles.numbersGrid}>
          <View style={styles.numberCard}>
            <View style={styles.numberIcon} />
            <Text style={styles.numberValue}>4</Text>
            <Text style={styles.numberLabel}>Data Centers{'\n'}Certificados</Text>
          </View>
          
          <View style={styles.numberCard}>
            <View style={styles.numberIcon} />
            <Text style={styles.numberValue}>+15PB</Text>
            <Text style={styles.numberLabel}>Dados{'\n'}Processados</Text>
          </View>
          
          <View style={styles.numberCard}>
            <View style={styles.numberIcon} />
            <Text style={styles.numberValue}>+5MM</Text>
            <Text style={styles.numberLabel}>Acessos{'\n'}Simultâneos</Text>
          </View>
          
          <View style={styles.numberCard}>
            <View style={styles.numberIcon} />
            <Text style={styles.numberValue}>+7.000</Text>
            <Text style={styles.numberLabel}>Clientes{'\n'}Corporativos</Text>
          </View>
          
          <View style={styles.numberCard}>
            <View style={styles.numberIcon} />
            <Text style={styles.numberValue}>+25.000</Text>
            <Text style={styles.numberLabel}>Servidores{'\n'}Gerenciados</Text>
          </View>
        </View>
        
        <Text style={[styles.nextLevelTitle, { fontSize: 24, marginTop: 60, marginBottom: 30 }]}>
          Certificações internacionais.
        </Text>
        
        <View style={styles.certificationsRow}>
          {['TIER III\nDESIGN', 'TIER III\nFACILITY', 'PCI DSS', 'ISO 27001', 'ISO 27701'].map((cert, i) => (
            <View key={i} style={styles.certBadge}>
              <View style={styles.certIcon} />
              <Text style={{ fontSize: 10, textAlign: 'center' }}>{cert}</Text>
            </View>
          ))}
        </View>
      </Page>
      
      {/* PÁGINA 4 - DETALHAMENTO DOS SERVIÇOS */}
      <Page size="A4" style={[styles.page, { padding: 60 }]}>
        <Text style={[styles.nextLevelTitle, { fontSize: 28, marginBottom: 40 }]}>
          Configuração dos Servidores
        </Text>
        
        <View style={styles.servicesTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>
              ESTRUTURA PARA COMPUTAÇÃO OPTICLOUD
            </Text>
          </View>
          
          {vms.map((vm, index) => {
            const custo = calculadora.calcularVM(vm);
            const licencas = [];
            if (vm.windowsServer) licencas.push('Windows Server');
            if (vm.rhel) licencas.push('RHEL');
            if (vm.suse) licencas.push('SUSE');
            if (vm.sqlServerSTD) licencas.push('SQL Server');
            
            return (
              <View key={vm.id} style={styles.tableRow}>
                <Text style={styles.vmTitle}>Servidor {index + 1} - {vm.nome}</Text>
                <Text style={styles.vmSpecs}>
                  {vm.vcpu} vCPUs • {vm.ram}GB RAM • {vm.discoFCM + vm.discoSSD}GB Storage
                  {licencas.length > 0 && ` • ${licencas.join(', ')}`}
                </Text>
              </View>
            );
          })}
        </View>
        
        {/* RESUMO DE CUSTOS DETALHADO */}
        <View style={styles.costSummary}>
          <Text style={[styles.nextLevelTitle, { fontSize: 20, marginBottom: 20 }]}>
            Resumo de Custos
          </Text>
          
          {vms.map((vm, index) => {
            const custo = calculadora.calcularVM(vm);
            return (
              <View key={vm.id} style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
                  Servidor {index + 1} - {vm.nome}
                </Text>
                
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Infraestrutura (vCPU + RAM)</Text>
                  <Text style={styles.costValue}>{formatCurrency(custo.vcpu + custo.ram)}</Text>
                </View>
                
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Armazenamento + Backup</Text>
                  <Text style={styles.costValue}>{formatCurrency(custo.storage + custo.backup)}</Text>
                </View>
                
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Monitoramento</Text>
                  <Text style={styles.costValue}>{formatCurrency(custo.monitoramento)}</Text>
                </View>
                
                {custo.subtotalLicencas > 0 && (
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Licenças</Text>
                    <Text style={styles.costValue}>{formatCurrency(custo.subtotalLicencas)}</Text>
                  </View>
                )}
                
                <View style={[styles.costRow, { borderTopWidth: 1, borderTopColor: '#E5E5E5', paddingTop: 10, marginTop: 10 }]}>
                  <Text style={[styles.costLabel, { fontWeight: 600 }]}>Subtotal</Text>
                  <Text style={[styles.costValue, { fontWeight: 700 }]}>{formatCurrency(custo.total)}</Text>
                </View>
              </View>
            );
          })}
          
          {economia > 0 && (
            <View style={styles.costRow}>
              <Text style={[styles.costLabel, { color: '#10B981' }]}>Desconto Aplicado</Text>
              <Text style={[styles.costValue, { color: '#10B981' }]}>-{formatCurrency(economia)}</Text>
            </View>
          )}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Mensal</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalValue)}</Text>
          </View>
        </View>
      </Page>
      
      {/* PÁGINA 5 - CONDIÇÕES COMERCIAIS */}
      <Page size="A4" style={[styles.page, { padding: 60 }]}>
        <Text style={[styles.nextLevelTitle, { fontSize: 28, marginBottom: 40 }]}>
          Condições Comerciais
        </Text>
        
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
            Prazo de Ativação
          </Text>
          <Text style={{ fontSize: 14, color: '#666666', lineHeight: 1.6 }}>
            Até 10 (dez) dias úteis após assinatura do contrato
          </Text>
        </View>
        
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
            Validade da Proposta
          </Text>
          <Text style={{ fontSize: 14, color: '#666666' }}>
            {proposalData.validity} dias
          </Text>
        </View>
        
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
            Condições de Pagamento
          </Text>
          <Text style={{ fontSize: 14, color: '#666666', lineHeight: 1.6 }}>
            • Contrato de 12 meses com renovação automática{'\n'}
            • Pagamento mensal via boleto ou transferência{'\n'}
            • Reajuste anual pelo IPCA{'\n'}
            • SLA de 99.99% de disponibilidade garantido
          </Text>
        </View>
        
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
            Suporte Incluído
          </Text>
          <Text style={{ fontSize: 14, color: '#666666', lineHeight: 1.6 }}>
            • Suporte técnico 24x7x365{'\n'}
            • Monitoramento proativo da infraestrutura{'\n'}
            • Backup automático diário incluído{'\n'}
            • Atualizações de segurança automáticas
          </Text>
        </View>
        
        {proposalData.observations && (
          <View style={{ marginTop: 40 }}>
            <Text style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
              Observações
            </Text>
            <Text style={{ fontSize: 14, color: '#666666', lineHeight: 1.6 }}>
              {proposalData.observations}
            </Text>
          </View>
        )}
        
        <View style={{ marginTop: 60 }}>
          <View style={{ borderTopWidth: 1, borderTopColor: '#E5E5E5', paddingTop: 30 }}>
            <Text style={{ fontSize: 12, color: '#999999' }}>
              Proposta gerada em: {currentDate}
            </Text>
            {proposalData.email && (
              <Text style={{ fontSize: 12, color: '#999999', marginTop: 5 }}>
                Email: {proposalData.email}
              </Text>
            )}
            {proposalData.phone && (
              <Text style={{ fontSize: 12, color: '#999999', marginTop: 5 }}>
                Telefone: {proposalData.phone}
              </Text>
            )}
          </View>
        </View>
      </Page>
      
      {/* PÁGINA FINAL - CONTATO */}
      <Page size="A4" style={styles.page}>
        <View style={{
          flex: 1,
          backgroundColor: '#1a1a1a',
          padding: 60,
          justifyContent: 'center',
        }}>
          <Text style={[styles.nextLevelTitle, { color: '#FFFFFF', marginBottom: 10 }]}>
            Vamos escalar
          </Text>
          <Text style={[styles.nextLevelTitle, { color: '#FFFFFF', marginBottom: 10 }]}>
            seu negócio por meio
          </Text>
          <Text style={[styles.nextLevelTitle, { color: '#FFFFFF', marginBottom: 10 }]}>
            da tecnologia<Text style={{ color: '#C7D82B' }}>?</Text>
          </Text>
          
          <View style={{ marginTop: 60 }}>
            <Text style={{ fontSize: 24, fontWeight: 600, color: '#FFFFFF', marginBottom: 40 }}>
              optidata.cloud
            </Text>
            
            <View style={{ gap: 30 }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 600, color: '#C7D82B', marginBottom: 5 }}>
                  Optidata BR - Chapecó
                </Text>
                <Text style={{ fontSize: 12, color: '#CCCCCC' }}>
                  Av. Nereu Ramos, 1866 E - 4º andar{'\n'}
                  Passo dos Fortes - Chapecó/SC
                </Text>
              </View>
              
              <View>
                <Text style={{ fontSize: 14, fontWeight: 600, color: '#C7D82B', marginBottom: 5 }}>
                  Optidata BR - São Paulo
                </Text>
                <Text style={{ fontSize: 12, color: '#CCCCCC' }}>
                  Av. Dr. Chucri Zaidan, 1550{'\n'}
                  Conjunto 507 - São Paulo/SP
                </Text>
              </View>
              
              <View style={{ marginTop: 40 }}>
                <Text style={{ fontSize: 14, fontWeight: 600, color: '#C7D82B', marginBottom: 5 }}>
                  Contato Comercial
                </Text>
                <Text style={{ fontSize: 12, color: '#CCCCCC' }}>
                  Email: comercial@optidata.com.br{'\n'}
                  Telefone: (11) 3333-4444
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const generatePDF = async (
  vms: VM[],
  calculadora: CalculadoraCloud,
  proposalData: ProposalData,
  totalValue: number,
  economia: number
) => {
  try {
    const doc = (
      <PropostaPDF
        vms={vms}
        calculadora={calculadora}
        proposalData={proposalData}
        totalValue={totalValue}
        economia={economia}
      />
    );
    
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Proposta_Premium_${proposalData.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
};

export default PropostaPDF;
