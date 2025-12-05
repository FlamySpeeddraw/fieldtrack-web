const InterventionForm = ({ 
    titre, setTitre,
    description, setDescription,
    status, setStatus,
    idUtilisateur, setIdUtilisateur,
    date, setDate,
    commentaire,
    photo,
    adresse, setAdresse,
    selectedIntervention,
    technicians,
    canEdit,
    onSubmit,
    onDelete,
}) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="titre">
                            Titre
                        </label>
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                            Date
                        </label>
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adresse">
                        Adresse
                    </label>
                    <input
                        className="shadow border rounded w-full py-2 px-3 text-gray-700"
                        id="adresse"
                        type="text"
                        value={adresse}
                        onChange={(e) => setAdresse(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="commentaire">
                            Commentaire
                        </label>
                        <textarea
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 bg-gray-100"
                            id="commentaire"
                            rows="3"
                            value={commentaire}
                            readOnly
                            disabled
                        />
                    </div>
                )}
                
                {selectedIntervention && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
                            Photo
                        </label>
                        <input
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 bg-gray-100"
                            id="photo"
                            type="text"
                            value={photo}
                            readOnly
                            disabled
                        />
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedIntervention && (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                Statut
                            </label>
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="technicien">
                            Technicien Assigné
                        </label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 bg-white"
                            id="technicien"
                            value={idUtilisateur || ''}
                            onChange={(e) => setIdUtilisateur(e.target.value)}
                        >
                            <option value="">Non assigné</option>
                            {technicians.map(tech => (
                                <option key={tech.id} value={tech.id}>
                                    {tech.mail || tech.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                    {selectedIntervention && canEdit && (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Supprimer
                        </button>
                    )}
                    <div className="flex space-x-4 ml-auto">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            {selectedIntervention ? 'Valider' : 'Enregistrer'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default InterventionForm;