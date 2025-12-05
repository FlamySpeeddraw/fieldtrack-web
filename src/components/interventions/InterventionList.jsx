import { useState } from 'react';
import { formatDateForDisplay, getStatusStyle, normalizeStatus } from './interventionHelpers';

const InterventionList = ({ 
    interventionList,
    technicians,
    currentUser,
    onSelectIntervention,
    isLoading 
}) => {
    const [filterStatus, setFilterStatus] = useState('Tous');
    const [filterTechnicianId, setFilterTechnicianId] = useState('Tous');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInterventions = interventionList.filter(item => {
        const statusMatch = filterStatus === 'Tous' || normalizeStatus(item.status) === normalizeStatus(filterStatus);
        const technicianMatch = filterTechnicianId === 'Tous' || item.id_utilisateur === parseInt(filterTechnicianId);
        const searchLower = searchTerm.toLowerCase();
        const searchMatch = !searchTerm || 
            (item.titre || '').toLowerCase().includes(searchLower) ||
            (item.description || '').toLowerCase().includes(searchLower) ||
            (item.adresse || '').toLowerCase().includes(searchLower);
        
        return statusMatch && technicianMatch && searchMatch;
    });

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
                        placeholder="Rechercher..."
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
                                {tech.mail || tech.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Titre
                        </th>
                        {currentUser.role !== 'Technicien' && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Technicien
                            </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
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
                                    onClick={() => onSelectIntervention(item)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full">
                                            <span className={`w-2.5 h-2.5 mr-2 rounded-full ${style.dotColor}`}></span>
                                            {item.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {item.titre || (item.description?.length > 50 
                                            ? item.description.substring(0, 50) + '...' 
                                            : item.description || 'Sans titre')}
                                    </td>
                                    {currentUser.role !== 'Technicien' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {assignedTech ? (assignedTech.mail || assignedTech.name) : 'Non assigné'}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDateForDisplay(item.date_intervention)}
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

export default InterventionList;