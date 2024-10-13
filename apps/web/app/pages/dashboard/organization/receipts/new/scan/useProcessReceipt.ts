import { useState } from 'react';

import { ReceiptProcessDto } from '~/api/Receipt/receiptApi.types';
import {
  OnErrorCb,
  OnFinishedProcessingCb,
  OnStatusChangeCb,
  ReceiptProcessRunCallbacks,
  receiptProcessSocket,
  ReceiptProcessStatus,
} from '~/clients/ReceiptProcessSocket';
import { SocketArgs } from '~/clients/Socket';
import { useOrganizationName } from '~/hooks/useOrganizationName';
import { useSocket } from '~/hooks/useSocket';

interface UseProcessReceiptArgs extends SocketArgs {
  callbacks?: Partial<ReceiptProcessRunCallbacks>;
}

export const useProcessReceipt = (
  url: string,
  args: UseProcessReceiptArgs = {
    callbacks: {},
  },
) => {
  const { callbacks, ...rest } = args;
  const organizationName = useOrganizationName();

  const { socket } = useSocket(receiptProcessSocket(url, rest));
  const [status, setStatus] = useState<ReceiptProcessStatus>('idle');
  const [data, setData] = useState<ReceiptProcessDto | null>(null);

  const onStatusChange: OnStatusChangeCb = (status) => {
    setStatus(status);
    callbacks?.onStatusChange?.(status);
  };

  const onFinishedProcessing: OnFinishedProcessingCb = (data) => {
    setData(data);
    callbacks?.onFinishedProcessing?.(data);
  };

  const onError: OnErrorCb = (error) => {
    setStatus('error');
    console.error(error);
  };

  const processReceipt = (fileUrl: string) => {
    setStatus('image-processing');
    socket.run(
      {
        organizationName,
        fileUrl,
      },
      { onStatusChange, onFinishedProcessing, onError },
    );
  };

  return {
    processReceipt,
    status,
    data,
  };
};
