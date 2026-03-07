import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Service {
    service_code: string;
    service_name: string;
    service_icon: string;
    service_tariff: number;
}

export interface Banner {
    banner_name: string;
    banner_image: string;
    description: string;
}

interface InformationState {
    services: Service[];
    banners: Banner[];
    loading: boolean;
    error: string | null;
}

const initialState: InformationState = {
    services: [],
    banners: [],
    loading: false,
    error: null,
};

const informationSlice = createSlice({
    name: 'information',
    initialState,
    reducers: {
        setServices: (state, action: PayloadAction<Service[]>) => {
            state.services = action.payload;
        },
        setBanners: (state, action: PayloadAction<Banner[]>) => {
            state.banners = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setServices, setBanners, setLoading, setError } = informationSlice.actions;
export default informationSlice.reducer;
