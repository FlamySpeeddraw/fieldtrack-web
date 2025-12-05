const API_URL = 'http://localhost:5000/utilisateur';

export const getUsers = async () => {
  const response = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des utilisateurs');
  }
  const json = await response.json();
  return json.data ? json.data : json;
};

export const getUserById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de l\'utilisateur');
  }
  const json = await response.json();
  return json.data ? json.data : json;
};

export const createUser = async (user) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur ${response.status}: ${errorText || response.statusText}`);
  }
  const json = await response.json();
  return json.data ? json.data : json;
};

export const updateUser = async (id, user) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
  }
  return await response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de l\'utilisateur');
  }
  return await response.json();
};
