'use client';

import { useState } from 'react';

export function NewsletterSendButton({ newsletterId, alreadySent = false }: { newsletterId: string; alreadySent?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function send(resend: boolean) {
    const response = await fetch('/api/admin/newsletters/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newsletterId, resend }),
    });
    const payload = await response.json().catch(() => ({}));
    return { response, payload };
  }

  async function handleSend() {
    const firstPrompt = alreadySent
      ? 'This issue was already sent. Send again to everyone?'
      : 'Send this issue to every newsletter subscriber now? This cannot be undone.';
    if (!window.confirm(firstPrompt)) return;

    setLoading(true);
    setMessage(null);

    try {
      let { response, payload } = await send(alreadySent);

      if (response.status === 409 && payload.alreadySent) {
        if (!window.confirm('This issue was already sent. Send again to everyone?')) {
          setMessage('Not sent.');
          return;
        }
        ({ response, payload } = await send(true));
      }

      setMessage(response.ok ? payload.message || 'Newsletter sent.' : payload.error || 'Unable to send newsletter.');
    } catch {
      setMessage('Network error while sending. Check the newsletter status before trying again so nobody gets it twice.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleSend}
        disabled={loading}
        className="rounded-full bg-fraternity-azure px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Sending… keep this page open' : alreadySent ? 'Send again' : 'Send issue'}
      </button>
      {message ? <p className="text-xs text-fraternity-slate">{message}</p> : null}
    </div>
  );
}
