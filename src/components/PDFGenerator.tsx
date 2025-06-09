
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { VM } from '@/types';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { ProposalData } from './ProposalModal';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#0066CC',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    backgroundColor: '#F8F9FA',
    padding: 8,
  },
  text: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 5,
  },
  boldText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 35,
  },
  tableCol: {
    width: '25%',
    padding: 8,
  },
  tableCell: {
    fontSize: 10,
    color: '#374151',
  },
  totalSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 5,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066CC',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTop: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
});

interface PDFDocumentProps {
  vms: VM[];
  calculadora: CalculadoraCloud;
  proposalData: ProposalData;
  totalValue: number;
  economia: number;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ 
  vms, 
  calculadora, 
  proposalData, 
  totalValue, 
  economia 
}) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const validityDate = new Date();
  validityDate.setDate(validityDate.getDate() + parseInt(proposalData.validity));

  return (
    <Document>
      {/* Página 1 - Capa */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>OPTIDATA</Text>
          <Text style={styles.subtitle}>Soluções em Nuvem</Text>
        </View>

        <View style={{ alignItems: 'center', marginTop: 100 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#0066CC', marginBottom: 20 }}>
            PROPOSTA DE CLOUD PRIVADA
          </Text>
          
          <Text style={{ fontSize: 18, marginBottom: 40 }}>
            {proposalData.clientName}
          </Text>

          <View style={{ marginBottom: 40 }}>
            <Text style={styles.text}>Data: {currentDate}</Text>
            <Text style={styles.text}>Validade: {validityDate.toLocaleDateString('pt-BR')}</Text>
            {proposalData.email && <Text style={styles.text}>Email: {proposalData.email}</Text>}
            {proposalData.phone && <Text style={styles.text}>Telefone: {proposalData.phone}</Text>}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={{ fontSize: 10, color: '#666666' }}>
            Optidata - Infraestrutura Enterprise de Alta Performance
          </Text>
        </View>
      </Page>

      {/* Página 2 - Resumo Executivo */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>RESUMO EXECUTIVO</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investimento Mensal</Text>
          <View style={styles.totalSection}>
            <Text style={styles.totalText}>{formatCurrency(totalValue)}</Text>
          </View>
        </View>

        {economia > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Economia Aplicada</Text>
            <Text style={styles.boldText}>Economia mensal: {formatCurrency(economia)}</Text>
            <Text style={styles.text}>
              Desconto de {((economia / (totalValue + economia)) * 100).toFixed(1)}% aplicado
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Infraestrutura</Text>
          <Text style={styles.text}>Quantidade de servidores: {vms.length}</Text>
          <Text style={styles.text}>SLA garantido: 99.99%</Text>
          <Text style={styles.text}>Certificação: ISO 27001</Text>
          <Text style={styles.text}>Datacenter: Tier III</Text>
        </View>

        {proposalData.observations && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text style={styles.text}>{proposalData.observations}</Text>
          </View>
        )}
      </Page>

      {/* Página 3+ - Detalhamento */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>DETALHAMENTO TÉCNICO</Text>
        </View>

        {vms.map((vm, index) => {
          const custo = calculadora.calcularVM(vm);
          return (
            <View key={vm.id} style={styles.section}>
              <Text style={styles.sectionTitle}>Servidor {index + 1} - {vm.nome}</Text>
              
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.boldText}>Recurso</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.boldText}>Quantidade</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.boldText}>Valor Unit.</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.boldText}>Total</Text>
                  </View>
                </View>
                
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>vCPU</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{vm.vcpu}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>-</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{formatCurrency(custo.vcpu)}</Text>
                  </View>
                </View>

                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>RAM (GB)</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{vm.ram}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>-</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{formatCurrency(custo.ram)}</Text>
                  </View>
                </View>

                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>Storage (GB)</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{vm.discoFCM + vm.discoSSD}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>-</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{formatCurrency(custo.storage)}</Text>
                  </View>
                </View>

                {Object.entries(custo.licencas).map(([licenca, valor]) => (
                  valor > 0 && (
                    <View key={licenca} style={styles.tableRow}>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>{licenca}</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>1</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>-</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>{formatCurrency(valor)}</Text>
                      </View>
                    </View>
                  )
                ))}
              </View>

              <View style={{ marginTop: 10, alignItems: 'flex-end' }}>
                <Text style={styles.boldText}>
                  Subtotal: {formatCurrency(custo.total)}
                </Text>
              </View>
            </View>
          );
        })}
      </Page>

      {/* Última Página - Termos */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>TERMOS E CONDIÇÕES</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condições Comerciais</Text>
          <Text style={styles.text}>• Valores válidos por {proposalData.validity} dias</Text>
          <Text style={styles.text}>• Preços em Reais (BRL)</Text>
          <Text style={styles.text}>• Faturamento mensal</Text>
          <Text style={styles.text}>• SLA de 99.99% de disponibilidade</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          <Text style={styles.text}>• Suporte técnico 24x7</Text>
          <Text style={styles.text}>• Monitoramento proativo</Text>
          <Text style={styles.text}>• Backup automático incluído</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato Comercial</Text>
          <Text style={styles.text}>Optidata Soluções em Nuvem</Text>
          <Text style={styles.text}>Email: comercial@optidata.com.br</Text>
          <Text style={styles.text}>Telefone: (11) 3333-4444</Text>
        </View>

        <View style={{ marginTop: 60, borderTop: 1, borderTopColor: '#E5E7EB', paddingTop: 20 }}>
          <Text style={styles.text}>Assinatura do Cliente:</Text>
          <Text style={{ marginTop: 40, borderBottom: 1, borderBottomColor: '#E5E7EB' }}>
            {' '}
          </Text>
          <Text style={{ fontSize: 10, color: '#666666', marginTop: 5 }}>
            {proposalData.clientName}
          </Text>
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
  const doc = (
    <PDFDocument
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
  link.download = `Proposta_${proposalData.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default PDFDocument;
