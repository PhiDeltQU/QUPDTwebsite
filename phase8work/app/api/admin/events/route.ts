import { adminEventSchema } from '@/lib/validations/admin';
import { persistAdminEvent, updateAdminEvent } from '@/lib/actions/admin-persist';
import { getAdminEventRecords } from '@/lib/queries/admin';
import { createAdminCrudHandlers } from '@/lib/api/admin-crud-route';

export const { GET, POST, PUT, DELETE } = createAdminCrudHandlers({
  schema: adminEventSchema,
  invalidPayloadError: 'Invalid event payload.',
  getRecords: getAdminEventRecords,
  create: persistAdminEvent,
  update: updateAdminEvent,
  createdMessage: { supabase: 'Event created successfully.', demo: 'Event created in demo mode and saved locally.' },
  updatedMessage: { supabase: 'Event updated successfully.', demo: 'Event updated in demo mode.' },
  deleteRecord: async (supabase, id) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    return { error: error?.message ?? null };
  },
  demoTable: 'events',
  deletedMessage: 'Event deleted.',
});
