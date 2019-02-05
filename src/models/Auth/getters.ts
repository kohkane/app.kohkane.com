import { GetterTree } from 'vuex';
import { RootState } from '@models/RootState';
import { AuthState } from '@models/Auth/types';
import { User } from '../User';

export const getters: GetterTree<AuthState, RootState> = {
  user(state) {
    return state.user ? state.user : undefined;
  },
  /**
   * Returns if the user is signed in or not. We know they are
   * if they have a valid user object and cognitio user associated
   * in state
   *
   * @author jordanskomer
   */
  authed(state): boolean {
    return state.user !== undefined;
  },
};
