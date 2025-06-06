
import React from 'react';
import { Slider } from '@/components/ui/slider';
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
    flex-1 text-center text-lg font-semibold h-11 rounded-md transition-all duration-300
    ${isValid 
      ? 'border-[#E0E0E0] focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20' 
      : 'border-[#E74C3C] focus:border-[#E74C3C] focus:ring-2 focus:ring-[#E74C3C]/20'
    }
    ${value >= min && value <= max ? 'success-feedback' : ''}
  `;

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2 text-[#2C3E50]">
        {icon}
        {label} {unit && <span className="text-[#7F8C8D]">({unit})</span>}
        {isValid && value >= min && value <= max && (
          <CheckCircle className="w-4 h-4 text-[#00A651] ml-auto" />
        )}
      </Label>

      {/* Enhanced Slider - Optidata Style */}
      <div className="px-2 lg:px-0">
        <Slider
          value={[value]}
          onValueChange={([newValue]) => {
            onChange(newValue);
            setIsValid(true);
          }}
          min={min}
          max={max}
          step={step}
          className="premium-slider"
        />
        <div className="flex justify-between text-xs text-[#7F8C8D] mt-2">
          <span>{min}</span>
          <span className="font-medium text-[#0066CC]">{value}</span>
          <span>{max}</span>
        </div>
      </div>

      {/* Enhanced Input with buttons - Optidata Style */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-11 w-11 rounded-md border-[#E0E0E0] hover:border-[#0066CC] hover:bg-[#F8FBFF] transition-all duration-300 disabled:opacity-50"
        >
          <Minus className="w-4 h-4" />
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
          className="h-11 w-11 rounded-md border-[#E0E0E0] hover:border-[#0066CC] hover:bg-[#F8FBFF] transition-all duration-300 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Enhanced calculation display - Optidata Style */}
      {(calculation || calculatedValue) && (
        <div className="bg-[#F8FBFF] rounded-lg p-3 border border-[#E0E0E0]">
          {calculation && (
            <div className="text-xs text-[#7F8C8D] mb-1">{calculation}</div>
          )}
          {calculatedValue && (
            <div className="font-semibold text-[#2C3E50] flex items-center gap-2">
              {calculatedValue}
              {isValid && value >= min && value <= max && (
                <CheckCircle className="w-4 h-4 text-[#00A651]" />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TouchInput;
