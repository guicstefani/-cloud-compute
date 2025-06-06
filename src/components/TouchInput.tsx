
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
    const newValue = Number(e.target.value);
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2 text-optidata-gray-900">
        {icon}
        {label} {unit && <span className="text-optidata-gray-500">({unit})</span>}
      </Label>

      {/* Slider with larger touch area */}
      <div className="px-2 lg:px-0">
        <Slider
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
          min={min}
          max={max}
          step={step}
          className="slider-optidata"
        />
        <div className="flex justify-between text-xs text-optidata-gray-500 mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>

      {/* Input with increment/decrement buttons */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className="touch-target rounded-lg border-optidata-gray-200 hover:bg-optidata-gray-50"
        >
          <Minus className="w-4 h-4" />
        </Button>

        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="flex-1 text-center text-lg font-semibold input-optidata"
          inputMode="numeric"
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={value >= max}
          className="touch-target rounded-lg border-optidata-gray-200 hover:bg-optidata-gray-50"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Calculation display */}
      {(calculation || calculatedValue) && (
        <div className="text-right text-sm text-optidata-gray-600">
          {calculation && <div className="text-xs">{calculation}</div>}
          {calculatedValue && <div className="font-medium">{calculatedValue}</div>}
        </div>
      )}
    </div>
  );
};

export default TouchInput;
