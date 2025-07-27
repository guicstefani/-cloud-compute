
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
    <div className={cn("collapsible-card", className)}>
      <button
        onClick={isMobile ? toggle : undefined}
        className={cn(
          "collapsible-header",
          !isMobile && "cursor-default hover:bg-transparent"
        )}
        disabled={!isMobile}
      >
        <div className="flex items-center gap-3">
          <div className="vm-card-icon">
            {icon}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-optidata-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-optidata-gray-500">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {value && (
            <span className="text-lg font-semibold text-optidata-blue">
              {value}
            </span>
          )}
          {isMobile && (
            <ChevronDown 
              className={cn(
                "w-5 h-5 transition-transform text-optidata-gray-400",
                isExpanded && "rotate-180"
              )} 
            />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="collapsible-content animate-slide-down">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleCard;
