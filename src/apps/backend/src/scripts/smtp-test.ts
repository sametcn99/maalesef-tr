import nodemailer from 'nodemailer';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Eksik env: ${name}`);
  }
  return value;
}

async function main() {
  const smtpHost = requireEnv('SMTP_HOST');
  const smtpPort = Number(requireEnv('SMTP_PORT'));
  const smtpSecure = process.env.SMTP_SECURE === 'true';
  const smtpUser = requireEnv('SMTP_USER');
  const smtpPass = requireEnv('SMTP_PASS');
  const mailFrom = requireEnv('MAIL_FROM');

  if (!Number.isFinite(smtpPort)) {
    throw new Error('SMTP_PORT sayısal olmalı.');
  }

  const recipient = process.argv[2] ?? 'sametcn99@gmail.com';

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.verify();

  const result = await transporter.sendMail({
    from: mailFrom,
    to: recipient,
    subject: 'Maalesef SMTP Test',
    text: `SMTP testi başarılı. Zaman: ${new Date().toISOString()}`,
    html: `<p>SMTP testi başarılı.</p><p>Zaman: ${new Date().toISOString()}</p>`,
  });

  console.log('Mail gönderildi:', result.messageId);
}

main().catch((err) => {
  console.error('SMTP test hatası:', err instanceof Error ? err.message : err);
  process.exit(1);
});
