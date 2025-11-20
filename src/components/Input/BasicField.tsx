import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BasicFieldProps } from "./BasicField.types";

const BasicField = ({
  title,
  description,
  fields,
  children,
  ...props
}: BasicFieldProps) => {
  return (
    <div {...props}>
      <h2 className="text-lg font-bold">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <FieldGroup>
        {fields.map((f) => (
          <Field key={f.id}>
            <FieldLabel>{f.label}</FieldLabel>

            {f.type === "text" && (
              <Input value={f.value} onChange={f.onChange} />
            )}

            {f.type === "number" && (
              <Input type="number" value={f.value} onChange={f.onChange} />
            )}

            {f.type === "textarea" && (
              <Textarea value={f.value as string} onChange={f.onChange} />
            )}

            {f.type === "select" && (
              <Select
                onValueChange={(v) =>
                  f.onChange?.({ target: { value: v } } as any)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {f.options?.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>
        ))}
      </FieldGroup>

      {children}
    </div>
  );
};

export default BasicField;
