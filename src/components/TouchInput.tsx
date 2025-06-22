
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Minus, Plus, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface TouchInputProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  calculation?: string;
  calculatedValue?: string;
}

const TouchInput = ({
  label,
  icon,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  calculation,
  calculatedValue
}: TouchInputProps) => {
  const [isValid, setIsValid] = React.useState(true);
  const [inputValue, setInputValue] = React.useState(value.toString());

  // Sincronizar inputValue quando value muda externamente
  React.useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
    setIsValid(true);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
    setIsValid(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);

    // Permitir campo vazio durante digitação
    if (rawValue === '') {
      setIsValid(true);
      return;
    }

    // Remover zeros à esquerda e caracteres não numéricos
    const cleanValue = rawValue.replace(/^0+/, '').replace(/[^0-9]/g, '');
    const numericValue = cleanValue === '' ? 0 : parseInt(cleanValue, 10);

    // Validar limites
    if (numericValue >= min && numericValue <= max) {
      onChange(numericValue);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handleInputBlur = () => {
    // Ao perder foco, garantir que o valor está nos limites
    if (inputValue === '' || isNaN(Number(inputValue))) {
      const safeValue = Math.max(min, Math.min(max, min));
      onChange(safeValue);
      setInputValue(safeValue.toString());
      setIsValid(true);
      return;
    }

    const numericValue = parseInt(inputValue.replace(/^0+/, '') || '0', 10);
    const clampedValue = Math.max(min, Math.min(max, numericValue));
    
    onChange(clampedValue);
    setInputValue(clampedValue.toString());
    setIsValid(true);
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Selecionar todo o texto ao focar
    e.target.select();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Atalhos de teclado
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift+Enter: adiciona 10
        const newValue = Math.min(max, value + (step * 10));
        onChange(newValue);
      } else {
        // Enter: adiciona 1
        handleIncrement();
      }
    }
  };

  // Determinar cores baseadas no valor e limites
  const getStatusColor = () => {
    if (!isValid) return 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
    if (value >= max * 0.9) return 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20';
    if (value >= max * 0.7) return 'border-yellow-400 bg-yellow-50 focus:border-yellow-500 focus:ring-yellow-500/20';
    if (value >= min && value <= max) return 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500/20';
    return 'border-gray-300 focus:border-[#0066CC] focus:ring-[#0066CC]/20';
  };

  const inputClasses = `
    flex-1 text-center text-lg font-semibold h-12 rounded-lg transition-all duration-300 no-autofill
    ${getStatusColor()}
  `;

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2 text-gray-900">
        {icon}
        {label} {unit && <span className="text-gray-500">({unit})</span>}
        {isValid && value >= min && value <= max && (
          <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
        )}
        {value >= max * 0.9 && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full ml-auto">
            Próximo ao limite
          </span>
        )}
      </Label>

      {/* Slider otimizado para mobile */}
      <div className="px-2 lg:px-0">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            onChange(newValue);
            setIsValid(true);
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mobile-slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{min}</span>
          <span className="font-medium text-[#0066CC]">{value}</span>
          <span>{max}</span>
        </div>
      </div>

      {/* Input com controles melhorados */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-12 w-12 rounded-lg border-2 border-gray-300 hover:border-[#0066CC] hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 touch-target active:scale-95"
        >
          <Minus className="w-5 h-5" />
        </Button>

        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className={inputClasses}
          inputMode="numeric"
          placeholder={`Ex: ${Math.floor((min + max) / 2)}`}
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-12 w-12 rounded-lg border-2 border-gray-300 hover:border-[#0066CC] hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 touch-target active:scale-95"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Feedback e informações */}
      {!isValid && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200 animate-fade-in">
          Valor deve estar entre {min} e {max}
        </div>
      )}

      {/* Display de cálculo melhorado */}
      {(calculation || calculatedValue) && (
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          {calculation && (
            <div className="text-xs text-gray-600 mb-2">{calculation}</div>
          )}
          {calculatedValue && (
            <div className="font-semibold text-gray-900 flex items-center gap-2 text-center justify-center">
              {calculatedValue}
              {isValid && value >= min && value <= max && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
          )}
        </div>
      )}

      {/* Dicas de atalhos */}
      <div className="text-xs text-gray-500 text-center">
        💡 Enter: +{step} | Shift+Enter: +{step * 10} | Clique no valor para editar
      </div>
    </div>
  );
};

export default TouchInput;
