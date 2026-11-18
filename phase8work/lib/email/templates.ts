function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function newsletterHtmlTemplate(input: { title: string; summary: string; body: string; siteUrl?: string; unsubscribeUrl?: string }) {
  const paragraphs = input.body
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;color:#2b2b2b;line-height:1.7;font-size:16px;">${escapeHtml(paragraph)}</p>`
    )
    .join('');

  const safeSiteUrl = input.siteUrl ? escapeHtml(input.siteUrl) : null;

  return `
  <div style="background:#f6f1e7;padding:32px 16px;font-family:Georgia,serif;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:20px;padding:40px;border:1px solid rgba(0,0,0,0.08);">
      <p style="margin:0 0 10px;color:#7b1e2b;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:700;">Phi Delta Theta</p>
      <h1 style="margin:0 0 12px;color:#181818;font-size:34px;line-height:1.15;">${escapeHtml(input.title)}</h1>
      <p style="margin:0 0 24px;color:#5d5d5d;font-size:17px;line-height:1.7;">${escapeHtml(input.summary)}</p>
      ${paragraphs}
      ${safeSiteUrl ? `<p style="margin-top:28px;font-family:Arial,sans-serif;"><a href="${safeSiteUrl}" style="display:inline-block;background:#7b1e2b;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600;">View on the website</a></p>` : ''}
    </div>
    ${input.unsubscribeUrl ? `<p style="max-width:680px;margin:16px auto 0;text-align:center;color:#7a7a7a;font-size:12px;font-family:Arial,sans-serif;line-height:1.6;">You are receiving this because you signed up for Phi Delta Theta Connecticut Epsilon updates.<br /><a href="${escapeHtml(input.unsubscribeUrl)}" style="color:#7a7a7a;">Unsubscribe</a></p>` : ''}
  </div>`;
}

export function newsletterTextTemplate(input: { title: string; summary: string; body: string; siteUrl?: string; unsubscribeUrl?: string }) {
  return [
    input.title,
    '',
    input.summary,
    '',
    input.body,
    input.siteUrl ? `Read more: ${input.siteUrl}` : '',
    input.unsubscribeUrl ? `\nUnsubscribe: ${input.unsubscribeUrl}` : '',
  ].join('\n');
}
