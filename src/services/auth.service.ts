import { request } from '../utils/api';

export const authService = {
    login: (body: any) => request('/login', { method: 'POST', body }),
    register: (body: any) => request('/registration', { method: 'POST', body }),
};
