import { useEffect, useRef, useState } from 'react';

import { Socket, SocketArgs } from '~/clients/Socket';

export type SocketConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected';

export const useSocketConnection = (url?: string, args?: SocketArgs) => {
  const [state, setState] = useState<SocketConnectionState>('idle');
  const socketRef = useRef<Socket | null>(null);

  const connect = async () => {
    try {
      const res = await fetch('/auth-token');
      const { token, pageUrl } = await res.json();

      socketRef.current = new Socket(url ?? pageUrl, {
        ...args,
        query: {
          ...args?.query,
          token,
        },
      })
        .onConnect((socket) => {
          setState('connected');
          socket.hello('world');
        })
        .onDisconnect(() => {
          setState('disconnected');
        })
        .onHello((data) => {
          console.log(data);
        });

      socketRef.current?.connect();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return {
    state,
    socket: socketRef.current,
  };
};
