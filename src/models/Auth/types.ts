import { User } from '@models/User';
import { CognitoUser } from 'amazon-cognito-identity-js';
/**
 * Used in store.ts to define the global state
 *
 * @author jordanskomer
 */
export interface AuthState {
  token: string;
  user?: User;
  newPasswordRequired?: boolean;
  userConfirmed?: boolean;
  mfaRequired?: boolean;
}
