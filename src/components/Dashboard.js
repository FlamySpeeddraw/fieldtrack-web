import React, { useState } from 'react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Utilisateurs');
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  // Initial mock data for users
  const initialUsers = [
    { id: 1, name: 'Jean Dupont', role: 'Administrateur', email: 'jean.dupont@example.com' },
    { id: 2, name: 'Marie Martin', role: 'Technicien', email: 'marie.martin@example.com' },
    { id: 3, name: 'Pierre Durand', role: 'Gestionnaire', email: 'pierre.durand@example.com' },
    { id: 4, name: 'Sophie Lefebvre', role: 'Technicien', email: 'sophie.lefebvre@example.com' },
    { id: 5, name: 'Lucas Moreau', role: 'Gestionnaire', email: 'lucas.moreau@example.com' },
  ];

  // State to manage the list of users
  const [userList, setUserList] = useState(initialUsers);

  // State for form inputs
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Gestionnaire'); // Default role

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowCreateUserForm(false); // Hide form when changing tabs
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const newUser = {
      id: userList.length > 0 ? Math.max(...userList.map(u => u.id)) + 1 : 1, // Simple ID generation
      name: newUserName || newUserEmail.split('@')[0],
      email: newUserEmail,
      role: newUserRole,
      // password is not stored in the display list for security reasons,
      // but would be sent to a backend
    };
    setUserList([...userList, newUser]);
    // Clear form fields and hide form
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserRole('Gestionnaire');
    setShowCreateUserForm(false);
    setShowPassword(false); // Reset password visibility
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">FieldTrack</h1>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleTabChange('Interventions')}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === 'Interventions' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                Interventions
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange('Utilisateurs')}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === 'Utilisateurs' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                Utilisateurs
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-center transition-colors">
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {showCreateUserForm ? 'Créer un utilisateur' : activeTab}
            </h2>
            {activeTab === 'Utilisateurs' && !showCreateUserForm && (
              <button
                onClick={() => setShowCreateUserForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Créer
              </button>
            )}
          </div>

          {activeTab === 'Utilisateurs' ? (
            showCreateUserForm ? (
              <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <form onSubmit={handleCreateUser}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
                      Nom
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="userName"
                      type="text"
                      placeholder="Nom de l'utilisateur"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      placeholder="Email de l'utilisateur"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                      Mot de passe
                    </label>
                    <div className="relative"> {/* Added relative positioning for the icon */}
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10" // Added pr-10 for padding
                        id="password"
                        type={showPassword ? 'text' : 'password'} // Dynamic type
                        placeholder="******************"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button" // Important to prevent form submission
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 cursor-pointer"
                      >
                        {showPassword ? '🙈' : '👁️'} {/* Eye icon or similar */}
                      </button>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                      Rôle
                    </label>
                    <select
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                      id="role"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                    >
                      <option value="Gestionnaire">Gestionnaire</option>
                      <option value="Technicien">Technicien</option>
                      <option value="Administrateur">Administrateur</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateUserForm(false)}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                    >
                      Créer
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userList.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'Administrateur' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'Technicien' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">Contenu des interventions à venir...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;