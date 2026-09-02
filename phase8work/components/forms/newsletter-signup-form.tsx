'use client';

import { ApiForm } from '@/components/forms/api-form';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export function NewsletterSignupForm() {
  return (
    <ApiForm
      title="Join the Alumni Newsletter"
      description="Sign up to receive chapter updates, event recaps, and alumni news."
      endpoint="/api/newsletter/subscribe"
      submitLabel="Join the list"
      successMessage="Thanks for subscribing — you'll get the next chapter update."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="First name">
          <Input name="firstName" required placeholder="Christopher" />
        </Field>
        <Field label="Last name">
          <Input name="lastName" required placeholder="Lane" />
        </Field>
        <Field label="Email address">
          <Input type="email" name="email" required placeholder="you@example.com" />
        </Field>
        <Field label="Subscriber type">
          <Select name="subscriberType" required defaultValue="">
            <option value="" disabled>Choose one</option>
            <option value="active">Active Member</option>
            <option value="alumni">Alumni</option>
            <option value="parent">Parent / Family</option>
            <option value="supporter">Supporter</option>
            <option value="friend">Friend of the chapter</option>
          </Select>
        </Field>
      </div>
      <label className="flex items-start gap-3 rounded-2xl bg-fraternity-cream px-4 py-4 text-sm text-fraternity-slate">
        <Checkbox name="consent" />
        <span>I consent to receive chapter and alumni communications and understand that unsubscribe support should be enabled in production.</span>
      </label>
    </ApiForm>
  );
}
