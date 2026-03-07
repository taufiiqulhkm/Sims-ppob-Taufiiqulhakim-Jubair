import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
    email: string;
    first_name: string;
    last_name: string;
    profile_image: string;
}

interface UserState {
    profile: UserProfile | null;
    balance: number | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    profile: null,
    balance: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<UserProfile | null>) => {
            state.profile = action.payload;
        },
        setBalance: (state, action: PayloadAction<number | null>) => {
            state.balance = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearUser: (state) => {
            state.profile = null;
            state.balance = null;
        },
    },
});

export const { setProfile, setBalance, setLoading, setError, clearUser } = userSlice.actions;
export default userSlice.reducer;
