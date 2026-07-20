import client from '../api/client';

/**
 * Fetch all teachers and children for assignments (Admin only)
 */
export const getAssignmentsData = async () => {
  try {
    const { data } = await client.get('/assignments');
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

/**
 * Assign a student child to a teacher (Admin only)
 */
export const assignStudent = async (teacherId, childId) => {
  try {
    const { data } = await client.post('/assignments', { teacherId, childId });
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

/**
 * Unassign a student child from a teacher (Admin only)
 */
export const unassignStudent = async (teacherId, childId) => {
  try {
    const { data } = await client.delete(`/assignments/${teacherId}/${childId}`);
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};
