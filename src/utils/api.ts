const BASE_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends RequestInit {
    body?: any;
}

export const request = async (endpoint: string, options: RequestOptions = {}) => {
    const { body, headers, ...customConfig } = options;
    const token = localStorage.getItem('token');

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...defaultHeaders,
            ...headers,
        },
    };

    if (body) {
        config.body = body instanceof FormData ? body : JSON.stringify(body);
        // If it's FormData, let the browser set the Content-Type automatically
        if (body instanceof FormData && config.headers) {
            delete (config.headers as any)['Content-Type'];
        }
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};
