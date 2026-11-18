export type FieldType = 'text' | 'textarea' | 'image' | 'link' | 'toggle';

export type ContentField = {
  key: string;
  label: string;
  type: FieldType;
  default: string;
  help?: string;
};

export type ContentSection = {
  title: string;
  description?: string;
  fields: ContentField[];
};

export type PageDefinition = {
  /** Stored in site_content.page_slug. Never change this once live. */
  slug: string;
  /** Name shown to officers in the editor. */
  label: string;
  /** Public URL of the page, used for the "View page" link. Empty for site wide settings. */
  path: string;
  description: string;
  sections: ContentSection[];
};

export type PageContent = Record<string, string>;
