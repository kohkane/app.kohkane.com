<template>
  <div class="home">
    <auth></auth>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Auth from '../components/Auth.vue';

@Component({
  components: {
    Auth,
  },
})
export default class extends Vue {}
</script>
