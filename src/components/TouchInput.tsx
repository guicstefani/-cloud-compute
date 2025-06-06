
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
    const inputValue = e.target.value;
    if (inputValue === '') {
      return; // Allow empty input during typing
    }
    const newValue = parseInt(inputValue) || 0;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      onChange(min); // Set to minimum if empty on blur
      setIsValid(true);
      return;
    }
    const newValue = parseInt(inputValue) || min;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
    setIsValid(true);
  };

  const inputClasses = `
    flex-1 text-center text-lg font-semibold h-12 rounded-lg transition-all duration-300 no-autofill
    ${isValid 
      ? 'border-2 border-gray-300 focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20' 
      : 'border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
    }
    ${value >= min && value <= max ? 'border-green-500 bg-green-50' : ''}
  `;

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2 text-gray-900">
        {icon}
        {label} {unit && <span className="text-gray-500">({unit})</span>}
        {isValid && value >= min && value <= max && (
          <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
        )}
      </Label>

      {/* Mobile Slider - Otimizado */}
      <div className="px-2 lg:px-0">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            onChange(Number(e.target.value));
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

      {/* Enhanced Input with buttons - Mobile otimizado */}
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
          type="number"
          value={value}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          min={min}
          max={max}
          className={inputClasses}
          inputMode="numeric"
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

      {/* Enhanced calculation display */}
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
    </div>
  );
};

export default TouchInput;
