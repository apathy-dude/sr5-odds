<template>
  <v-layout row wrap>
    <v-flex xs3>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="text-xs-center">Hits</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-for="h in hitCount" :key="h">
          <v-list-tile-title class="text-xs-center" v-text="h + min"></v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-flex>
    <v-flex xs3>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="text-xs-center">None</v-list-tile-title>
        </v-list-tile>
        <v-list-tile :class="rangeColor(rollSum[h + min])" v-for="h in hitCount" :key="h">
          <v-list-tile-title class="text-xs-center">{{ rollSum[h + min] | percent }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-flex>
    <v-flex xs3>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="text-xs-center">Pre</v-list-tile-title>
        </v-list-tile>
        <v-list-tile :class="rangeColor(preSum[h + min])" v-for="h in hitCount" :key="h">
          <v-list-tile-title class="text-xs-center">{{ preSum[h + min] | percent }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-flex>
    <v-flex xs3>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="text-xs-center">Post</v-list-tile-title>
        </v-list-tile>
        <v-list-tile :class="rangeColor(postSum[h + min])" v-for="h in hitCount" :key="h">
          <v-list-tile-title class="text-xs-center">{{ postSum[h + min] | percent }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'odd-table',
  filters: {
    percent: (value: number) => {
      if (typeof(value) === 'number' && !isNaN(value)) {
        value *= 100
        return value.toFixed(1) + '%'
      }

      return '-'
    }
  }
})
export default class OddTable extends Vue {
  @Prop() public min: number
  @Prop() public max: number

  @Prop() public rollSum: number[]
  @Prop() public postSum: number[]
  @Prop() public preSum: number[]

  get hitCount() {
    return this.max - this.min + 1
  }

  public rangeColor(percent: number): { [key: string]: boolean } {
    if (percent > 0.65) {
      const level = Math.floor((percent - 0.9) / 0.05)
      if (level > 0)
        return { blue: true, [`darken-${level}`]: true }

      if (level === 0)
        return { blue: true }

      return { blue: true, [`lighten${level}`]: true }
    }

    if (percent < 0.35) {
      const level = Math.floor((percent - 0.05) / .05)
      if (level > 0)
        return { red: true, [`lighten-${level}`]: true }

      if (level === 0)
        return { red: true}

      return { red: true, [`darken${level}`]: true }
    }

    return {}
  }
}
</script>
