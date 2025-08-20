import { UseFormReturn } from "react-hook-form";

export default function setFormError(error: Record<string, string>, form: UseFormReturn<any>) {
  for (const [key, value] of Object.entries(error)) {
    form.setError(key, { type: "manual", message: value });
  }
}
