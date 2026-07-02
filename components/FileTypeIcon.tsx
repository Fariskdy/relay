import {
  Archive,
  File,
  FileImage,
  FileText,
  FileVideo,
  Figma,
  Music,
  Presentation,
  Sheet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { classNames, getFileExtension } from "@/lib/format";

const iconByExtension: Record<string, LucideIcon> = {
  zip: Archive,
  pdf: FileText,
  fig: Figma,
  pptx: Presentation,
  jpg: FileImage,
  jpeg: FileImage,
  png: FileImage,
  mp4: FileVideo,
  wav: Music,
  srt: FileText,
  xlsx: Sheet,
};

type FileTypeIconProps = {
  fileName?: string;
  size?: number;
  className?: string;
};

export default function FileTypeIcon({ fileName, size = 20, className }: FileTypeIconProps) {
  const extension = fileName ? getFileExtension(fileName) : "";
  const Icon = iconByExtension[extension] ?? File;

  return <Icon size={size} strokeWidth={1.5} className={classNames("shrink-0 text-text-tertiary", className)} />;
}
