import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllIncidents, updateIncidentStatus } from '../service/staff.api';
import { setAllIncidents, updateIncidentStatus as updateIncidentStatusAction } from '../state/staff.slice';
import IncidentTable from '../components/IncidentTable';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { Select } from '../../../components/ui/Select';
import { useToast } from '../../../components/ui/Toast';

export default function AllIncidents() {
  const dispatch = useDispatch();
  const { allIncidents } = useSelector((state) => state.staff);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const { toast } = useToast();
  const [filters, setFilters] = useState({ status: '', severity: '', type: '' });

  useEffect(() => {
    fetchIncidents();
  }, [filters]);

  const fetchIncidents = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.severity) params.severity = filters.severity;
      if (filters.type) params.type = filters.type;
      
      const res = await getAllIncidents(params);
      dispatch(setAllIncidents(res.data.data || res.data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatusClick = (incident) => {
    setSelectedIncident(incident);
    setModalOpen(true);
  };

  const handleModalSubmit = async (id, data) => {
    try {
      const res = await updateIncidentStatus(id, data);
      dispatch(updateIncidentStatusAction(res.data));
      setModalOpen(false);
      toast({
        title: 'Status Updated',
        description: `Incident marked as ${data.status}`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">All Incidents</h1>
          <p className="text-slate-400 mt-1">Manage and track all reported incidents across the venue.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="w-full md:w-48">
          <Select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="bg-slate-950 border-slate-800 text-slate-300"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Resolved">Resolved</option>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select 
            value={filters.severity} 
            onChange={(e) => setFilters({...filters, severity: e.target.value})}
            className="bg-slate-950 border-slate-800 text-slate-300"
          >
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </div>
      </div>

      <IncidentTable 
        incidents={allIncidents} 
        onUpdateStatus={handleUpdateStatusClick} 
      />

      <UpdateStatusModal 
        isOpen={modalOpen} 
        incident={selectedIncident} 
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
