import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../auth/hook/useAuth';
import { useStaffSocket } from '../hook/useStaffSocket';
import { getDashboardStats, updateIncidentStatus } from '../service/staff.api';
import { setDashboardStats, updateIncidentStatus as updateIncidentStatusAction } from '../state/staff.slice';
import StatsCard from '../components/StatsCard';
import IncidentTable from '../components/IncidentTable';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { useToast } from '../../../components/ui/Toast';

export default function StaffDashboard() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { dashboardStats } = useSelector((state) => state.staff);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const { toast } = useToast();
  
  useStaffSocket(user?.role);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      dispatch(setDashboardStats(res.data.data || res.data));
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
      fetchStats(); // Refresh stats after update
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Staff Dashboard</h1>
        <p className="text-slate-400 mt-1">Real-time overview of all reported incidents.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <StatsCard title="Total" value={dashboardStats.total} colorClass="text-blue-500" />
        <StatsCard title="Pending" value={dashboardStats.pending} colorClass="text-yellow-500" />
        <StatsCard title="Active" value={dashboardStats.active} colorClass="text-orange-500" />
        <StatsCard title="Resolved" value={dashboardStats.resolved} colorClass="text-green-500" />
        <StatsCard title="Critical" value={dashboardStats.critical} colorClass="text-red-500 animate-pulse" />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-100">Recent Incidents</h2>
        </div>
        <IncidentTable 
          incidents={dashboardStats.recentIncidents} 
          onUpdateStatus={handleUpdateStatusClick} 
        />
      </div>

      <UpdateStatusModal 
        isOpen={modalOpen} 
        incident={selectedIncident} 
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
