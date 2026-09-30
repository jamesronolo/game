import React from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className={`rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm border ${color}`}>
    <span className="text-3xl">{icon}</span>
    <div>
      <div className="text-2xl font-extrabold leading-none">{value}</div>
      <div className="text-xs font-semibold text-slate-500 mt-1">{label}</div>
    </div>
  </div>
);

interface GradeStatsCardsProps {
  totalRecords: number;
  studentsCount: number;
  passingRate: number;
  averageNumeric: number;
}

export const GradeStatsCards: React.FC<GradeStatsCardsProps> = ({
  totalRecords,
  studentsCount,
  passingRate,
  averageNumeric,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon="📋"
        label="Total Grade Records"
        value={totalRecords}
        color="bg-indigo-50 border-indigo-200 text-indigo-900"
      />
      <StatCard
        icon="🧑‍🎓"
        label="Students with Grades"
        value={studentsCount}
        color="bg-emerald-50 border-emerald-200 text-emerald-900"
      />
      <StatCard
        icon="🎯"
        label="Passing Rate"
        value={`${passingRate}%`}
        color="bg-amber-50 border-amber-200 text-amber-900"
      />
      <StatCard
        icon="📈"
        label="Class Average (num)"
        value={averageNumeric > 0 ? `${averageNumeric}%` : 'N/A'}
        color="bg-purple-50 border-purple-200 text-purple-900"
      />
    </div>
  );
};
