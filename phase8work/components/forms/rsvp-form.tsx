import { ApiForm } from '@/components/forms/api-form';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function RSVPForm({ eventSlug, eventTitle }: { eventSlug: string; eventTitle: string }) {
  return (
    <ApiForm
      title={`RSVP for ${eventTitle}`}
      description="Let us know you're coming, including any guests joining you."
      endpoint="/api/events/rsvp"
      submitLabel="Submit RSVP"
      successMessage="Your RSVP was received — we'll see you there."
    >
      <input type="hidden" name="eventSlug" value={eventSlug} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full name"><Input name="fullName" required /></Field>
        <Field label="Email"><Input name="email" type="email" required /></Field>
        <Field label="Graduation year"><Input name="graduationYear" placeholder="2015" /></Field>
        <Field label="Guest count"><Input name="guestCount" type="number" min={0} max={10} defaultValue={0} data-number="true" /></Field>
      </div>
      <Field label="Special notes">
        <Textarea name="notes" placeholder="Dietary needs, seating requests, guest names…" />
      </Field>
    </ApiForm>
  );
}
