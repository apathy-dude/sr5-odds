<template>
  <div>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs6 sm2 offset-sm8>
            <v-text-field
              label="Dice"
              type="number"
              v-model="dice"
            ></v-text-field>
          </v-flex>
          <v-flex xs6 sm2>
            <v-text-field
              label="Edge"
              type="number"
              v-model="edge"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>

    <v-layout row>
      <v-flex xs12>
        <odd-table :min="min" :max="max" :rollSum="rollSum" :preSum="preSum" :postSum="postSum"></odd-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import { PostEdge, PreEdge, Roll } from '../services/oddsService'
import OddTable from './OddTable.vue'

@Component({
  name: 'odds',
  components: { OddTable }
})
export default class Odds extends Vue {
  public filter: number = 0.01

  private e: number = 3
  private d: number = 12

  get dice(): number {
    return this.d
  }
  set dice(value: number) {
    if (typeof(value) === 'number') {
      this.d = value
      return
    }

    if (value === '') {
      this.d = 0
      return
    }

    this.d = parseInt(value, 10)
  }

  get edge(): number {
    return this.e
  }
  set edge(value: number) {
    if (typeof(value) === 'number') {
      this.e = value
      return
    }

    if (value === '') {
      this.e = 0
      return
    }

    this.e = parseInt(value, 10)
  }

  public created() {
    this.dice = 12
  }

  get min(): number {
    const roll: number[] = Roll(this.dice)
    for (let i = 0; i < roll.length; i++)
      if (roll[i] > this.filter)
        return i
    return 0
  }

  get max(): number {
    const pre: number[] = PreEdge(this.dice + this.edge)
    const post: number[] = PostEdge(this.dice)
    let preSum = 0
    let postSum = 0

    for (let i = pre.length - 1; i > 0; i--) {
      preSum += pre[i] || 0
      postSum += post[i] || 0

      if (preSum > this.filter || postSum > this.filter)
        return i
    }

    return pre.length
  }

  get rollSum(): number[] {
    const roll: number[] = Roll(this.dice)
    const rollSum: number[] = [1]
    for (let i = 1; i < roll.length; i++)
      rollSum[i] = rollSum[i - 1] - roll[i - 1]

    return rollSum
  }

  get preSum(): number[] {
    const roll: number[] =  PreEdge(this.dice + this.edge)
    const rollSum: number[] = [1]
    for (let i = 1; i < roll.length; i++)
      rollSum[i] = rollSum[i - 1] - roll[i - 1]

    return rollSum
  }

  get postSum(): number[] {
    const roll: number[] = PostEdge(this.dice)
    const rollSum: number[] = [1]
    for (let i = 1; i < roll.length; i++)
      rollSum[i] = rollSum[i - 1] - roll[i - 1]

    return rollSum
  }
}
</script>
