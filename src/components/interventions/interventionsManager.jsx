import React, { useState, useEffect } from 'react';
import { getInterventions, getInterventionById, getInterventionByUserId, postIntervention, updateIntervention, deleteIntervention } from '../../services/interventionService';

const getInitialDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return (new Date(now - offset)).toISOString().substring(0, 16);
};

const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return getInitialDateTime(); 
    return dateTimeString.replace(' ', 'T').substring(0, 16);
};

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
    const [isLoading, setIsLoading] = useState(true);

    const [filterStatus, setFilterStatus] = useState('Tous');
    const [filterTechnicianId, setFilterTechnicianId] = useState('Tous');
    const [searchTerm, setSearchTerm] = useState('');

    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Plannifié');
    const [idUtilisateur, setIdUtilisateur] = useState('');
    const [date, setDate] = useState(getInitialDateTime());
    const [commentaire, setCommentaire] = useState("");  
    const [photo, setPhoto] = useState(""); 
    const [adresse, setAdresse] = useState("");

    const technicians = userList.filter(user => user.role === 'Technicien');

    const resetForm = () => {
        setDescription('');
        setStatus('Plannifié');
        setIdUtilisateur('');
        setDate(getInitialDateTime());
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
        setDescription(intervention.description);
        setStatus(intervention.status);
        setIdUtilisateur(intervention.id_utilisateur || '');
        setDate(formatDateTimeForInput(intervention.date_intervention || intervention.date));
        setCommentaire(intervention.commentaire || ""); 
        setPhoto(intervention.photo || ""); 
        setAdresse(intervention.adresse || "");        
        setShowCreateForm(false);
        setIsEditing(false);
    };

    useEffect(() => {
        const loadInterventions = async () => {
            try {
                setIsLoading(true);
                const data = await getInterventions(); 
                setInterventionList(data);
                
            } catch (error) {
                console.error("Échec du chargement des interventions depuis l'API :", error);
                setInterventionList([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadInterventions();
        
    }, [setInterventionList]); 

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();

        const itemData = {
            description: description, 
            status: status, 
            date_intervention: date, 
            id_utilisateur: idUtilisateur ? parseInt(idUtilisateur) : currentUser.id, 
            commentaire: commentaire, 
            photo: photo, 
            adresse: adresse, 
        }

        if (selectedIntervention && isEditing) {
            try {
                const updatedItem = await updateIntervention(selectedIntervention.id, itemData); 
                
                setInterventionList(prevList => prevList.map(item => 
                    item.id === selectedIntervention.id ? { ...item, ...updatedItem } : item
                ));

            } catch (error) {
                console.error("Échec de la mise à jour de l'intervention:", error);
                alert(`Erreur lors de la mise à jour : ${error.message}`);
            }
        } else {
            try {
                const newItem = await postIntervention(itemData); 
                setInterventionList(prevList => [...prevList, newItem]);

            } catch (error) {
                console.error("Échec de la création de l'intervention:", error);
                alert(`Erreur lors de la création : ${error.message}`);
            }
        }
        
        handleBack();
    };

    const handleDelete = async () => { 
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
            try {
                await deleteIntervention(selectedIntervention.id); 
                const updatedList = interventionList.filter(item => item.id !== selectedIntervention.id);
                setInterventionList(updatedList);
                handleBack();

            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
                alert(`Erreur lors de la suppression : ${error.message}`);
            }
        }
    };

    const canEdit = currentUser.role === 'Administrateur' || currentUser.role === 'Gestionnaire';

    const renderForm = () => (
        <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
            <form onSubmit={handleCreateOrUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                    <textarea
                        className="shadow border rounded w-full py-2 px-3 text-gray-700"
                        id="description"
                        rows="4"
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
                            value={idUtilisateur || ''}
                            onChange={(e) => setIdUtilisateur(e.target.value)}
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

    const filteredInterventions = interventionList.filter(item => {
        const statusMatch = filterStatus === 'Tous' || item.status === filterStatus;
        const technicianMatch = filterTechnicianId === 'Tous' || item.id_utilisateur === parseInt(filterTechnicianId);
        const descriptionMatch = (item.description || "").toLowerCase().includes(searchTerm.toLowerCase()); 
        return statusMatch && technicianMatch && descriptionMatch;
    });

    const renderList = () => {
        if (isLoading) {
            return (
                <div className="text-center py-10 text-lg text-blue-600">
                    Chargement des interventions... 
                </div>
            );
        }

        return (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b flex flex-wrap gap-4">
                    <div className="w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Rechercher par description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="shadow-sm border rounded w-full py-1.5 px-3 text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
                            Filtrer par statut:
                        </label>
                        <select
                            id="statusFilter"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="shadow-sm border rounded py-1 px-3 text-sm text-gray-700 bg-white focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Tous">Tous</option>
                            <option value="Plannifié">Plannifié</option>
                            <option value="En cours">En cours</option>
                            <option value="Terminé">Terminé</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="technicianFilter" className="text-sm font-medium text-gray-700">
                            Filtrer par technicien:
                        </label>
                        <select
                            id="technicianFilter"
                            value={filterTechnicianId}
                            onChange={(e) => setFilterTechnicianId(e.target.value)}
                            className="shadow-sm border rounded py-1 px-3 text-sm text-gray-700 bg-white focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Tous">Tous</option>
                            {technicians.map(tech => (
                                <option key={tech.id} value={tech.id}>
                                    {tech.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            {currentUser.role !== 'Technicien' && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technicien</th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredInterventions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    Aucune intervention trouvée
                                </td>
                            </tr>
                        ) : (
                            filteredInterventions.map((item) => {
                                const style = getStatusStyle(item.status);
                                const assignedTech = technicians.find(t => t.id === item.id_utilisateur);
                                
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
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {item.description?.length > 50 
                                                ? item.description.substring(0, 50) + '...' 
                                                : item.description}
                                        </td>
                                        {currentUser.role !== 'Technicien' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {assignedTech ? assignedTech.name : 'Non assigné'}
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.date_intervention || item.date}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {selectedIntervention
                        ? isEditing
                            ? "Modifier l'intervention"
                            : "Détails de l'intervention"
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