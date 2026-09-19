import {
  AUTH_CONSTRAINTS,
  VerificationCodeType,
  type VerificationCodeType as VerificationCodeTypeValue,
} from '@memoro/shared';

const EMAIL_SUBJECTS = {
  [VerificationCodeType.REGISTRATION]: 'Your Memoro verification code',
  [VerificationCodeType.PASSWORD_RESET]: 'Your Memoro password reset code',
} as const;

const EMAIL_TITLES = {
  [VerificationCodeType.REGISTRATION]: 'Confirm your email address',
  [VerificationCodeType.PASSWORD_RESET]: 'Reset your password',
} as const;

const EMAIL_DESCRIPTIONS = {
  [VerificationCodeType.REGISTRATION]:
    'Enter the 6-digit verification code below to complete your registration.',
  [VerificationCodeType.PASSWORD_RESET]:
    'Enter the 6-digit verification code below to reset your account password.',
} as const;

const APP_NAME = 'Memoro' as const;
const FOOTER_TAGLINE = 'Memoro — Lifetime media storage anchored to location and time' as const;
const EXPIRY_PREFIX = 'This code is valid for' as const;
const EXPIRY_SUFFIX = 'minutes.' as const;
const IGNORE_NOTICE = "If you didn't make this request, you can safely ignore this email." as const;

const MS_PER_MINUTE = 60000 as const;
const TTL_MINUTES = String(Math.floor(AUTH_CONSTRAINTS.VERIFICATION_CODE_TTL_MS / MS_PER_MINUTE));

export interface VerificationEmailPayload {
  code: string;
  type: VerificationCodeTypeValue;
}

export interface VerificationEmailResult {
  subject: string;
  html: string;
  text: string;
}

function renderHtmlBody(title: string, description: string, code: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0d0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0c0d0e; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #141518; border: 1px solid #23252a; border-radius: 16px; padding: 40px 32px; text-align: center;">
          <tr>
            <td>
              <div style="font-size: 26px; font-weight: 700; letter-spacing: -0.5px; color: #ffffff; margin-bottom: 28px;">
                ${APP_NAME}
              </div>
              <h1 style="font-size: 20px; font-weight: 600; color: #ffffff; margin: 0 0 12px; line-height: 28px;">
                ${title}
              </h1>
              <p style="font-size: 14px; line-height: 22px; color: #9da3ae; margin: 0 0 28px;">
                ${description}
              </p>
              <div style="background-color: #0c0d0e; border: 1px solid #2a2c32; border-radius: 12px; padding: 18px 24px; margin: 0 0 28px; display: inline-block;">
                <span style="font-family: 'SF Mono', Monaco, Consolas, 'Liberation Mono', monospace; font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #ffffff; text-indent: 10px; display: inline-block;">
                  ${code}
                </span>
              </div>
              <p style="font-size: 13px; line-height: 20px; color: #6b7280; margin: 0 0 8px;">
                ${EXPIRY_PREFIX} ${TTL_MINUTES} ${EXPIRY_SUFFIX}
              </p>
              <p style="font-size: 13px; line-height: 20px; color: #4b5563; margin: 0;">
                ${IGNORE_NOTICE}
              </p>
              <div style="border-top: 1px solid #23252a; margin: 32px 0 20px;"></div>
              <p style="font-size: 12px; color: #374151; margin: 0; line-height: 18px;">
                ${FOOTER_TAGLINE}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderTextBody(description: string, code: string): string {
  return `${APP_NAME}\n\n${description}\n\n${code}\n\n${EXPIRY_PREFIX} ${TTL_MINUTES} ${EXPIRY_SUFFIX}\n${IGNORE_NOTICE}\n\n${FOOTER_TAGLINE}`;
}

export function renderVerificationEmail(
  payload: VerificationEmailPayload,
): VerificationEmailResult {
  const { code, type } = payload;
  const subject = EMAIL_SUBJECTS[type];
  const title = EMAIL_TITLES[type];
  const description = EMAIL_DESCRIPTIONS[type];

  return {
    subject,
    html: renderHtmlBody(title, description, code),
    text: renderTextBody(description, code),
  };
}
