import { isOn } from '@/lib/content/fields';
import { getPageContent } from '@/lib/content/get-content';
import { LinkedInGroupPopup } from './linkedin-group-popup';

/** Renders the LinkedIn popup using the text in Site wide settings, or nothing when it is switched off. */
export async function LinkedInGroupPopupFromSettings() {
  const c = await getPageContent('site');
  if (!isOn(c, 'popupEnabled') || !c.popupUrl) return null;
  return <LinkedInGroupPopup title={c.popupTitle} text={c.popupText} buttonLabel={c.popupButtonLabel || 'Join the Group'} url={c.popupUrl} />;
}
