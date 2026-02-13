import { XCircle, TrendingDown, Clock } from "lucide-react";
import type { useStats } from "@/hooks/use-stats";

interface StatsSectionProps {
  stats: ReturnType<typeof useStats>["stats"];
  loading: boolean;
}

export function StatsSection({ stats, loading }: StatsSectionProps) {
  // Format rejected count (e.g. 1.2M+)
  const formattedRejectedCount = stats
    ? `${new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(stats.rejectedCount)}`
    : "...";

  return (
    <section className="relative py-12 border-y border-border/50 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Rejected Count */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/50 mb-2">
              <XCircle className="text-red-500" size={24} />
            </div>
            <h3 className="text-3xl font-bold text-foreground">
              {loading ? "..." : formattedRejectedCount}
            </h3>
            <p className="text-sm font-medium text-muted">Reddedilen Başvuru</p>
          </div>

          {/* Rejection Rate */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/50 mb-2">
              <TrendingDown className="text-blue-500" size={24} />
            </div>
            <h3 className="text-3xl font-bold text-foreground">
              {loading ? "..." : `%${stats?.rejectionRate}`}
            </h3>
            <p className="text-sm font-medium text-muted">Ret Oranı</p>
          </div>

          {/* Turnaround Time */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/50 mb-2">
              <Clock className="text-orange-500" size={24} />
            </div>
            <h3 className="text-3xl font-bold text-foreground">
              {loading ? "..." : stats?.averageTurnaroundTime}
            </h3>
            <p className="text-sm font-medium text-muted">
              Ortalama Dönüş Süresi
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
