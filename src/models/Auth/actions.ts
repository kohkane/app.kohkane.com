import { ActionTree } from 'vuex';
import { RootState } from '@models/RootState';
import { AuthState } from '@models/Auth/types';
import { User } from '../User';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

interface AWSError {
  code: string;
  name: string;
  message: string;
}

enum AuthedUserMethods {
  signout,
  setMFA,
  getUserDetails,
}

const userPool = new AmazonCognitoIdentity.CognitoUserPool({
  UserPoolId: 'us-east-1_UGRCfUtpC',
  ClientId: '2nhcsld9ruat0jacqdker94c9p',
});

const signout = (user: AmazonCognitoIdentity.CognitoUser) => {
  return new Promise((resolve, reject) => {
    user.globalSignOut({
      onSuccess: () => resolve(true),
      onFailure: (err) => reject(err),
    });
  });
}
/**
 * We must get the session from the current user in the user pool in order to
 * perform actions on behalf of the user. This encapsilates all of the methods
 * we need to run while signed in.
 *
 * @param method - The code to execute
 * @author jordanskomer
 */
const runAsAuthedUser = (): Promise<AmazonCognitoIdentity.CognitoUser> => {
  return new Promise((resolve, reject) => {
    const user = userPool.getCurrentUser();
    if (user) {
      user.getSession((err: Error, session: AmazonCognitoIdentity.CognitoUserSession) => {
        if (err) {
          console.log('runAsAuthedUser', err);
          reject(err);
        }
        console.log('session validity: ' + session.isValid());
        if (!session.isValid()) {
          user.refreshSession(session.getRefreshToken(), (refreshErr, refreshSession) => {
            if (err) {
              console.log('runAsAuthedUser.refreshSession', refreshErr);
              reject(err);
            }
            resolve(user);
          })
        } else {
          resolve(user);
        }
      });
    }
  });
};

const constructCognitioUserAttributes = (payload: any) => {
  const userAttributeList = [];
  if (payload.phone) {
    userAttributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'phone_number',
      Value: `+1${payload.phone.toString().replaceAll('-', '').replaceAll(' ', '')}`,
    }));
  }
  if (payload.email) {
    userAttributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: payload.email,
    }));
  }
  userAttributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
    Name: 'custom:plan',
    Value: payload.plan ? payload.plan : 'free',
  }));
  return userAttributeList;
};

const setupAuthedUser = (commit: any, sessionUser: AmazonCognitoIdentity.CognitoUser) => {
  sessionUser.getUserAttributes((err, results) => {
    commit('setUser', {  results });
  });
}

// Used in signin when we have to prompt user to fix any errors
let attemptedSigninCognitioUser: AmazonCognitoIdentity.CognitoUser;

export const actions: ActionTree<AuthState, RootState> = {
  /**
   * We have to perform a check using the register confirmation and an invalid password
   * to see if the user exists as this method doesn't exist in cognitio yet.
   *
   * @param username - The username to check if it exists
   * @author jordanskomer
   */
  doesUserExist({commit}, username): Promise<any> {
    return new Promise((resolve, reject) => {
      new AmazonCognitoIdentity.CognitoUser({
        Username: username,
        Pool: userPool,
      }).confirmRegistration('000000', false, (err, result) => {
        if (err) {
          // If we get a code mismatch that means the user exists as
          // congitio found a user but the code we passed doesn't match up
          if ((err as AWSError).code === 'CodeMismatchException') {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  },
  confirmUser({commit}, code): any {

  },
  resendConfirmationCode({ commit }): any {

  },
  completeNewPasswordChallenge({ commit }, payload): any {
    attemptedSigninCognitioUser.completeNewPasswordChallenge(
      payload.newPassword,
      payload.userAttributes,
      {
        onSuccess: (result) => {
          setupAuthedUser(commit, attemptedSigninCognitioUser);
        },
        onFailure: (err) => {
          console.log(err);
        },
      },
    );
  },
  signupUser({ commit }, payload): any {
    return new Promise((resolve, reject) => {
      userPool.signUp(
        payload.username,
        payload.password,
        constructCognitioUserAttributes(payload),
        [],
        (err, result: any) => {
          if (err || !result) {
            console.log('signupUser', err);
            reject(err);
          } else {
            commit('setUserConfirmedStatus', result.userConfirmed);
            console.log(result.getAccessToken());
            resolve(result);
          }
        },
      );
    });
  },
  signinUser({ commit }, payload): any {
    return new Promise((resolve, reject) => {
      const authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: payload.username,
        Password: payload.password,
      });
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: payload.username,
        Pool: userPool,
      });
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          console.log(result);
          setupAuthedUser(commit, cognitoUser);
          resolve(true);
        },
        mfaRequired: (codeDeliveryDetails) => {
          console.log(codeDeliveryDetails);
          reject({
            code: 'MFARequired',
            name: 'MFARequired',
            message: 'User must enter MFA to sign in',
          })
        },
        onFailure: (err) => {
          reject(err);
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          // We need to temporarily store this so when the user gives us info
          // we have the user with the session object that was authed above
          attemptedSigninCognitioUser = cognitoUser;
          // API won't accept this in completeNewPasswordChallenge call
          // Returns a 'Cannot modify the non-mutable attribute' error
          delete userAttributes.email_verified;
          delete userAttributes.phone_number_verified;
          reject({
            code: 'NewPasswordRequired',
            name: 'NewPasswordRequired',
            message: 'User must set a new password.',
            data: userAttributes,
          });
        },
      });
    });
  },
  /**
   * Signs out the user and clears all of the tokens
   *
   * @author jordanskomer
   */
  signoutUser({ commit, state }) {
    runAsAuthedUser().then((user) => {
      user.signOut();
    });
  },
  /**
   * Attempts to retrieve the Cognitio user from local storage.
   *
   * @author jordanskomer
   */
  retrieveUserFromStorage({ commit, state }) {
    return new Promise((resolve, reject) => {
      const token = '';
      const response = {};
      const user = userPool.getCurrentUser();
      if (!user) {
        reject({
          code: 'SessionInvalid',
          name: 'SessionInvalid',
          message: 'User was not found in local storage, please authenticate',
        });
      } else {
        user.getSession((err: AWSError, session: AmazonCognitoIdentity.CognitoUserSession) => {
          if (err) {
            reject({
              code: err.code,
              name: err.name,
              message: err.message,
            });
          }
          setupAuthedUser(commit, user);
          resolve(false);
        });
      }
    });
  },
  setMFA({ commit, state }, smsMFA: boolean, enable = true) {
    return new Promise((resolve, reject) => {
      const mfaSettings = {
        PreferredMfa: true,
        Enabled: enable,
      };
      runAsAuthedUser().then((user) => {
        user.setUserMfaPreference(
          {
            PreferredMfa: enable && smsMFA,
            Enabled: enable && smsMFA,
          },
          {
            PreferredMfa: enable && !smsMFA,
            Enabled: enable && !smsMFA,
          },
          (err: any, result: any) => {
            if (err) {
              reject({
                name: err.name,
                message: err.message,
                data: {
                  smsMFA,
                  enable,
                },
              });
            } else {
              resolve(true);
            }
          }
        );
      });
    });
  },
};
