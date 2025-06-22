
import React from 'react';
import { Check } from 'lucide-react';

interface RadioSelectionCardProps {
  id: string;
  name: string;
  selected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
  price?: string | number;
  description?: string;
  disabled?: boolean;
}

export const RadioSelectionCard: React.FC<RadioSelectionCardProps> = ({
  id,
  name,
  selected,
  onSelect,
  icon,
  price,
  description,
  disabled = false
}) => {
  return (
    <div
      onClick={disabled ? undefined : onSelect}
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${selected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' 
          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {/* Radio Button Indicator */}
      <div className="absolute top-3 right-3">
        <div className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${selected 
            ? 'border-blue-500 bg-blue-500' 
            : 'border-gray-300 dark:border-gray-600'
          }
        `}>
          {selected && (
            <div className="w-2 h-2 rounded-full bg-white"></div>
          )}
        </div>
      </div>

      <div className="pr-8">
        <div className="flex items-center gap-3 mb-2">
          {icon && <div className="text-lg">{icon}</div>}
          <h4 className={`font-medium ${selected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`}>
            {name}
          </h4>
        </div>
        
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {description}
          </p>
        )}
        
        {price && (
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {typeof price === 'string' ? price : `R$ ${price.toFixed(2)}/mês`}
          </div>
        )}
      </div>
    </div>
  );
};
