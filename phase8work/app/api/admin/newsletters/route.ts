import { adminNewsletterSchema } from '@/lib/validations/admin';
import { persistAdminNewsletter, updateAdminNewsletter } from '@/lib/actions/admin-persist';
import { getAdminNewsletterRecords } from '@/lib/queries/admin';
import { createAdminCrudHandlers } from '@/lib/api/admin-crud-route';

export const { GET, POST, PUT, DELETE } = createAdminCrudHandlers({
  schema: adminNewsletterSchema,
  invalidPayloadError: 'Invalid newsletter payload.',
  getRecords: getAdminNewsletterRecords,
  create: persistAdminNewsletter,
  update: updateAdminNewsletter,
  createdMessage: {
    supabase: 'Newsletter created successfully.',
    demo: 'Newsletter saved in demo mode and written locally.',
  },
  updatedMessage: { supabase: 'Newsletter updated successfully.', demo: 'Newsletter updated in demo mode.' },
  deleteRecord: async (supabase, id) => {
    const { error } = await supabase.from('newsletters').delete().eq('id', id);
    return { error: error?.message ?? null };
  },
  demoTable: 'newsletters',
  deletedMessage: 'Newsletter deleted.',
});
