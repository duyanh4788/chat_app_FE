import { AuthState } from 'store/auth/shared/slice';
import { ListState } from 'store/list/shared/slice';

export interface RootState {
  auth: AuthState;
  list: ListState;
}
