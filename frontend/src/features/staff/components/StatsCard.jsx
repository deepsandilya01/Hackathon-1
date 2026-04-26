import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';

export default function StatsCard({ title, value, colorClass }) {
  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className={`text-3xl font-bold mt-2 ${colorClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
