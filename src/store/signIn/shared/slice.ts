import { ChatAppState } from './chatApp.reducer';

export interface ChattAppState {
  error?: any | null;
  success: any;
  loading: boolean;
}

export const initialState: ChattAppState = {
    loading: false,
    error: null,
    success: {},
};

// const serviceChatApp = 
