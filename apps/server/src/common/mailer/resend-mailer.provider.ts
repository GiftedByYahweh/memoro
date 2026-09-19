import { Resend, type CreateEmailOptions } from 'resend';
import type { Logger } from '@/logger';
import type { Mailer, SendMailParams } from './mailer';

export interface ResendMailerConfig {
  apiKey: string;
  from: string;
}

export class ResendMailerProvider implements Mailer {
  private resend: Resend;
  private from: string;

  constructor(
    config: ResendMailerConfig,
    private logger: Logger,
  ) {
    this.resend = new Resend(config.apiKey);
    this.from = config.from;
  }

  async sendMail(params: SendMailParams): Promise<void> {
    const payload = {
      from: this.from,
      to: params.to,
      subject: params.subject,
      html: params.html ?? undefined,
      text: params.text ?? undefined,
    } as CreateEmailOptions;

    const { error } = await this.resend.emails.send(payload);

    if (error) {
      this.logger.error('ResendMailer', JSON.stringify(error));
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
