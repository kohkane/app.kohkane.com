<template>
  <div>
    <h1>Profile</h1>
    {{ message }}
    <button class="button is-primary" @click="enable('sms')">
      Enable SMS MFA
    </button>
    <button class="button is-primary" @click="enable('totp')">
      Enable TOTP MFA
    </button>
    <button class="button is-primary" @click="signout()">
      Logout
    </button>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';
const authModule = namespace('auth');
@Component
export default class Confirm extends Vue {
  public message = '';
  @authModule.Action('setMFA') private setMFA: any;
  @authModule.Action('signoutUser') private signoutUser: any;

  public enable(mfaType: string): void {
    this.setMFA(mfaType === 'sms').then(() => {
      this.message = 'Updated MFA';
    }).catch((err: any) => {
      this.message = err.message;
    });
    // $http.post(`/auth/${type}`, {
    //   username: 'test',
    //   password: 'test'
    // }).then((res) => {
    //   this.message = res.data.data.type;
    //   console.log(res);
    // })
  }

  public signout(): void {
    this.signoutUser();
    this.$emit('component-change', 'signin');
  }
}
</script>