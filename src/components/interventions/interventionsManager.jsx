import React, { useState } from 'react';

const getStatusStyle = (status) => {
    switch (status) {
        case 'Plannifié':
            return {
                dotColor: 'bg-orange-500', 
            };
        case 'En cours':
            return {
                dotColor: 'bg-red-500', 
            };
        case 'Terminé':
            return {
                dotColor: 'bg-green-500', 
            };
        default:
            return {
                dotColor: 'bg-gray-500',
            };
    }
};

const InterventionsManager = ({ interventionList, setInterventionList, userList, currentUser }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedIntervention, setSelectedIntervention] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Plannifié');
    const [technicienId, setTechnicienId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [commentaire, setCommentaire] = useState("");  
    const [photo, setPhoto] = useState(""); 
    const [adresse, setAdresse] = useState("");

    const technicians = userList.filter(user => user.role === 'Technicien');

    const resetForm = () => {
        setTitre('');
        setDescription('');
        setStatus('Plannifié');
        setTechnicienId('');
        setDate(new Date().toISOString().split('T')[0]);
        setCommentaire(''); 
        setPhoto(''); 
        setAdresse('');
    };

    const handleBack = () => {
        setShowCreateForm(false);
        setSelectedIntervention(null);
        setIsEditing(false);
        resetForm();
    };

    const openCreateForm = () => {
        if (currentUser.role !== 'Gestionnaire' && currentUser.role !== 'Administrateur') {
            alert("Accès refusé. Seuls les Gestionnaires et Administrateurs peuvent créer des interventions.");
            return;
        }
        resetForm();
        setShowCreateForm(true);
        setIsEditing(true);
    };

    const openDetails = (intervention) => {
        setSelectedIntervention(intervention);
        setTitre(intervention.titre);
        setDescription(intervention.description);
        setStatus(intervention.status);
        setTechnicienId(intervention.technicienId || '');
        setDate(intervention.date);
        setCommentaire(intervention.commentaire || ""); 
        setPhoto(intervention.photo || ""); 
        setAdresse(intervention.adresse || "");        
        setShowCreateForm(false);
        setIsEditing(false);
    };

    const handleCreateOrUpdate = (e) => {
        e.preventDefault();
        
        const assignedTechnician = technicians.find(t => t.id === parseInt(technicienId));

        if (selectedIntervention && isEditing) {
            const updatedList = interventionList.map(item => 
                item.id === selectedIntervention.id ? { 
                    ...item, 
                    titre, 
                    description, 
                    status, 
                    technicienId: technicienId ? parseInt(technicienId) : null,
                    technicienName: assignedTechnician ? assignedTechnician.name : 'Non assigné',
                    date, 
                    commentaire, 
                    photo, 
                    adresse
                } : item
            );
            setInterventionList(updatedList);
            handleBack();
        } else {
            const newIntervention = {
                id: interventionList.length > 0 ? Math.max(...interventionList.map(i => i.id)) + 1 : 1,
                titre,
                description,
                status,
                date,
                commentaire,
                photo, 
                adresse,
                technicienId: technicienId ? parseInt(technicienId) : null,
                technicienName: assignedTechnician ? assignedTechnician.name : 'Non assigné',
                creatorEmail: currentUser.email,
            };
            setInterventionList([...interventionList, newIntervention]);
            handleBack();
        }
    };

    const handleDelete = () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
            const updatedList = interventionList.filter(item => item.id !== selectedIntervention.id);
            setInterventionList(updatedList);
            handleBack();
        }
    };

    const canEdit = currentUser.role === 'Administrateur' || currentUser.role === 'Gestionnaire';

    const renderForm = () => (
        <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
            <form onSubmit={handleCreateOrUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="titre">Titre</label>
                        <input
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            id="titre"
                            type="text"
                            value={titre}
                            onChange={(e) => setTitre(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">Date</label>
                        <input
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            id="date"
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adresse">Adresse</label>
                    <input
                        className="shadow border rounded w-full py-2 px-3 text-gray-700"
                        id="adresse"
                        type="text"
                        value={adresse}
                        onChange={(e) => setAdresse(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                    <textarea
                        className="shadow border rounded w-full py-2 px-3 text-gray-700"
                        id="description"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
            
                {selectedIntervention && (
                <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="commentaire">Commentaire (après intervention)</label>
                        <textarea
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            id="commentaire"
                            rows="3"
                            value={commentaire}
                            onChange={(e) => setCommentaire(e.target.value)}
                            disabled={!isEditing && currentUser.role !== 'Technicien'}
                        />
                    </div>
                )}
                
                {selectedIntervention && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">Lien Photo (URL)</label>
                        <input
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            id="photo"
                            type="text"
                            value={photo}
                            onChange={(e) => setPhoto(e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedIntervention && (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">Statut</label>
                            <select
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 bg-white"
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Plannifié">Plannifié</option>
                                <option value="En cours">En cours</option>
                                <option value="Terminé">Terminé</option>
                            </select>
                        </div>
                    )}
                    <div className={`mb-6 ${!selectedIntervention ? 'md:col-span-2' : ''}`}>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="technicien">Technicien Assigné</label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 bg-white"
                            id="technicien"
                            value={technicienId || ''}
                            onChange={(e) => setTechnicienId(e.target.value)}
                        >
                            <option value="">Non assigné</option>
                            {technicians.map(tech => (
                                <option key={tech.id} value={tech.id}>
                                    {tech.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                    {selectedIntervention && canEdit && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Supprimer
                        </button>
                    )}
                    <div className="flex space-x-4 ml-auto">
                        {selectedIntervention && isEditing && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                Annuler
                            </button>
                        )}
                        {isEditing ? (
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                Enregistrer
                            </button>
                        ) : (
                            selectedIntervention && canEdit && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                >
                                    Valider
                                </button>
                            )
                        )}
                    </div>
                </div>
            </form>
        </div>
    );

    const renderList = () => (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        {currentUser.role !== 'Technicien' && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technicien</th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {interventionList.map((item) => {
                        const style = getStatusStyle(item.status);
                        return (
                            <tr 
                                key={item.id} 
                                className="hover:bg-gray-50 cursor-pointer" 
                                onClick={() => openDetails(item)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full`}>
                                        <span className={`w-2.5 h-2.5 mr-2 rounded-full ${style.dotColor}`}></span>
                                        {item.status}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.titre}</td>
                                {currentUser.role !== 'Technicien' && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.technicienName || 'Non assigné'}
                                    </td>
                                )}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {selectedIntervention
                        ? isEditing
                            ? "Modifier l'intervention"
                            : `Détails : ${selectedIntervention.titre}`
                        : showCreateForm
                            ? 'Créer une intervention'
                            : 'Interventions'}
                </h2>
                {(!showCreateForm && !selectedIntervention) && (currentUser.role === 'Administrateur' || currentUser.role === 'Gestionnaire') && (
                    <button
                        onClick={openCreateForm}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        Créer
                    </button>
                )}
                {(showCreateForm || selectedIntervention) && (
                    <button
                        onClick={handleBack}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        Retour
                    </button>
                )}
            </div>

            {(showCreateForm || selectedIntervention) ? renderForm() : renderList()}
        </>
    );
};

export default InterventionsManager;