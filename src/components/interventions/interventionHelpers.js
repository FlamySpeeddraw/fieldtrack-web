export const getInitialDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return (new Date(now - offset)).toISOString().substring(0, 16);
};

export const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return getInitialDateTime();
    
    try {
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return getInitialDateTime();
        
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date - offset);
        return localDate.toISOString().substring(0, 16);
    } catch (error) {
        console.error("Erreur format date:", error);
        return getInitialDateTime();
    }
};

export const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleString('fr-FR', options);
};

export const normalizeStatus = (status) => {
    return status?.toLowerCase().trim() || '';
};

export const getStatusStyle = (status) => {
    switch (status) {
        case 'Plannifié':
            return { dotColor: 'bg-orange-500' };
        case 'En cours':
            return { dotColor: 'bg-red-500' };
        case 'Terminé':
            return { dotColor: 'bg-green-500' };
        default:
            return { dotColor: 'bg-gray-500' };
    }
};