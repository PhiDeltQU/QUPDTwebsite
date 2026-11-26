import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { ContactForm } from '@/components/forms/contact-form';
import { getPageContent } from '@/lib/content/get-content';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Phi Delta Theta Connecticut Epsilon at Quinnipiac University.',
};

export default async function ContactPage() {
  const c = await getPageContent('contact');

  return (
    <>
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} description={c.heroDescription} />
      <SectionShell title={c.formTitle} description={c.formDescription}>
        <div className="max-w-3xl">
          <ContactForm title={c.formCardTitle} description={c.formCardDescription} successMessage={c.formSuccessMessage} />
        </div>
      </SectionShell>
    </>
  );
}
