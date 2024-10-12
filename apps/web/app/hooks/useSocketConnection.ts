import { useEffect, useRef, useState } from 'react';

import { SocketArgs } from '~/clients/Socket';
import { testSocket, TestSocket } from '~/clients/TestSocket';

export type SocketConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'errored';

export const useSocketConnection = (url: string, args?: SocketArgs) => {
  const [state, setState] = useState<SocketConnectionState>('idle');
  const socketRef = useRef<TestSocket | null>(null);

  useEffect(() => {
    if (socketRef.current) return;

    socketRef.current = testSocket(url, args);

    socketRef.current.connect().then((socket) => {
      socket
        .onConnect(() => {
          setState('connected');
          socket.hello('world');
        })
        .onDisconnect(() => {
          setState('disconnected');
        })
        .onConnectError((error) => {
          setState('errored');
        })
        .onHello((data) => {
          console.log(data);
        });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return {
    state,
    socket: socketRef.current,
  };
};
