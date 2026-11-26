import { adminMediaSchema } from '@/lib/validations/admin';
import { persistAdminMedia, updateAdminMedia } from '@/lib/actions/admin-persist';
import { getAdminMediaRecords } from '@/lib/queries/admin';
import { createAdminCrudHandlers } from '@/lib/api/admin-crud-route';

export const { GET, POST, PUT, DELETE } = createAdminCrudHandlers({
  schema: adminMediaSchema,
  invalidPayloadError: 'Invalid media payload.',
  getRecords: getAdminMediaRecords,
  create: persistAdminMedia,
  update: updateAdminMedia,
  createdMessage: {
    supabase: 'Media metadata saved successfully.',
    demo: 'Media record saved in demo mode and written locally.',
  },
  updatedMessage: { supabase: 'Media metadata updated successfully.', demo: 'Media updated in demo mode.' },
  deleteRecord: async (supabase, id) => {
    const { error } = await supabase.from('media_items').delete().eq('id', id);
    return { error: error?.message ?? null };
  },
  demoTable: 'media',
  deletedMessage: 'Media record deleted.',
});
