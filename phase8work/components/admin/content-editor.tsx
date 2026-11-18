'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ExternalLink, ImageUp, RotateCcw } from 'lucide-react';
import type { ContentField, PageContent, PageDefinition } from '@/lib/content/types';

type Status = { kind: 'idle' | 'saving' | 'saved' | 'error'; message?: string };

const inputClass =
  'block w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-fraternity-charcoal outline-none transition focus:border-fraternity-azure focus:ring-2 focus:ring-fraternity-azure/20';

export function ContentEditor({ definition, initial }: { definition: PageDefinition; initial: PageContent }) {
  const [values, setValues] = useState<PageContent>(initial);
  const [saved, setSaved] = useState<PageContent>(initial);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const changedKeys = useMemo(() => Object.keys(values).filter((key) => values[key] !== saved[key]), [values, saved]);
  const dirty = changedKeys.length > 0;

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function set(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    if (status.kind !== 'saving') setStatus({ kind: 'idle' });
  }

  async function save() {
    setStatus({ kind: 'saving' });
    const changed = Object.fromEntries(changedKeys.map((key) => [key, values[key]]));
    try {
      const response = await fetch(`/api/admin/content/${definition.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: changed }),
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || 'Something went wrong. Try again.');
      setSaved(values);
      setStatus({ kind: 'saved', message: data.message || 'Saved.' });
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Something went wrong.' });
    }
  }

  return (
    <div className="space-y-5 pb-28">
      {definition.sections.map((section, index) => (
        <details key={section.title} open={index === 0} className="surface group overflow-hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6">
            <div>
              <h2 className="text-xl">{section.title}</h2>
              {section.description ? <p className="mt-1 text-sm text-fraternity-slate">{section.description}</p> : null}
            </div>
            <ChevronDown className="h-5 w-5 shrink-0 text-fraternity-slate transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="space-y-6 border-t border-black/5 p-6">
            {section.fields.map((field) => (
              <FieldEditor
                key={field.key}
                field={field}
                value={values[field.key] ?? ''}
                changed={values[field.key] !== saved[field.key]}
                onChange={(value) => set(field.key, value)}
              />
            ))}
          </div>
        </details>
      ))}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <p
            className={
              status.kind === 'error'
                ? 'text-sm font-medium text-red-700'
                : status.kind === 'saved'
                  ? 'text-sm font-medium text-green-700'
                  : 'text-sm text-fraternity-slate'
            }
            role="status"
          >
            {status.kind === 'saving'
              ? 'Saving…'
              : status.kind === 'error' || status.kind === 'saved'
                ? status.message
                : dirty
                  ? `${changedKeys.length} unsaved change${changedKeys.length === 1 ? '' : 's'}`
                  : 'No unsaved changes'}
          </p>
          <div className="flex gap-3">
            {definition.path ? (
              <a
                href={definition.path}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-fraternity-azure ring-1 ring-black/10 hover:bg-fraternity-parchment"
              >
                View page <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
            {dirty ? (
              <button
                type="button"
                onClick={() => {
                  setValues(saved);
                  setStatus({ kind: 'idle' });
                }}
                className="rounded-full px-5 py-3 text-sm font-medium text-fraternity-charcoal ring-1 ring-black/10 hover:bg-fraternity-parchment"
              >
                Undo changes
              </button>
            ) : null}
            <button
              type="button"
              onClick={save}
              disabled={!dirty || status.kind === 'saving'}
              className="rounded-full bg-fraternity-azure px-6 py-3 text-sm font-semibold text-white transition hover:bg-fraternity-azureDeep disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldEditor({ field, value, changed, onChange }: { field: ContentField; value: string; changed: boolean; onChange: (value: string) => void }) {
  const id = `field-${field.key}`;
  const isDefault = value === field.default;

  return (
    <div className={changed ? '-mx-3 rounded-2xl bg-fraternity-azure/5 px-3 py-3' : ''}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-fraternity-charcoal">
          {field.label}
          {changed ? <span className="ml-2 text-xs font-medium text-fraternity-azure">(unsaved)</span> : null}
        </label>
        {!isDefault && field.default ? (
          <button
            type="button"
            onClick={() => onChange(field.default)}
            className="inline-flex items-center gap-1 text-xs font-medium text-fraternity-slate hover:text-fraternity-azure"
            title="Put back the original text"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" /> Restore original
          </button>
        ) : null}
      </div>
      {field.help ? <p className="mt-1 text-xs text-fraternity-slate">{field.help}</p> : null}
      <div className="mt-2">
        {field.type === 'textarea' ? (
          <textarea id={id} className={inputClass} rows={Math.min(10, Math.max(3, Math.ceil(value.length / 90)))} value={value} onChange={(e) => onChange(e.target.value)} />
        ) : field.type === 'toggle' ? (
          <label className="inline-flex cursor-pointer items-center gap-3">
            <input id={id} type="checkbox" className="h-5 w-5 accent-fraternity-azure" checked={value === 'yes'} onChange={(e) => onChange(e.target.checked ? 'yes' : 'no')} />
            <span className="text-sm">{value === 'yes' ? 'On' : 'Off'}</span>
          </label>
        ) : field.type === 'image' ? (
          <ImageInput id={id} value={value} onChange={onChange} />
        ) : (
          <input id={id} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </div>
    </div>
  );
}

function ImageInput({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function upload(file: File) {
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const response = await fetch('/api/admin/content/upload', { method: 'POST', body: form });
      const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || 'Upload failed.');
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="h-28 w-44 shrink-0 overflow-hidden rounded-2xl bg-fraternity-parchment ring-1 ring-black/10">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-fraternity-slate">No photo</div>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium ring-1 ring-black/10 hover:bg-fraternity-parchment disabled:opacity-50"
        >
          <ImageUp className="h-4 w-4" aria-hidden="true" /> {uploading ? 'Uploading…' : 'Upload new photo'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
        <input id={id} className={inputClass} value={value} placeholder="or paste an image link" onChange={(e) => onChange(e.target.value)} />
        {error ? <p className="text-xs font-medium text-red-700">{error}</p> : null}
      </div>
    </div>
  );
}
