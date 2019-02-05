import { MutationTree } from 'vuex';
import { AuthState } from '@models/Auth/types';
import { User } from '../User';
import { CognitoUser } from 'amazon-cognito-identity-js';

export const mutations: MutationTree<AuthState> = {
  setAuthStatus(state, token) {
    state.token = token;
  },
  setUser(state, payload) {
    console.log('setUser', payload);
    state.user = new User(payload.cognitoUser);
  },
  setUserConfirmedStatus(state, payload) {
    state.userConfirmed = payload;
  },
};
