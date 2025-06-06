
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
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
  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      return; // Allow empty input during typing
    }
    const newValue = parseInt(inputValue) || 0;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      onChange(min); // Set to minimum if empty on blur
      return;
    }
    const newValue = parseInt(inputValue) || min;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2 text-[#1F2937]">
        {icon}
        {label} {unit && <span className="text-[#6B7280]">({unit})</span>}
      </Label>

      {/* Enhanced Slider */}
      <div className="px-2 lg:px-0">
        <Slider
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
          min={min}
          max={max}
          step={step}
          className="premium-slider"
        />
        <div className="flex justify-between text-xs text-[#6B7280] mt-2">
          <span>{min}</span>
          <span className="font-medium text-[#2563EB]">{value}</span>
          <span>{max}</span>
        </div>
      </div>

      {/* Enhanced Input with buttons */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-11 w-11 rounded-lg border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all duration-200 disabled:opacity-50"
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
          className="flex-1 text-center text-lg font-semibold h-11 border-[#E5E7EB] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200"
          inputMode="numeric"
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-11 w-11 rounded-lg border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all duration-200 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Enhanced calculation display */}
      {(calculation || calculatedValue) && (
        <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E5E7EB]">
          {calculation && (
            <div className="text-xs text-[#6B7280] mb-1">{calculation}</div>
          )}
          {calculatedValue && (
            <div className="font-semibold text-[#1F2937]">{calculatedValue}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TouchInput;
