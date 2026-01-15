import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface WeekProgress {
  week: number;
  completed: number;
  total: number;
  percentage: number;
}

interface StudentProgressPieChartProps {
  weekProgress: WeekProgress[];
  size?: 'sm' | 'md';
}

const WEEK_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function StudentProgressPieChart({ weekProgress, size = 'sm' }: StudentProgressPieChartProps) {
  const data = useMemo(() => {
    return weekProgress.map((wp, idx) => ({
      name: `Week ${wp.week}`,
      value: wp.completed,
      total: wp.total,
      percentage: wp.percentage,
      fill: WEEK_COLORS[idx % WEEK_COLORS.length],
    }));
  }, [weekProgress]);

  const totalCompleted = weekProgress.reduce((sum, wp) => sum + wp.completed, 0);
  const totalTasks = weekProgress.reduce((sum, wp) => sum + wp.total, 0);
  const overallPercentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const dimensions = size === 'sm' ? { width: 60, height: 60 } : { width: 100, height: 100 };
  const innerRadius = size === 'sm' ? 15 : 25;
  const outerRadius = size === 'sm' ? 28 : 45;

  if (totalTasks === 0) {
    return (
      <div 
        className="flex items-center justify-center text-xs text-muted-foreground"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        No data
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: dimensions.width, height: dimensions.height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-popover border rounded-md shadow-md px-2 py-1 text-xs">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">
                      {item.value}/{item.total} ({Math.round(item.percentage)}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xs font-bold">{overallPercentage}%</span>
      </div>
    </div>
  );
}
