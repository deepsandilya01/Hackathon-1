import React from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export default function IncidentTable({ incidents, onUpdateStatus }) {
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
      case 'High': return 'warning';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="rounded-md border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Reported By</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-slate-500 bg-slate-950">
                  No incidents found.
                </td>
              </tr>
            ) : (
              incidents.map((incident) => (
                <tr key={incident._id} className="bg-slate-950 border-b border-slate-800 hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-100 max-w-[200px] truncate">{incident.title}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="border-slate-700">{incident.type}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getSeverityVariant(incident.severity)}>{incident.severity}</Badge>
                  </td>
                  <td className="px-4 py-3">{incident.location}</td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusVariant(incident.status)}>{incident.status}</Badge>
                  </td>
                  <td className="px-4 py-3">{incident.reportedBy?.fullname || 'Unknown'}</td>
                  <td className="px-4 py-3 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-slate-700 hover:bg-slate-800"
                      onClick={() => onUpdateStatus(incident)}
                    >
                      Update Status
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
