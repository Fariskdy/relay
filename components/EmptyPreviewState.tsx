import { FileText } from "lucide-react";

export default function EmptyPreviewState() {
  return (
    <div className="grid h-full place-items-center px-8 text-center">
      <div>
        <FileText size={64} strokeWidth={1.5} className="mx-auto mb-4 text-text-tertiary" />
        <p className="text-sm text-text-secondary">Select a transfer to preview</p>
      </div>
    </div>
  );
}
