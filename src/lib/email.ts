type Email = { to: string; subject: string; text: string };

/**
 * Sends a notification email through Resend when RESEND_API_KEY is set,
 * otherwise logs it so local development needs no mail setup.
 * Failures are logged and never break the user-facing action.
 */
export async function sendEmail({ to, subject, text }: Email) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email] to=${to} subject="${subject}"\n${text}`);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "Skillseek <noreply@example.com>",
        to,
        subject,
        text,
      }),
    });
    if (!res.ok) console.error(`[email] send failed: ${res.status} ${await res.text()}`);
  } catch (err) {
    console.error("[email] send failed", err);
  }
}

export function appUrl(path: string) {
  return `${process.env.APP_URL ?? "http://localhost:3000"}${path}`;
}
