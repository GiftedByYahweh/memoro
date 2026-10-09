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
  [VerificationCodeType.REGISTRATION]: 'Confirm your email',
  [VerificationCodeType.PASSWORD_RESET]: 'Reset your password',
} as const;

const EMAIL_DESCRIPTIONS = {
  [VerificationCodeType.REGISTRATION]: 'Enter this code in Memoro to finish signing up.',
  [VerificationCodeType.PASSWORD_RESET]: 'Enter this code in Memoro to set a new password.',
} as const;

const APP_NAME = 'Memoro';
const LOGO_LETTER = 'M';
const IGNORE_NOTICE = "Didn't request this? You can safely ignore this email.";

const COLORS = {
  page: '#f8f9fa',
  surface: '#ffffff',
  border: '#dadce0',
  primary: '#1a73e8',
  primaryContainer: '#e8f0fe',
  onPrimaryContainer: '#174ea6',
  textPrimary: '#202124',
  textSecondary: '#5f6368',
  textTertiary: '#80868b',
  white: '#ffffff',
} as const;

const FONT_SANS = "'Google Sans', Roboto, 'Segoe UI', Helvetica, Arial, sans-serif";
const FONT_MONO = "'Roboto Mono', 'SF Mono', Consolas, 'Liberation Mono', monospace";
const FONT_STYLESHEET_URL =
  'https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500&family=Roboto+Mono:wght@500&display=swap';

const MS_PER_MINUTE = 60_000;
const TTL_MINUTES = Math.floor(AUTH_CONSTRAINTS.VERIFICATION_CODE_TTL_MS / MS_PER_MINUTE);
const EXPIRY_NOTICE = `This code is valid for ${String(TTL_MINUTES)} minutes.`;

export interface VerificationEmailPayload {
  code: string;
  type: VerificationCodeTypeValue;
}

export interface VerificationEmailResult {
  subject: string;
  html: string;
  text: string;
}

function renderHeader(title: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0">
  <tr>
    <td width="40" height="40" align="center" valign="middle" style="width: 40px; height: 40px; background-color: ${COLORS.primary}; border-radius: 10px; font-family: ${FONT_SANS}; font-size: 20px; font-weight: 500; line-height: 40px; color: ${COLORS.white};">${LOGO_LETTER}</td>
    <td style="padding-left: 12px;">
      <h1 style="margin: 0; font-family: ${FONT_SANS}; font-size: 22px; font-weight: 500; line-height: 28px; color: ${COLORS.textPrimary};">${title}</h1>
      <p style="margin: 0; font-family: ${FONT_SANS}; font-size: 14px; line-height: 20px; color: ${COLORS.textSecondary};">${APP_NAME}</p>
    </td>
  </tr>
</table>`;
}

function renderCode(code: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding: 20px 16px 20px 24px; background-color: ${COLORS.primaryContainer}; border-radius: 12px; font-family: ${FONT_MONO}; font-size: 32px; font-weight: 500; letter-spacing: 8px; line-height: 40px; color: ${COLORS.onPrimaryContainer};">${code}</td>
  </tr>
</table>`;
}

function renderHtmlBody(title: string, description: string, code: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <link rel="stylesheet" href="${FONT_STYLESHEET_URL}">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.page}; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.page};">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 448px; background-color: ${COLORS.surface}; border: 1px solid ${COLORS.border}; border-radius: 28px;">
          <tr>
            <td style="padding: 32px;">
              ${renderHeader(title)}
              <div style="height: 1px; margin: 24px 0; background-color: ${COLORS.border}; line-height: 1px; font-size: 1px;">&nbsp;</div>
              <p style="margin: 0 0 20px; font-family: ${FONT_SANS}; font-size: 14px; line-height: 22px; color: ${COLORS.textSecondary};">${description}</p>
              ${renderCode(code)}
              <p style="margin: 20px 0 0; font-family: ${FONT_SANS}; font-size: 13px; line-height: 20px; color: ${COLORS.textSecondary};">${EXPIRY_NOTICE}</p>
            </td>
          </tr>
        </table>
        <p style="max-width: 448px; margin: 20px auto 0; font-family: ${FONT_SANS}; font-size: 12px; line-height: 18px; color: ${COLORS.textTertiary}; text-align: center;">${IGNORE_NOTICE}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderTextBody(title: string, description: string, code: string): string {
  return [`${APP_NAME} — ${title}`, description, code, EXPIRY_NOTICE, IGNORE_NOTICE].join('\n\n');
}

export function renderVerificationEmail(
  payload: VerificationEmailPayload,
): VerificationEmailResult {
  const { code, type } = payload;
  const title = EMAIL_TITLES[type];
  const description = EMAIL_DESCRIPTIONS[type];

  return {
    subject: EMAIL_SUBJECTS[type],
    html: renderHtmlBody(title, description, code),
    text: renderTextBody(title, description, code),
  };
}
