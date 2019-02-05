<template>
  <div>
    <h1>Confirm Your Account</h1>
    {{ message }}
    <button class="button is-primary" @click="onClick('google')">
      Google
    </button>
    <button class="button is-primary" @click="onClick('facebook')">
      Facebook
    </button>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Confirm extends Vue {
  public message = '';

  public onClick(type: string) {
    // $http.post(`/auth/${type}`, {
    //   username: 'test',
    //   password: 'test'
    // }).then((res) => {
    //   this.message = res.data.data.type;
    //   console.log(res);
    // })
  }
}
</script>