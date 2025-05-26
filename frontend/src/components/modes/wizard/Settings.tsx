import { Settings as SettingsIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

interface Setting {
  id: string;
  name: string;
  description: string;
  type: 'switch' | 'input' | 'select';
  value: any;
  options?: { label: string; value: string }[];
}

interface SettingsProps {
  title: string;
  description: string;
  settings: Setting[];
  onSave: (settings: Record<string, any>) => void;
  onClose: () => void;
}

/**
 * @test-case
 * - Renders settings form
 * - Handles setting changes
 * - Shows setting descriptions
 * - Updates on save
 */
export function Settings({
  title,
  description,
  settings,
  onSave,
  onClose,
}: SettingsProps) {
  const handleSave = () => {
    const values = settings.reduce(
      (acc, setting) => ({
        ...acc,
        [setting.id]: setting.value,
      }),
      {}
    );
    onSave(values);
  };

  return (
    <div className="flex h-full items-center justify-center p-4">
      <Card className="w-full max-w-2xl space-y-4 p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            ×
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-6">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <Label htmlFor={setting.id}>{setting.name}</Label>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {setting.type === 'switch' && (
                    <Switch
                      id={setting.id}
                      checked={setting.value}
                      onCheckedChange={(checked) => {
                        setting.value = checked;
                      }}
                    />
                  )}

                  {setting.type === 'input' && (
                    <Input
                      id={setting.id}
                      value={setting.value}
                      onChange={(e) => {
                        setting.value = e.target.value;
                      }}
                    />
                  )}

                  {setting.type === 'select' && setting.options && (
                    <Select
                      value={setting.value}
                      onValueChange={(value) => {
                        setting.value = value;
                      }}
                    >
                      {setting.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Anuluj
          </Button>
          <Button onClick={handleSave}>
            Zapisz
          </Button>
        </div>
      </Card>
    </div>
  );
} 