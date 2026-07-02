import DashboardClient from "@/components/DashboardClient";
import { parseCurrentView } from "@/lib/view";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};

  return <DashboardClient initialView={parseCurrentView(firstParam(params.view))} initialSelectedId={firstParam(params.transfer) ?? null} />;
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
