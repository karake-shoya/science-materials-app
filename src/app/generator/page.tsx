import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { GeneratorClient } from "@/components/generator/GeneratorClient"

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <GeneratorClient />
    </div>
  );
}
