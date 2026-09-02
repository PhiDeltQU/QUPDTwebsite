'use client';

import { ApiForm } from '@/components/forms/api-form';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function MentorSignupForm() {
  return (
    <ApiForm
      title="Volunteer as a Mentor"
      description="Share your background and availability, and officers will reach out with mentee matches."
      endpoint="/api/mentorship/mentor"
      submitLabel="Submit mentor interest"
      successMessage="Thank you for volunteering — your mentor interest is now in front of officers for review."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name"><Input name="name" required /></Field>
        <Field label="Email"><Input name="email" type="email" required /></Field>
        <Field label="Graduation year"><Input name="graduationYear" required /></Field>
        <Field label="Company and title"><Input name="companyTitle" required /></Field>
        <Field label="Industry"><Input name="industry" required /></Field>
        <Field label="Availability"><Input name="availability" required placeholder="Monthly call, one-time coffee chat, internship guidance…" /></Field>
      </div>
      <Field label="Preferred mentoring areas">
        <Textarea name="mentoringAreas" required placeholder="Finance recruiting, internships, networking, leadership, graduate school, entrepreneurship…" />
      </Field>
    </ApiForm>
  );
}
