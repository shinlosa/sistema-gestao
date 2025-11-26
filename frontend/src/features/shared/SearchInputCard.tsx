import type { ChangeEvent } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface SearchInputCardProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
}

export function SearchInputCard({
  id,
  label,
  placeholder,
  value,
  onValueChange,
}: SearchInputCardProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value);
  };

  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <Label htmlFor={id} className="font-semibold whitespace-nowrap">
          {label}
        </Label>
        <Input id={id} placeholder={placeholder} value={value} onChange={handleChange} />
      </CardContent>
    </Card>
  );
}
