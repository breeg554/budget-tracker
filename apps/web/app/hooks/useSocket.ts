import { useEffect, useRef, useState } from 'react';

import {
  OnConnectCb,
  OnConnectErrorCb,
  OnDisconnectCb,
  Socket,
} from '~/clients/Socket';

export type SocketConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'errored';

export type UseSocketCallbacks = {
  onConnect: OnConnectCb;
  onDisconnect: OnDisconnectCb;
  onConnectError: OnConnectErrorCb;
};

export const useSocket = <S extends Socket>(
  socket: S,
  callbacks?: Partial<UseSocketCallbacks>,
) => {
  const [status, setStatus] = useState<SocketConnectionState>('idle');
  const socketRef = useRef<S>(socket);

  const reconnect = () => {
    if (socket.connected) {
      socketRef.current.disconnect().then(() => socketRef.current.connect());
    } else {
      socketRef.current.connect();
    }
  };

  useEffect(() => {
    if (socket.connected) return;

    socketRef.current.connect().then((socket) => {
      socket
        .onConnect(() => {
          setStatus('connected');
          callbacks?.onConnect?.(socket);
        })
        .onDisconnect((reason, description) => {
          setStatus('disconnected');
          callbacks?.onDisconnect?.(reason, description);
        })
        .onConnectError((error) => {
          setStatus('errored');
          callbacks?.onConnectError?.(error);
          console.error('Socket connection error:', error);
        });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return {
    status,
    reconnect,
    socket: socketRef.current,
  };
};
