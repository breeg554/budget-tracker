import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QueueNames } from '../enums/queue-names.enum';
import { ReceiptProcessEvent } from '~/modules/organization/receipt/events/receipt-process.event';

@Injectable()
export class ReceiptProducer {
  constructor(@InjectQueue(QueueNames.RECEIPT) private queue: Queue) {}

  async addReceiptProcessJob(event: ReceiptProcessEvent) {
    await this.queue.add(ReceiptProcessEvent.EVENT_NAME, event.payload);
  }
}
