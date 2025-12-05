const API_URL = 'http://localhost:5000/utilisateur';

export const getUsers = async () => {
  const response = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  console.log(localStorage.getItem('refreshToken'));
  if (response.status === 401) {
    const refreshResp = await fetch('http://localhost:5000/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appType: "web",
        refreshToken: localStorage.getItem('refreshToken')
      })
    });
    console.log(refreshResp);
    if (refreshResp.ok) {
      const refreshData = await refreshResp.json();

      localStorage.setItem('token', refreshData.token);
      localStorage.setItem('refreshToken', refreshData.newRefreshToken);

      return await getUsers();
    } else {
      throw new Error("Refresh token invalide, reconnectez-vous.");
    }
  }

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
  if (response.status === 401) {
    const refreshResp = await fetch('http://localhost:5000/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appType: "web",
        refreshToken: localStorage.getItem('refreshToken')
      })
    });
    console.log(refreshResp);
    if (refreshResp.ok) {
      const refreshData = await refreshResp.json();

      localStorage.setItem('token', refreshData.token);
      localStorage.setItem('refreshToken', refreshData.newRefreshToken);

      return await getUserById(id);
    } else {
      throw new Error("Refresh token invalide, reconnectez-vous.");
    }
  }
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
  if (response.status === 401) {
    const refreshResp = await fetch('http://localhost:5000/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appType: "web",
        refreshToken: localStorage.getItem('refreshToken')
      })
    });
    console.log(refreshResp);
    if (refreshResp.ok) {
      const refreshData = await refreshResp.json();

      localStorage.setItem('token', refreshData.token);
      localStorage.setItem('refreshToken', refreshData.newRefreshToken);

      return await createUser(user);
    } else {
      throw new Error("Refresh token invalide, reconnectez-vous.");
    }
  }
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
  if (response.status === 401) {
    const refreshResp = await fetch('http://localhost:5000/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appType: "web",
        refreshToken: localStorage.getItem('refreshToken')
      })
    });
    console.log(refreshResp);
    if (refreshResp.ok) {
      const refreshData = await refreshResp.json();

      localStorage.setItem('token', refreshData.token);
      localStorage.setItem('refreshToken', refreshData.newRefreshToken);

      return await updateUser(id, user);
    } else {
      throw new Error("Refresh token invalide, reconnectez-vous.");
    }
  }
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
  if (response.status === 401) {
    const refreshResp = await fetch('http://localhost:5000/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appType: "web",
        refreshToken: localStorage.getItem('refreshToken')
      })
    });
    console.log(refreshResp);
    if (refreshResp.ok) {
      const refreshData = await refreshResp.json();

      localStorage.setItem('token', refreshData.token);
      localStorage.setItem('refreshToken', refreshData.newRefreshToken);

      return await deleteUser(id);
    } else {
      throw new Error("Refresh token invalide, reconnectez-vous.");
    }
  }
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de l\'utilisateur');
  }
  return await response.json();
};
