<template>
  <div>
    <h1>Sign In</h1>
    {{ message }}
    <button class="button is-primary" @click="signin('google')">
      With Google
    </button>
    <button class="button is-primary" @click="signin('facebook')">
      With Facebook
    </button>
    <input v-model="username" placeholder="username">
    <input v-model="password" placeholder="password" type="password">
    <button @click="signin()">Sign In</button>
    <div v-if="newPasswordRequired">
      <input v-model="newPassword" placeholder="new password" type="password">
    <button @click="setNewPassword()">Set New Password</button>
    </div>
    <button @click="$emit('component-change', 'signup')">Sign Up</button>
    <button @click="$emit('component-change', 'forgot-password')">Forgot Password?</button>
  </div>
</template>

<script lang='ts'>
import { Action, namespace } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';
const authModule = namespace('auth');

@Component
export default class Signin extends Vue {
  public username = '';
  public password = '';
  public newPassword = '';
  public newPasswordRequired = false;
  public message = '';
  private userAttributes = {};
  @authModule.Action('signinUser') private signinUser: any;
  @authModule.Action('completeNewPasswordChallenge') private completeNewPasswordChallenge: any;

  public signin(type?: string) {
    this.signinUser({
      username: this.username,
      password: this.password,
      type,
    }).then(() => {
      this.$emit('component-change', 'profile');
    }).catch((error: any) => {
      console.log(error);
      this.message = error.message;
      switch (error.code) {
        case 'UserNotConfirmedException':
          this.$emit('component-change', 'confirm');
          break;
        case 'NewPasswordRequired':
          this.newPasswordRequired = true;
          this.userAttributes = error.data;
          break;
      }
    });
  }

  public setNewPassword() {
    this.completeNewPasswordChallenge({
      username: this.username,
      currentPassword: this.password,
      newPassword: this.newPassword,
      userAttributes: this.userAttributes,
    });
  }
}
</script>