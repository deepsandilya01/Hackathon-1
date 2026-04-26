import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addNewIncident } from '../state/staff.slice';
import { useToast } from '../../../components/ui/Toast';
import { addNotification } from '../../notifications/state/notification.slice';

export function useStaffSocket(userRole) {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (userRole !== 'Staff') return;

    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-staff-room');
    });

    socketRef.current.on('new-incident', (data) => {
      const incident = data.incident;
      dispatch(addNewIncident(incident));
      dispatch(addNotification({
        _id: Math.random().toString(),
        message: `New Incident: ${incident.title}`,
        read: false
      }));
      toast({
        title: 'New Incident Reported',
        description: `Severity: ${incident.severity} | Location: ${incident.location}`,
        variant: incident.severity === 'Critical' ? 'destructive' : 'default',
      });
      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification('New Incident', {
          body: `${incident.title} at ${incident.location}`,
        });
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userRole, dispatch, toast]);

  return socketRef.current;
}
