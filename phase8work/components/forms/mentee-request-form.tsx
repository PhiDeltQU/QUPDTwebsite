import { ApiForm } from '@/components/forms/api-form';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function MenteeRequestForm() {
  return (
    <ApiForm
      title="Request a Mentor"
      description="Tell us what you're hoping to get out of a mentorship match, and an officer will follow up."
      endpoint="/api/mentorship/mentee"
      submitLabel="Request mentorship"
      successMessage="Your request was submitted. An officer will follow up about a mentor match."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name"><Input name="name" required /></Field>
        <Field label="Email"><Input name="email" type="email" required /></Field>
        <Field label="Class year"><Input name="classYear" required /></Field>
        <Field label="Career interests"><Input name="careerInterests" required placeholder="Consulting, product, law, medicine…" /></Field>
      </div>
      <Field label="What are you hoping to learn or accomplish?">
        <Textarea name="goals" required placeholder="Internship preparation, networking guidance, resume feedback, career exploration…" />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="LinkedIn or resume URL">
          <Input name="linkedInOrResume" placeholder="https://linkedin.com/in/..." />
        </Field>
        <Field label="Preferred mentor background">
          <Input name="preferredBackground" placeholder="Finance, alumni in Boston, startup experience…" />
        </Field>
      </div>
    </ApiForm>
  );
}
