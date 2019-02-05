import { AuthState } from './types';
import { Module } from 'vuex';
import { RootState } from '@models/RootState';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { User } from '../User';
import { CognitoUser } from 'amazon-cognito-identity-js';

const state: AuthState = {
  token: '',
  user: undefined,
  newPasswordRequired: false,
  mfaRequired: false,
  userConfirmed: true,
};

export const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
