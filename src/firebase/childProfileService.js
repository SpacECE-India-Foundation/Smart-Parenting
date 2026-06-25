import client from '../api/client';

export const getChildProfiles = async (parentUid) => {
  try {
    const { data } = await client.get('/children', { params: { parentUid } });
    return { data: data.data, error: null };
  } catch (e) {
    return { data: [], error: e.response?.data?.error || e.message };
  }
};

export const getChildProfile = async (profileId) => {
  try {
    const { data } = await client.get(`/children/${profileId}`);
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const createChildProfile = async (parentUid, profileData) => {
  try {
    const { data } = await client.post('/children', { ...profileData, parent_uid: parentUid });
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const updateChildProfile = async (profileId, updates) => {
  try {
    const { data } = await client.put(`/children/${profileId}`, updates);
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const deleteChildProfile = async (profileId) => {
  try {
    await client.delete(`/children/${profileId}`);
    return { error: null };
  } catch (e) {
    return { error: e.response?.data?.error || e.message };
  }
};

export const AVATARS = [
  { id: 'avatar1',  emoji: '🧒', label: 'Kid'       },
  { id: 'avatar2',  emoji: '👦', label: 'Boy'       },
  { id: 'avatar3',  emoji: '👧', label: 'Girl'      },
  { id: 'avatar4',  emoji: '🧑', label: 'Child'     },
  { id: 'avatar5',  emoji: '👶', label: 'Baby'      },
  { id: 'avatar6',  emoji: '🦸', label: 'Hero'      },
  { id: 'avatar7',  emoji: '🧙', label: 'Wizard'    },
  { id: 'avatar8',  emoji: '🦊', label: 'Fox'       },
  { id: 'avatar9',  emoji: '🐼', label: 'Panda'     },
  { id: 'avatar10', emoji: '🦁', label: 'Lion'      },
  { id: 'avatar11', emoji: '🐸', label: 'Frog'      },
  { id: 'avatar12', emoji: '🚀', label: 'Astronaut' },
];

export const AGE_GROUPS = [
  { id: 'group1', label: '3-4 years', min: 3, max: 4 },
  { id: 'group2', label: '4-5 years', min: 4, max: 5 },
  { id: 'group3', label: '5-6 years', min: 5, max: 6 },
  { id: 'group4', label: '6-8 years', min: 6, max: 8 },
];