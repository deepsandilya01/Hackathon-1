import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { MapPin, Clock } from 'lucide-react';

export default function IncidentCard({ incident }) {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Resolved': return 'success';
      case 'Active': return 'active';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case 'Critical': return 'critical';
      case 'High': return 'warning'; // Using warning color (orange)
      case 'Medium': return 'warning'; // Should be yellow conceptually, using warning for now
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card className="hover:border-outline-variant/40 transition-all relative overflow-hidden group hover:shadow-[0_24px_48px_rgba(23,28,31,0.08)] bg-surface-container-lowest border-outline-variant/10">
      {/* Power Bar for Severity */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        incident.severity === 'Critical' ? 'bg-error' :
        incident.severity === 'High' ? 'bg-orange-500' :
        incident.severity === 'Medium' ? 'bg-yellow-500' : 'bg-primary'
      }`} />
      
      <CardHeader className="pb-3 pl-7">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg line-clamp-1 font-display font-semibold text-primary">{incident.title}</CardTitle>
          <Badge variant={getStatusVariant(incident.status)} className="rounded-[4px] px-2">{incident.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pl-7">
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="border-outline-variant/30 text-on-surface-variant bg-surface-container-low rounded-[4px] px-2">
              {incident.type}
            </Badge>
            <Badge variant={getSeverityVariant(incident.severity)} className="rounded-[4px] px-2">
              {incident.severity}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-outline gap-5 font-sans mt-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span className="truncate max-w-[120px]">{incident.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{new Date(incident.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
