import { request } from '../utils/api';

export const userService = {
    getProfile: () => request('/profile'),
    getBalance: () => request('/balance'),
    updateProfile: (body: any) => request('/profile/update', { method: 'PUT', body }),
    updateImage: (formData: FormData) => request('/profile/image', { method: 'PUT', body: formData }),
    topUp: (amount: number) => request('/topup', { method: 'POST', body: { top_up_amount: amount } }),
    transaction: (serviceCode: string) => request('/transaction', { method: 'POST', body: { service_code: serviceCode } }),
    getTransactionHistory: (offset: number = 0, limit: number = 5) => request(`/transaction/history?offset=${offset}&limit=${limit}`),
};
