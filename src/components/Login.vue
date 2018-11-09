<template>
  <div class="home">
    <a @click="login('google')">Google Sign In</a>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component('login', {
  methods: {
    /**
     * Communicates with the backend api to
     * login the user using the following types
     * google
     * facebook
     * default
     *
     * @param type - The type of login to auth with
     */
    login: function(type: string) {
      console.log(type);
    }
  }
})
export default class Home extends Vue {}
</script>
