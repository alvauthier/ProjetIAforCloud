export function getUserIdFromToken() {
    const token = localStorage.getItem('token');

    if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const valuesToken = JSON.parse(window.atob(base64));
        if (valuesToken.userId) {
            return valuesToken.userId;
        } else {
            console.error('Aucun userId trouvé dans le token');
            return null;
        }
    } else {
        console.error('Aucun token trouvé dans le localStorage');
        return null;
    }
}