export type ReceiptProcessEventPayload = {
  fileUrl: string;
  model: string;
  organizationName: string;
  roomId: string;
};

export class ReceiptProcessEvent {
  public static EVENT_NAME = 'RECEIPT_PROCESS_EVENT';

  constructor(private readonly data: ReceiptProcessEventPayload) {}

  get payload() {
    return this.data;
  }
}
