export interface SendMailParams {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface Mailer {
  sendMail(params: SendMailParams): Promise<void>;
}
