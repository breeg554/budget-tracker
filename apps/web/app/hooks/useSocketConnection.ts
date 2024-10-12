import { useEffect, useRef, useState } from 'react';

import {
  receiptAnalysisSocket,
  ReceiptAnalysisSocket,
} from '~/clients/ReceiptAnalysisSocket';
import { SocketArgs } from '~/clients/Socket';
import { assert } from '~/utils/assert';

export type SocketConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'errored';

export const useSocketConnection = (url: string, args?: SocketArgs) => {
  const [state, setState] = useState<SocketConnectionState>('idle');
  const socketRef = useRef<ReceiptAnalysisSocket | null>(null);

  const run = (id: string) => {
    assert(socketRef.current, 'Socket is not connected');

    socketRef.current.run(id);
  };

  const push = (data: string) => {
    assert(socketRef.current, 'Socket is not connected');

    socketRef.current.push(data);
  };

  useEffect(() => {
    if (socketRef.current) return;

    socketRef.current = new ReceiptAnalysisSocket(url, args);

    socketRef.current.connect().then((socket) => {
      socket
        .onConnect(() => {
          setState('connected');
        })
        .onDisconnect(() => {
          setState('disconnected');
        })
        .onConnectError((error) => {
          setState('errored');
          console.error('Socket connection error:', error);
        });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return {
    state,
    run,
    push,
    room: socketRef.current?.roomId,
  };
};
