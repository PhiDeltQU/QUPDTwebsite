import type { ContentField, PageContent } from './types';

export const text = (key: string, label: string, value: string, help?: string): ContentField => ({ key, label, type: 'text', default: value, help });
export const area = (key: string, label: string, value: string, help?: string): ContentField => ({ key, label, type: 'textarea', default: value, help });
export const image = (key: string, label: string, value: string, help?: string): ContentField => ({
  key,
  label,
  type: 'image',
  default: value,
  help: help ?? 'Upload a new photo or paste an image link. Wide photos work best.',
});
export const link = (key: string, label: string, value: string, help?: string): ContentField => ({
  key,
  label,
  type: 'link',
  default: value,
  help: help ?? 'A page on this site like /contact, or a full web address like https://example.com.',
});
export const toggle = (key: string, label: string, on: boolean, help?: string): ContentField => ({ key, label, type: 'toggle', default: on ? 'yes' : 'no', help });

/** Standard hero block: small label, big title, intro paragraph, photo. */
export function heroFields(prefix: string, d: { eyebrow: string; title: string; description: string; image?: string; imageAlt?: string }): ContentField[] {
  const fields = [
    text(`${prefix}Eyebrow`, 'Small label above the title', d.eyebrow),
    text(`${prefix}Title`, 'Main title', d.title),
    area(`${prefix}Description`, 'Intro paragraph', d.description),
  ];
  if (d.image !== undefined) {
    fields.push(image(`${prefix}Image`, 'Photo', d.image));
    fields.push(text(`${prefix}ImageAlt`, 'Photo description (for screen readers)', d.imageAlt ?? ''));
  }
  return fields;
}

/** Section heading block: small label, title, intro. */
export function headingFields(prefix: string, d: { eyebrow?: string; title: string; description?: string }): ContentField[] {
  const fields: ContentField[] = [];
  if (d.eyebrow !== undefined) fields.push(text(`${prefix}Eyebrow`, 'Small label', d.eyebrow));
  fields.push(text(`${prefix}Title`, 'Heading', d.title));
  if (d.description !== undefined) fields.push(area(`${prefix}Description`, 'Intro paragraph', d.description));
  return fields;
}

export function buttonFields(prefix: string, label: string, d: { label: string; href: string }): ContentField[] {
  return [text(`${prefix}Label`, `${label} text`, d.label, 'Leave blank to hide this button.'), link(`${prefix}Href`, `${label} goes to`, d.href)];
}

type ItemSpec = { name: string; label: string; type?: 'text' | 'textarea' | 'image' | 'link' };

/**
 * Repeating cards/items stored as numbered keys (card1Title, card2Title, ...).
 * Officers get a fixed number of slots; a slot with an empty first field is hidden on the site.
 */
export function repeatFields(prefix: string, itemLabel: string, slots: number, spec: ItemSpec[], defaults: Record<string, string>[]): ContentField[] {
  const fields: ContentField[] = [];
  for (let i = 1; i <= slots; i++) {
    const d = defaults[i - 1] ?? {};
    spec.forEach((s, idx) => {
      const key = `${prefix}${i}${cap(s.name)}`;
      const label = `${itemLabel} ${i}: ${s.label}`;
      const help = idx === 0 ? `Leave blank to hide ${itemLabel.toLowerCase()} ${i}.` : undefined;
      const value = d[s.name] ?? '';
      if (s.type === 'textarea') fields.push(area(key, label, value, help));
      else if (s.type === 'image') fields.push(image(key, label, value));
      else if (s.type === 'link') fields.push(link(key, label, value));
      else fields.push(text(key, label, value, help));
    });
  }
  return fields;
}

/** Read repeating items back out. Items whose first field is blank are dropped. */
export function items<K extends string>(content: PageContent, prefix: string, slots: number, names: readonly K[]): Record<K, string>[] {
  const out: Record<K, string>[] = [];
  for (let i = 1; i <= slots; i++) {
    const item = {} as Record<K, string>;
    for (const n of names) item[n] = (content[`${prefix}${i}${cap(n)}`] ?? '').trim();
    if (item[names[0]]) out.push(item);
  }
  return out;
}

export function isOn(content: PageContent, key: string) {
  return (content[key] ?? '').toLowerCase() === 'yes';
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
