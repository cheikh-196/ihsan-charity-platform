// ===================================
// IHSAN Frontend — API Service
// ===================================

const API_URL = 'http://localhost:3002';

function getHeaders() {
    const token = localStorage.getItem('ihsan_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
}

async function request(method, path, body = null) {
    const options = { method, headers: getHeaders() };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_URL}${path}`, options);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Erreur serveur');
    }
    return data;
}

// Auth
export const authAPI = {
    register: (data) => request('POST', '/auth/register', data),
    login: (data) => request('POST', '/auth/login', data),
    getMe: () => request('GET', '/auth/me'),
};

// Needs
export const needsAPI = {
    getAll: (params = '') => request('GET', `/needs${params ? '?' + params : ''}`),
    getById: (id) => request('GET', `/needs/${id}`),
    create: (data) => request('POST', '/needs', data),
    updateStatus: (id, status) => request('PATCH', `/needs/${id}/status`, { status }),
};

// Donations
export const donationsAPI = {
    create: (data) => request('POST', '/donations', data),
    getById: (id) => request('GET', `/donations/${id}`),
    confirm: (id, data) => {
        // Si data est FormData, on gère différemment
        if (data instanceof FormData) {
            const token = localStorage.getItem('ihsan_token');
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            
            return fetch(`${API_URL}/donations/${id}/confirm`, {
                method: 'POST',
                headers,
                body: data
            }).then(async res => {
                const responseData = await res.json();
                if (!res.ok) {
                    throw new Error(responseData.message || 'Erreur serveur');
                }
                return responseData;
            });
        }
        // Fallback pour l'ancien format
        return request('POST', `/donations/${id}/confirm`, data);
    },
};

// Public
export const publicAPI = {
    getTransactions: () => request('GET', '/public/transactions'),
};
