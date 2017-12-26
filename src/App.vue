<template>
  <v-app>
    <odds></odds>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import Odds from './components/Odds.vue'

@Component({
  name: 'app',
  components: { Odds }
})
export default class App extends Vue {}
</script>
