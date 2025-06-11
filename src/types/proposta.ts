
export interface Proposta {
  id: string;
  nomeEmpresa: string;
  nomeProjeto: string;
  responsavelComercial: string;
  responsavelTecnico: string;
  dataCriacao: string;
  configuracao: {
    vms: any[];
    descontos: any[];
    valorTotal: number;
  };
}
