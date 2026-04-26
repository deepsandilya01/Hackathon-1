import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { updateIncident } from '../state/incident.slice';
import { useToast } from '../../../components/ui/Toast';
import { SOCKET_URL } from '../../../lib/axios';

export function useSocket(userId) {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(SOCKET_URL, { withCredentials: true });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-room', userId);
    });

    socketRef.current.on('incident-updated', (data) => {
      dispatch(updateIncident({ _id: data.incidentId, status: data.status }));
      toast({
        title: 'Incident Updated',
        description: data.message || `Your incident status changed to ${data.status}`,
        variant: 'default',
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId, dispatch, toast]);

  return socketRef.current;
}
