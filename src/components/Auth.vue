<template>
  <div class="o-auth">
      <keep-alive>
        <component :is="authState" v-on:component-change="authState = $event"></component>
      </keep-alive>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import ForgotPassword from './Auth/ForgotPassword.vue';
import Confirm from './Auth/Confirm.vue';
import Signin from './Auth/Signin.vue';
import Signup from './Auth/Signup.vue';
import Profile from './Auth/Profile.vue';
import { Action, Getter, namespace } from 'vuex-class';
const authModule = namespace('auth');

@Component({
  components: {
    Confirm,
    ForgotPassword,
    Signin,
    Signup,
    Profile,
  },
})
export default class Auth extends Vue {
  public authState = 'signin';

  @authModule.Action('retrieveUserFromStorage') private retrieveUserFromStorage: any;
  @authModule.Getter('authed') private authed: any;

  private async created() {
    this.retrieveUserFromStorage().then(() => {
      this.authState = 'profile';
      }).catch((error: any) => {
      this.authState = 'signin';
    });
  }
}
</script>