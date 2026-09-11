import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, CheckCircle2, XCircle } from 'lucide-react';

interface DashboardStats {
  totalVerifications: number;
  successfulVerifications: number;
  failedVerifications: number;
  recentVerifications?: any[];
}

interface DashboardStatsGridProps {
  stats: DashboardStats | null;
  isLoading?: boolean;
}

export function DashboardStatsGrid({ stats, isLoading }: DashboardStatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-card border-border shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Verifications */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Verifications</p>
            <h3 className="font-display text-2xl font-bold mt-1 text-foreground">{stats?.totalVerifications ?? 0}</h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <Search className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Successful */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Successful</p>
            <h3 className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats?.successfulVerifications ?? 0}</h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Failed / No Match */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Failed / No Match</p>
            <h3 className="font-display text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{stats?.failedVerifications ?? 0}</h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
            <XCircle className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


