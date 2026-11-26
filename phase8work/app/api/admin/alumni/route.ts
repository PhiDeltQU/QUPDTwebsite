import { adminAlumniSchema } from '@/lib/validations/admin';
import { persistAdminAlumni, updateAdminAlumni } from '@/lib/actions/admin-persist';
import { getAdminAlumniRecords } from '@/lib/queries/admin';
import { createAdminCrudHandlers } from '@/lib/api/admin-crud-route';

export const { GET, POST, PUT, DELETE } = createAdminCrudHandlers({
  schema: adminAlumniSchema,
  invalidPayloadError: 'Invalid alumni payload.',
  getRecords: getAdminAlumniRecords,
  create: persistAdminAlumni,
  update: updateAdminAlumni,
  createdMessage: {
    supabase: 'Alumni profile created successfully.',
    demo: 'Saved (demo mode, only on this computer).',
  },
  updatedMessage: {
    supabase: 'Alumni profile updated successfully.',
    demo: 'Updated (demo mode, only on this computer).',
  },
  // Alumni has a related private-details row to clean up first; every other
  // resource deletes from a single table, which is why this is the one route
  // that needs a non-trivial deleteRecord instead of a one-line table delete.
  deleteRecord: async (supabase, id) => {
    await supabase.from('alumni_private_details').delete().eq('alumni_profile_id', id);
    const { error } = await supabase.from('alumni_profiles').delete().eq('id', id);
    return { error: error?.message ?? null };
  },
  demoTable: 'alumni',
  deletedMessage: 'Alumni profile deleted.',
});
