import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({
        id: 1,
        name: 'Jean Dupont',
        role: 'Administrateur' // Change this to 'Technicien' or 'Gestionnaire' to test permission
    });

    const [activeTab, setActiveTab] = useState(currentUser.role === 'Administrateur' ? 'Utilisateurs' : 'Interventions');
    const [showCreateUserForm, setShowCreateUserForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const users = await getUsers();
                setUserList(users);
            } catch (error) {
                console.error("Erreur chargement utilisateurs:", error);
            }
        };
        if (activeTab === 'Utilisateurs' && currentUser.role === 'Administrateur') {
            loadUsers();
        }
    }, [activeTab, currentUser.role]);

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userRole, setUserRole] = useState('Gestionnaire');

    const handleTabChange = (tab) => {
        if (tab === 'Utilisateurs' && currentUser.role !== 'Administrateur') {
            alert("Accès refusé : Seuls les administrateurs peuvent accéder à cette page.");
            return;
        }
        setActiveTab(tab);
        setShowCreateUserForm(false);
        setSelectedUser(null);
        setIsEditing(false);
    };

    const resetForm = () => {
        setUserName('');
        setUserEmail('');
        setUserPassword('');
        setUserRole('Gestionnaire');
        setShowPassword(false);
    };

    const handleBack = () => {
        setShowCreateUserForm(false);
        setSelectedUser(null);
        setIsEditing(false);
        resetForm();
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        const newUserPayload = {
            mail: userEmail,
            role: userRole,
            mdp: userPassword,
        };
        try {
            const createdUserResponse = await createUser(newUserPayload);
            const newUserForList = {
                ...createdUserResponse,
                mail: userEmail,
                nom_role: userRole,
                mdp: userPassword
            };

            setUserList([...userList, newUserForList]);
            resetForm();
            setShowCreateUserForm(false);
        } catch (error) {
            console.error("Détails de l'erreur:", error);
            alert(`Erreur lors de la création : ${error.message}`);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const userToUpdate = {
            mail: userEmail,
            role: userRole
        };
        if (userPassword) userToUpdate.mdp = userPassword;

        try {
            await updateUser(selectedUser.id, userToUpdate);

            const updatedUserComplete = {
                ...selectedUser,
                mail: userEmail,
                nom_role: userRole,
                ...(userPassword ? { mdp: userPassword } : {})
            };

            const updatedUserList = userList.map(u =>
                u.id === selectedUser.id ? updatedUserComplete : u
            );
            setUserList(updatedUserList);
            setSelectedUser(null);
            setIsEditing(false);
            resetForm();
        } catch (error) {
            alert("Erreur lors de la modification de l'utilisateur");
        }
    };

    const handleDeleteUser = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await deleteUser(selectedUser.id);
                const updatedUserList = userList.filter(u => u.id !== selectedUser.id);
                setUserList(updatedUserList);
                setSelectedUser(null);
                setIsEditing(false);
                resetForm();
            } catch (error) {
                alert("Erreur lors de la suppression de l'utilisateur");
            }
        }
    };

    const openCreateForm = () => {
        resetForm();
        setSelectedUser(null);
        setShowCreateUserForm(true);
        setIsEditing(true);
    };

    const openEditForm = (user) => {
        setSelectedUser(user);
        setUserName(user.mail ? user.mail.split('@')[0] : '');
        setUserEmail(user.mail);
        setUserPassword(user.mdp || '');
        setUserRole(user.nom_role);
        setShowCreateUserForm(false);
        setIsEditing(false);
        setShowPassword(false);
    };

    const cancelEdit = () => {
        setUserName(selectedUser.mail ? selectedUser.mail.split('@')[0] : '');
        setUserEmail(selectedUser.mail);
        setUserPassword(selectedUser.mdp || '');
        setUserRole(selectedUser.nom_role);
        setIsEditing(false);
        setShowPassword(false);
    };


    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h1 className="text-2xl font-bold">FieldTrack</h1>
                    {/* Debugging Tool to switch roles */}
                    <div className="mt-2 text-xs">
                        <label className="block text-gray-400 mb-1">Role actuel (Demo):</label>
                        <select
                            className="bg-gray-700 text-white text-xs p-1 rounded w-full"
                            value={currentUser.role}
                            onChange={(e) => {
                                const newRole = e.target.value;
                                setCurrentUser({...currentUser, role: newRole});
                                if (newRole !== 'Administrateur' && activeTab === 'Utilisateurs') {
                                    setActiveTab('Interventions');
                                }
                            }}
                        >
                            <option value="Administrateur">Administrateur</option>
                            <option value="Technicien">Technicien</option>
                            <option value="Gestionnaire">Gestionnaire</option>
                        </select>
                    </div>
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
                        {currentUser.role === 'Administrateur' && (
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
                        )}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button onClick={() => navigate('/')} 
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-center transition-colors">
                        Déconnexion
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {selectedUser
                                ? isEditing
                                    ? "Modifier l'utilisateur"
                                    : `Détails de l'utilisateur : ${selectedUser.mail}`
                                : showCreateUserForm
                                    ? 'Créer un utilisateur'
                                    : activeTab}
                        </h2>
                        {activeTab === 'Utilisateurs' && currentUser.role === 'Administrateur' && !showCreateUserForm && !selectedUser && (
                            <button
                                onClick={openCreateForm}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                Créer
                            </button>
                        )}
                        {(showCreateUserForm || selectedUser) && (
                            <button
                                onClick={handleBack}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                Retour
                            </button>
                        )}
                    </div>

                    {activeTab === 'Utilisateurs' && currentUser.role === 'Administrateur' ? (
                        (showCreateUserForm || selectedUser) ? (
                            <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                                <form onSubmit={selectedUser && isEditing ? handleUpdateUser : handleCreateUser}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
                                            Nom (déduit de l'email)
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                                            id="userName"
                                            type="text"
                                            placeholder="Nom de l'utilisateur"
                                            value={userName}
                                            readOnly
                                            disabled
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
                                            value={userEmail}
                                            onChange={(e) => {
                                                setUserEmail(e.target.value);
                                                setUserName(e.target.value.split('@')[0]);
                                            }}
                                            required
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                            Mot de passe
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="******************"
                                                value={userPassword}
                                                onChange={(e) => setUserPassword(e.target.value)}
                                                required={!selectedUser}
                                                disabled={!isEditing}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 cursor-pointer"
                                                disabled={!isEditing}
                                            >
                                                {showPassword ? '🙈' : '👁️'}
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
                                            value={userRole}
                                            onChange={(e) => setUserRole(e.target.value)}
                                            disabled={!isEditing}
                                        >
                                            <option value="Gestionnaire">Gestionnaire</option>
                                            <option value="Technicien">Technicien</option>
                                            <option value="Administrateur">Administrateur</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            {selectedUser && (
                                                <button
                                                    type="button"
                                                    onClick={handleDeleteUser}
                                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                                                >
                                                    Supprimer
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex space-x-4">
                                            {selectedUser && isEditing && (
                                                <button
                                                    type="button"
                                                    onClick={cancelEdit}
                                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                                                >
                                                    Annuler
                                                </button>
                                            )}
                                            <button
                                                type={selectedUser && !isEditing ? "button" : "submit"}
                                                onClick={selectedUser && !isEditing ? (e) => { e.preventDefault(); setIsEditing(true); } : undefined}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                                            >
                                                {selectedUser
                                                    ? isEditing
                                                        ? 'Enregistrer'
                                                        : 'Modifier'
                                                    : 'Créer'}
                                            </button>
                                        </div>
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
                                            Email / Nom
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {userList.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => openEditForm(user)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.nom_role === 'Administrateur' ? 'bg-purple-100 text-purple-800' :
                                  user.nom_role === 'Technicien' ? 'bg-green-100 text-green-800' :
                                      'bg-gray-100 text-gray-800'
                          }`}>
                            {user.nom_role}
                          </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{user.mail}</div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ) : activeTab === 'Utilisateurs' ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Accès Refusé!</strong>
                            <span className="block sm:inline"> Vous n\'avez pas les droits nécessaires pour voir cette page.</span>
                        </div>
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
