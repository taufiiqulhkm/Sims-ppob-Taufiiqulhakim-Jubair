import { request } from '../utils/api';

export const informationService = {
    getServices: () => request('/services'),
    getBanners: () => request('/banner'),
};
