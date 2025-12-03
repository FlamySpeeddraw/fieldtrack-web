const API_URL = 'http://localhost:5000/interventions';

export const getInterventions = async () => {
  const response = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des interventions');
  }
  const json = await response.json();
  return json.data ? json.data : json;
};

export const getInterventionById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de l\'intervention');
  }
  const json = await response.json();
  return json.data ? json.data : json;
};

export const getInterventionByUserId = async (id) => {
  const response = await fetch(`${API_URL}/user/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de l\'intervention');
  }
  const json = await response.json();
  return json.data ? json.data : json;
};

export const postIntervention = async (user) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
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

export const updateIntervention = async (id, user) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
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

export const deleteIntervention = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur ${response.status}: ${errorText || response.statusText}`);
  }
  return await response.json();
};