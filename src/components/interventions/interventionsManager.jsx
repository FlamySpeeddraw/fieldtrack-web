import { useState, useEffect } from 'react';
import { getInterventions, postIntervention, updateIntervention, deleteIntervention } from '../../services/interventionService';
import InterventionForm from './InterventionForm';
import InterventionList from './InterventionList';
import { getInitialDateTime, formatDateTimeForInput } from './interventionHelpers';

const InterventionsManager = ({ interventionList, setInterventionList, userList, currentUser }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedIntervention, setSelectedIntervention] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Planifié');
    const [idUtilisateur, setIdUtilisateur] = useState('');
    const [date, setDate] = useState(getInitialDateTime());
    const [commentaire, setCommentaire] = useState("");  
    const [photo, setPhoto] = useState(""); 
    const [adresse, setAdresse] = useState("");

    const technicians = userList.filter(user => 
        user.nom_role === 'Technicien' || user.role === 'Technicien'
    );

    const resetForm = () => {
        setTitre('');
        setDescription('');
        setStatus('Planifié');
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
        setTitre(intervention.titre || '');
        setDescription(intervention.description || '');
        setStatus(intervention.status || 'Planifié');
        setIdUtilisateur(intervention.id_utilisateur || '');
        setDate(formatDateTimeForInput(intervention.date_intervention));
        setCommentaire(intervention.commentaire || ""); 
        setPhoto(intervention.photo || ""); 
        setAdresse(intervention.adresse || "");        
        setShowCreateForm(false);
        setIsEditing(true);
    };

    useEffect(() => {
        const loadInterventions = async () => {
            try {
                setIsLoading(true);
                const data = await getInterventions(); 
                setInterventionList(data);
            } catch (error) {
                console.error("Échec du chargement des interventions:", error);
                setInterventionList([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadInterventions();
    }, []); 

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();

        const formattedDate = date.replace('T', ' ') + ':00';

        const itemData = {
            titre, 
            description, 
            status, 
            date_intervention: formattedDate,
            id_utilisateur: idUtilisateur ? parseInt(idUtilisateur) : null,
            commentaire, 
            photo, 
            adresse, 
        };

        try {
            if (selectedIntervention && isEditing) {
                const updatedItem = await updateIntervention(selectedIntervention.id, itemData);
                setInterventionList(prevList => prevList.map(item => 
                    item.id === selectedIntervention.id ? { ...item, ...updatedItem } : item
                ));
            } else {
                const newItem = await postIntervention(itemData);
                setInterventionList(prevList => [...prevList, newItem]);
            }
            handleBack();
        } catch (error) {
            console.error("Erreur:", error);
            alert(`Erreur : ${error.message}`);
        }
    };

    const handleDelete = async () => { 
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
            try {
                await deleteIntervention(selectedIntervention.id);
                setInterventionList(prevList => prevList.filter(item => item.id !== selectedIntervention.id));
                handleBack();
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
                alert(`Erreur lors de la suppression : ${error.message}`);
            }
        }
    };

    const canEdit = currentUser.role === 'Administrateur' || currentUser.role === 'Gestionnaire';

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {selectedIntervention
                        ? "Modifier l'intervention" 
                        : showCreateForm
                            ? 'Créer une intervention'
                            : 'Interventions'}
                </h2>
                {(!showCreateForm && !selectedIntervention) && canEdit && (
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

            {(showCreateForm || selectedIntervention) ? (
                <InterventionForm
                    titre={titre}
                    setTitre={setTitre}
                    description={description}
                    setDescription={setDescription}
                    status={status}
                    setStatus={setStatus}
                    idUtilisateur={idUtilisateur}
                    setIdUtilisateur={setIdUtilisateur}
                    date={date}
                    setDate={setDate}
                    commentaire={commentaire}
                    setCommentaire={setCommentaire}
                    photo={photo}
                    setPhoto={setPhoto}
                    adresse={adresse}
                    setAdresse={setAdresse}
                    selectedIntervention={selectedIntervention}
                    isEditing={isEditing}
                    technicians={technicians}
                    currentUser={currentUser}
                    canEdit={canEdit}
                    onSubmit={handleCreateOrUpdate}
                    onDelete={handleDelete}
                />
            ) : (
                <InterventionList
                    interventionList={interventionList}
                    technicians={technicians}
                    currentUser={currentUser}
                    onSelectIntervention={openDetails}
                    isLoading={isLoading}
                />
            )}
        </>
    );
};

export default InterventionsManager;