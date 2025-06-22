
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
        backgroundColor: '#1e1e1e !important',
        background: '#1e1e1e !important',
        border: '1px solid #333333 !important',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: 'none !important'
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
          backgroundColor: 'transparent !important',
          background: 'transparent !important',
          border: 'none !important',
          width: '100%',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'none !important'
        }}
      >
        <div 
          className="flex items-center gap-3"
          style={{
            backgroundColor: 'transparent !important',
            background: 'transparent !important'
          }}
        >
          <div 
            className="vm-card-icon"
            style={{ 
              color: '#DCAE1D !important',
              backgroundColor: 'transparent !important',
              background: 'transparent !important'
            }}
          >
            {icon}
          </div>
          <div 
            className="text-left"
            style={{
              backgroundColor: 'transparent !important',
              background: 'transparent !important'
            }}
          >
            <h3 
              className="font-semibold text-optidata-gray-900"
              style={{ 
                color: '#ffffff !important', 
                fontSize: '1.125rem', 
                fontWeight: '600',
                backgroundColor: 'transparent !important',
                background: 'transparent !important'
              }}
            >
              {title}
            </h3>
            {subtitle && (
              <p 
                className="text-sm text-optidata-gray-500"
                style={{ 
                  color: '#9CA3AF !important', 
                  fontSize: '0.875rem', 
                  marginTop: '0.25rem',
                  backgroundColor: 'transparent !important',
                  background: 'transparent !important'
                }}
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
            gap: '0.5rem',
            backgroundColor: 'transparent !important',
            background: 'transparent !important'
          }}
        >
          {value && (
            <span 
              className="text-lg font-semibold text-optidata-blue"
              style={{ 
                color: '#DCAE1D !important', 
                fontSize: '1.125rem', 
                fontWeight: '600',
                backgroundColor: 'transparent !important',
                background: 'transparent !important'
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
                color: '#9CA3AF !important',
                transition: 'transform 0.2s ease',
                backgroundColor: 'transparent !important',
                background: 'transparent !important'
              }}
            />
          )}
        </div>
      </button>

      {isExpanded && (
        <div 
          className="collapsible-content animate-slide-down"
          style={{
            backgroundColor: '#1a1a1a !important',
            background: '#1a1a1a !important',
            padding: '1.5rem',
            borderTop: '1px solid #333333',
            boxShadow: 'none !important'
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleCard;
