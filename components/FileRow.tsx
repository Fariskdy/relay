import { Archive, File, FileText, Film, Image, Music, Table } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatFileSize, getFileExtension } from "@/lib/format";
import type { TransferFile } from "@/lib/types";

const iconByExtension: Record<string, LucideIcon> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  zip: Archive,
  mp4: Film,
  wav: Music,
  mp3: Music,
  jpg: Image,
  jpeg: Image,
  png: Image,
  fig: Image,
  xlsx: Table,
  csv: Table,
};

type FileRowProps = {
  file: TransferFile;
};

export default function FileRow({ file }: FileRowProps) {
  const Icon = iconByExtension[getFileExtension(file.name)] ?? File;

  return (
    <div className="flex min-w-0 items-center gap-3 border-t border-border-hairline py-2.5 first:border-t-0">
      <Icon size={18} strokeWidth={1.5} className="shrink-0 text-text-tertiary" />
      <div className="min-w-0 flex-1 truncate text-[13px] text-text-secondary">{file.name}</div>
      <div className="shrink-0 pl-2 text-right text-xs text-text-secondary">{formatFileSize(file.size_mb)}</div>
    </div>
  );
}
