
import React from 'react';
import { 
  Monitor, 
  Database, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Shield, 
  Cloud,
  Network,
  Server,
  Lock,
  Zap
} from 'lucide-react';

interface ProfessionalIconProps {
  type: string;
  size?: number;
  className?: string;
}

const ProfessionalIcon = ({ type, size = 20, className = "" }: ProfessionalIconProps) => {
  const iconProps = {
    size,
    strokeWidth: 1.5
  };

  // Sistema de cores categorizadas
  const getIconColor = (type: string) => {
    // Produtos Microsoft - Azul escuro
    if (['windows', 'sqlserver'].includes(type)) {
      return 'text-blue-700';
    }
    
    // Produtos Oracle e Red Hat - Vermelho
    if (['oracle', 'redhat'].includes(type)) {
      return 'text-red-600';
    }
    
    // Produtos open source gratuitos - Verde
    if (['ubuntu', 'centos', 'rocky', 'alma', 'debian', 'postgresql', 'mysql', 'mariadb', 'mongodb', 'redis', 'elasticsearch'].includes(type)) {
      return 'text-green-600';
    }
    
    // Produtos enterprise pagos - Roxo
    if (['sap', 'cassandra', 'mysql-enterprise', 'mongodb-enterprise'].includes(type)) {
      return 'text-purple-600';
    }
    
    // Recursos e serviços - Cinza
    return 'text-gray-600';
  };

  const colorClass = getIconColor(type);
  const combinedClassName = `${className} ${colorClass}`;

  // Sistemas operacionais - todos usam ícone de Monitor
  if (['windows', 'redhat', 'ubuntu', 'centos', 'rocky', 'alma', 'debian'].includes(type)) {
    return <Monitor {...iconProps} className={combinedClassName} />;
  }

  // Bancos de dados - todos usam ícone de Database
  if (['sqlserver', 'oracle', 'postgresql', 'mysql', 'mariadb', 'mongodb', 'redis', 'elasticsearch', 'sap', 'cassandra'].includes(type)) {
    return <Database {...iconProps} className={combinedClassName} />;
  }

  // Recursos de hardware
  if (['vcpu', 'cpu'].includes(type)) {
    return <Cpu {...iconProps} className={combinedClassName} />;
  }

  if (['ram', 'memory'].includes(type)) {
    return <MemoryStick {...iconProps} className={combinedClassName} />;
  }

  if (['storage', 'ssd', 'fcm'].includes(type)) {
    return <HardDrive {...iconProps} className={combinedClassName} />;
  }

  // Serviços
  if (['backup'].includes(type)) {
    return <Shield {...iconProps} className={combinedClassName} />;
  }

  if (['network'].includes(type)) {
    return <Network {...iconProps} className={combinedClassName} />;
  }

  if (['cloud'].includes(type)) {
    return <Cloud {...iconProps} className={combinedClassName} />;
  }

  if (['antivirus', 'security'].includes(type)) {
    return <Lock {...iconProps} className={combinedClassName} />;
  }

  if (['performance', 'monitoring'].includes(type)) {
    return <Zap {...iconProps} className={combinedClassName} />;
  }

  // Fallback para tipos não reconhecidos
  return <Server {...iconProps} className={combinedClassName} />;
};

export default ProfessionalIcon;
