
import React from 'react';
import { 
  Monitor, 
  Database, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Shield, 
  Cloud,
  Network 
} from 'lucide-react';

interface ProfessionalIconProps {
  type: string;
  size?: number;
  className?: string;
}

const ProfessionalIcon = ({ type, size = 20, className = "" }: ProfessionalIconProps) => {
  const iconProps = {
    size,
    className: `${className}`,
    strokeWidth: 1.5
  };

  // Ícones para sistemas operacionais
  if (type === 'windows') {
    return (
      <div className={`inline-flex items-center justify-center`} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
          <path
            fill="#0078d4"
            d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.851"
          />
        </svg>
      </div>
    );
  }

  if (type === 'redhat') {
    return (
      <div className={`inline-flex items-center justify-center`} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
          <path
            fill="#ee0000"
            d="M16.009 11.887c-.138 0-.271-.017-.271-.155 0-.07.034-.138.103-.155.31-.086.62-.172.895-.31.275-.138.482-.344.62-.551.138-.206.207-.448.207-.689 0-.31-.103-.586-.31-.793-.206-.206-.482-.31-.793-.31-.31 0-.586.103-.793.31-.206.206-.31.482-.31.793 0 .241.069.482.207.689.138.206.344.413.62.551.275.138.586.224.895.31.069.017.103.086.103.155 0 .138-.138.155-.271.155z"
          />
          <path
            fill="#ee0000"
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
          />
        </svg>
      </div>
    );
  }

  if (type === 'ubuntu') {
    return (
      <div className={`inline-flex items-center justify-center`} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="10" fill="#e95420" />
          <circle cx="12" cy="12" r="3" fill="white" />
          <circle cx="6" cy="12" r="2" fill="white" />
          <circle cx="18" cy="12" r="2" fill="white" />
          <circle cx="12" cy="6" r="2" fill="white" />
        </svg>
      </div>
    );
  }

  if (type === 'centos' || type === 'rocky' || type === 'alma' || type === 'debian') {
    return (
      <div className={`inline-flex items-center justify-center text-xs font-bold text-white bg-gray-600 rounded`} 
           style={{ width: size, height: size }}>
        {type === 'centos' ? 'C' : type === 'rocky' ? 'R' : type === 'alma' ? 'A' : 'D'}
      </div>
    );
  }

  // Ícones para bancos de dados
  if (type === 'sqlserver') {
    return (
      <div className={`inline-flex items-center justify-center`} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
          <path
            fill="#cc2927"
            d="M12 2l-8 4v8l8 4 8-4V6l-8-4zm0 2.5L17.5 7 12 9.5 6.5 7 12 4.5zm-6 5.5l6 3v5l-6-3v-5zm12 0v5l-6 3v-5l6-3z"
          />
        </svg>
      </div>
    );
  }

  if (type === 'oracle') {
    return (
      <div className={`inline-flex items-center justify-center`} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
          <ellipse cx="12" cy="12" rx="10" ry="6" fill="none" stroke="#f80000" strokeWidth="2" />
          <path fill="#f80000" d="M8 10h8v4H8z" />
        </svg>
      </div>
    );
  }

  if (type === 'postgresql') {
    return (
      <div className={`inline-flex items-center justify-center`} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
          <path
            fill="#336791"
            d="M17.128 0C15.506.006 14.017.394 12.825 1.169c-.955.622-1.463 1.375-1.463 2.219v2.5c0 .844.508 1.597 1.463 2.219 1.192.775 2.681 1.163 4.303 1.169h.6c.844 0 1.597-.508 2.219-1.463.775-1.192 1.163-2.681 1.169-4.303V2.9c-.006-1.622-.394-3.111-1.169-4.303C19.325.222 18.572-.006 17.728 0h-.6z"
          />
        </svg>
      </div>
    );
  }

  if (type === 'mysql') {
    return (
      <div className={`inline-flex items-center justify-center`} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
          <path
            fill="#00758f"
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10c1.821 0 3.527-.487 4.997-1.34-.17-.066-.326-.148-.464-.248-1.123-.815-1.781-2.047-1.781-3.333 0-1.286.658-2.518 1.781-3.333.902-.67 2.098-.98 3.356-.872.42.036.828.116 1.209.234.55-1.302.852-2.729.852-4.228C22 6.477 17.523 2 12 2z"
          />
        </svg>
      </div>
    );
  }

  if (type === 'mongodb') {
    return (
      <div className={`inline-flex items-center justify-center`} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
          <path
            fill="#4db33d"
            d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
          />
        </svg>
      </div>
    );
  }

  if (type === 'redis' || type === 'mariadb' || type === 'elasticsearch' || type === 'sap' || type === 'cassandra') {
    return (
      <div className={`inline-flex items-center justify-center text-xs font-bold text-white bg-gray-700 rounded`} 
           style={{ width: size, height: size }}>
        {type === 'redis' ? 'R' : 
         type === 'mariadb' ? 'M' : 
         type === 'elasticsearch' ? 'E' :
         type === 'sap' ? 'S' : 'C'}
      </div>
    );
  }

  // Ícones de recursos usando Lucide
  const resourceIcons: { [key: string]: React.ComponentType<any> } = {
    vcpu: Cpu,
    cpu: Cpu,
    ram: MemoryStick,
    memory: MemoryStick,
    storage: HardDrive,
    ssd: HardDrive,
    fcm: HardDrive,
    backup: Shield,
    monitor: Monitor,
    database: Database,
    network: Network,
    cloud: Cloud
  };

  const IconComponent = resourceIcons[type.toLowerCase()];
  
  if (IconComponent) {
    return <IconComponent {...iconProps} />;
  }

  // Fallback para tipos não reconhecidos
  return <Monitor {...iconProps} />;
};

export default ProfessionalIcon;
