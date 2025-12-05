const API_URL = 'http://localhost:5000/interventions';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const getInterventions = async () => {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur ${response.status}: ${errorText || 'Erreur lors de la récupération des interventions'}`);
  }
  const json = await response.json();
  return json.data ? json.data : json;
};

export const getInterventionById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur ${response.status}: ${errorText || 'Erreur lors de la récupération de l\'intervention'}`);
  }
  const json = await response.json();
  return json.data ? json.data : json;
};

export const getInterventionByUserId = async (id) => {
  const response = await fetch(`${API_URL}/user/${id}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur ${response.status}: ${errorText || 'Erreur lors de la récupération de l\'intervention'}`);
  }
  const json = await response.json();
  return json.data ? json.data : json;
};

export const postIntervention = async (interventionData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(interventionData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur ${response.status}: ${errorText || response.statusText}`);
  }
  const json = await response.json();
  return json.data ? json.data : json;
};

export const updateIntervention = async (id, interventionData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(interventionData),
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
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur ${response.status}: ${errorText || response.statusText}`);
  }
  return await response.json();
};