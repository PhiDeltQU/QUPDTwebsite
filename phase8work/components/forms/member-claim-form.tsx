'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const DEFAULT_SUCCESS_MESSAGE = 'If that name, graduation year, and email match an alumni record, we sent a secure setup link to that email.';

export function MemberClaimForm() {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    setState('submitting');
    setMessage('');
    setPreviewUrl(null);

    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get('fullName') || ''),
      graduationYear: Number(formData.get('graduationYear') || 0),
      email: String(formData.get('email') || '')
    };

    try {
      const response = await fetch('/api/member/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setState('error');
        setMessage(data.error || 'Unable to start account setup.');
        return;
      }

      setState('success');
      setMessage(data.message || DEFAULT_SUCCESS_MESSAGE);
      setPreviewUrl(typeof data.previewUrl === 'string' ? data.previewUrl : null);
      form.reset();
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Unable to start account setup.');
    }
  }

  return (
    <div className="surface mx-auto max-w-2xl p-8 md:p-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-azure">
          Alumni access
        </p>
        <h1 className="mt-3 text-4xl">Claim your alumni profile</h1>
        <p className="mt-4 text-fraternity-slate">
          Use the name, graduation year, and email already on file with your alumni record. If it matches, we&apos;ll email you a secure link to finish setting your password.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label="Full name">
          <Input name="fullName" placeholder="Full name" required />
        </Field>

        <Field label="Graduation year">
          <Input name="graduationYear" type="number" placeholder="2014" required />
        </Field>

        <Field label="Email used in alumni records">
          <Input name="email" type="email" placeholder="name@example.org" required />
        </Field>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button className="min-w-40">
            {state === 'submitting' ? 'Sending link...' : 'Send setup link'}
          </Button>
          <Button href="/member/login" type="button" variant="secondary">
            Back to login
          </Button>
        </div>

        {state === 'success' ? (
          <div role="status" aria-live="polite" className="space-y-3 text-sm font-medium text-emerald-700">
            <p>{message}</p>
            {previewUrl ? (
              <p className="text-fraternity-charcoal">
                Dev preview link: <a href={previewUrl} className="text-fraternity-azure underline underline-offset-4">{previewUrl}</a>
              </p>
            ) : null}
          </div>
        ) : null}

        {state === 'error' ? (
          <p role="alert" aria-live="assertive" className="text-sm font-medium text-red-700">{message}</p>
        ) : null}
      </form>
    </div>
  );
}
