"use client";

import { Award } from "lucide-react";

interface Badge {
  name: string;
  type: string;
  earnedAt: string;
}

interface BadgesDisplayProps {
  badges: Badge[];
}

const BADGE_TYPE_COLORS: Record<string, string> = {
  REJECTION: "bg-linear-to-br from-purple-500 to-pink-500",
  SHARE: "bg-linear-to-br from-blue-500 to-cyan-500",
  JOB_POST: "bg-linear-to-br from-amber-500 to-orange-500",
};

const BADGE_TYPE_LABELS: Record<string, string> = {
  REJECTION: "Ret Rozeti",
  SHARE: "Paylaşım Rozeti",
  JOB_POST: "İlan Rozeti",
};

export function BadgesDisplay({ badges }: BadgesDisplayProps) {
  if (badges.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-card/30 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-muted" />
          <h3 className="text-sm font-semibold text-foreground">Rozetler</h3>
        </div>
        <p className="text-sm text-muted-light">Henüz rozet kazanılmadı.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 bg-card/30 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-accent" />
        <h3 className="text-sm font-semibold text-foreground">
          Rozetler ({badges.length})
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {badges.map((badge, _index) => (
          <div
            key={`${badge.name}-${badge.earnedAt}`}
            className="group relative overflow-hidden rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-accent/50 hover:shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full ${
                  BADGE_TYPE_COLORS[badge.type] ||
                  "bg-linear-to-br from-gray-500 to-gray-600"
                } flex items-center justify-center shadow-lg`}
              >
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">
                  {badge.name}
                </h4>
                <p className="text-xs text-muted-light mt-0.5">
                  {BADGE_TYPE_LABELS[badge.type] || badge.type}
                </p>
                <p className="text-xs text-muted-light mt-1">
                  {new Date(badge.earnedAt).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
