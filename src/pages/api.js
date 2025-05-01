
  // ========== CLINIC APIs ==========
const BASE_URL = 'http://localhost:3000/api/clinics';

export async function getClinics() {
  const res = await fetch(BASE_URL);
  return await res.json();
}

export async function createClinic(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Create failed');
  return await res.json();
}

export async function updateClinic(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Update failed');
  return await res.json();
}

export async function deleteClinic(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Delete failed');
}

export const getAdminUsers = async () => {
    const res = await fetch('/api/admins');
    return res.json();
  };
  
  export const getProviderUsers = async () => {
    const res = await fetch('/api/providers');
    return res.json();
  };
  
  // ========== USER APIs ==========

const USER_URL = 'http://localhost:3000/api/users';

export const getUsers = async () => {
  const res = await fetch(USER_URL);
  if (!res.ok) throw new Error('Failed to fetch users');
  return await res.json();
};

export const createUser = async (userData) => {
  const res = await fetch(USER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return await res.json();
};

export const updateUser = async (id, data) => {
  const res = await fetch(`${USER_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return await res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${USER_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return await res.json();
};
