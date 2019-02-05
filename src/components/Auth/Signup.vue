<template>
  <div>
    {{ message }}
    <h1>Sign Up</h1>
    <button class="button is-primary" @click="signup('google')">
      With Google
    </button>
    <button class="button is-primary" @click="signup('facebook')">
      With Facebook
    </button>
    <form @submit="signup">
      <input v-model="form.username" v-bind:class="{'isError': true }" @blur="checkUsername()" placeholder="username">
      <input v-model="form.email" placeholder="email">
      <input v-model="form.phone" placeholder="phone">
      <input v-model="form.password" placeholder="password">
      <input v-bind:disabled="errors.length > 0" type="submit" value="Sign Up">
    </form>
    <button @click="$emit('component-change', 'signin')">Sign In</button>
  </div>
</template>

<script lang='ts'>
import { Action, namespace } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';

const authModule = namespace('auth');

@Component
export default class Signup extends Vue {
  public form = {
    username: '',
    email: '',
    password: '',
    phone: '',
  };
  public errors = [];
  public message = '';
  @authModule.Action('signupUser') private signupUser: any;
  @authModule.Action('doesUserExist') private doesUserExist: any;

  public checkUsername() {
    if (this.form.username) {
      this.doesUserExist(this.form.username).then((userExists: boolean) => {
        console.log('userExists?', userExists);
        if (userExists) {
          this.message = 'Username is taken. Please try a different username'
        }
      });
    }
  }

  public signup(type: string) {
    console.log('sigin via', type);
    this.signupUser(this.form).then((result: any) => {
      console.log('signin');
    }).catch((error: any) => {
      this.message = error.message;
    });
  }
}
</script>