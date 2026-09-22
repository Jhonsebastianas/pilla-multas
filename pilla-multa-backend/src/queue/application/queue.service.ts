import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { JobOptions } from 'bull';
import type { Queue } from 'bull';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  private queues: Map<string, Queue> = new Map();

  constructor(
    @InjectQueue('notification') private readonly notificationQueue: Queue,
    @InjectQueue('excel-validation')
    private readonly excelValidationQueue: Queue,
    @InjectQueue('product-enrichment')
    private readonly productEnrichmentQueue: Queue,
  ) {
    this.queues.set('notification', this.notificationQueue);
    this.queues.set('excel-validation', this.excelValidationQueue);
    this.queues.set('product-enrichment', this.productEnrichmentQueue);
  }

  /**
   * Adds a job to a specific queue.
   * @param queueName Name of the queue (e.g., 'notification').
   * @param jobName Name of the job/process (e.g., 'send-email').
   * @param data Payload to process.
   * @param options Bull job options (delay, attempts, etc.).
   */
  async addJob(
    queueName: string,
    jobName: string,
    data: any,
    options?: JobOptions,
  ) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      this.logger.error(`Queue '${queueName}' not registered.`);
      throw new Error(`Queue '${queueName}' not found.`);
    }

    this.logger.debug(
      `Adding job '${jobName}' to queue '${queueName}' with data: ${JSON.stringify(data)}`,
    );

    return await queue.add(
      jobName,
      data,
      options || {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: 1000,
        removeOnFail: 5000,
      },
    );
  }
}
