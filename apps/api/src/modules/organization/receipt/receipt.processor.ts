import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { ReceiptService } from '~/modules/organization/receipt/receipt.service';
import { OrganizationService } from '~/modules/organization/organization.service';
import { ReceiptGateway } from '~/modules/organization/receipt/receipt.gateway';
import { QueueNames } from '~/modules/queue/enums/queue-names.enum';
import { OpenAIModel } from '~/modules/ai/openai.model';

import {
  ReceiptProcessEvent,
  ReceiptProcessEventPayload,
} from './events/receipt-process.event';

@Processor(QueueNames.RECEIPT)
export class ReceiptProcessor extends WorkerHost {
  private readonly logger = new Logger(ReceiptProcessor.name);

  constructor(
    private receiptService: ReceiptService,
    private organizationService: OrganizationService,
    private receiptGateway: ReceiptGateway,
  ) {
    super();
  }

  async process(job: Job<ReceiptProcessEventPayload>) {
    switch (job.name) {
      case ReceiptProcessEvent.EVENT_NAME:
        const secret = await this.organizationService.findOrganizationSecret(
          job.data.secretName,
          job.data.organizationName,
        );

        this.receiptGateway.processImage(job.data.roomId);

        const { content } = await this.receiptService.processReceiptImage(
          job.data.fileUrl,
          new OpenAIModel({ apiKey: secret.value }),
        );

        this.receiptGateway.processContent(job.data.roomId);

        const result = await this.receiptService.processReceiptContent(
          content,
          new OpenAIModel({ apiKey: secret.value }),
        );

        this.receiptGateway.finishProcessing(job.data.roomId, result);
        break;
      default:
        this.logger.error(`Unknown job type ${job.name}`);
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnWorkerEvent('error')
  onError(job: Job, error: Error) {
    this.receiptGateway.errorProcessing(job.data.roomId, error);

    this.logger.error(
      `Job ${job.id} failed with error ${error.name}: ${error.message} at ${error.stack}`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.receiptGateway.errorProcessing(job.data.roomId, error);

    this.logger.error(
      `Job ${job.id} failed with error ${error.name}: ${error.message} at ${error.stack}`,
    );
  }
}
