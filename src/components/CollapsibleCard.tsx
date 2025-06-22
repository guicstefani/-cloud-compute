
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useCollapsible } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';

interface CollapsibleCardProps {
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
  value?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

const CollapsibleCard = ({
  title,
  icon,
  subtitle,
  value,
  children,
  defaultExpanded = false,
  className
}: CollapsibleCardProps) => {
  const { isExpanded, toggle, isMobile } = useCollapsible(defaultExpanded);

  return (
    <div 
      className={cn("collapsible-card", className)}
      style={{
        backgroundColor: '#1e1e1e',
        border: '1px solid #333333',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      <button
        onClick={isMobile ? toggle : undefined}
        className={cn(
          "collapsible-header",
          !isMobile && "cursor-default hover:bg-transparent"
        )}
        disabled={!isMobile}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          width: '100%',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="vm-card-icon"
            style={{ color: '#DCAE1D' }}
          >
            {icon}
          </div>
          <div className="text-left">
            <h3 
              className="font-semibold text-optidata-gray-900"
              style={{ color: '#ffffff', fontSize: '1.125rem', fontWeight: '600' }}
            >
              {title}
            </h3>
            {subtitle && (
              <p 
                className="text-sm text-optidata-gray-500"
                style={{ color: '#9CA3AF', fontSize: '0.875rem', marginTop: '0.25rem' }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div 
          className="flex items-center gap-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {value && (
            <span 
              className="text-lg font-semibold text-optidata-blue"
              style={{ 
                color: '#DCAE1D', 
                fontSize: '1.125rem', 
                fontWeight: '600' 
              }}
            >
              {value}
            </span>
          )}
          {isMobile && (
            <ChevronDown 
              className={cn(
                "w-5 h-5 transition-transform text-optidata-gray-400",
                isExpanded && "rotate-180"
              )}
              style={{ 
                color: '#9CA3AF',
                transition: 'transform 0.2s ease'
              }}
            />
          )}
        </div>
      </button>

      {isExpanded && (
        <div 
          className="collapsible-content animate-slide-down"
          style={{
            backgroundColor: '#1a1a1a',
            padding: '1.5rem',
            borderTop: '1px solid #333333'
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleCard;
