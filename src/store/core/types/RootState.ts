import { AuthState } from 'store/auth/shared/slice';
import { ChatAppState } from 'store/chatApp/shared/slice';

export interface RootState {
  auth: AuthState;
  chatapp: ChatAppState;
}
