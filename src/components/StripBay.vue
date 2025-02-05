<!-- src/components/StripBay.vue -->
<template>
  <div class="strip-bay">
    <div class="column departures">
      <div class="column-header">DEP</div>
      <div class="column-body">
        <DepartureStrip v-for="dep in departureStrips" :key="dep.callsign" :strip="dep" />
      </div>
    </div>

    <div class="column arrivals">
      <div class="column-header">ARR</div>
      <div class="column-body">
        <ArrivalStrip v-for="arr in arrivalStrips" :key="arr.callsign" :strip="arr" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTopdownStore } from '@/stores/topdownStore.js'
import ArrivalStrip from '@/components/Strips/ArrivalStrip.vue'
import DepartureStrip from '@/components/Strips/DepartureStrip.vue'

const store = useTopdownStore()
const departureStrips = computed(() => store.departureStrips)
const arrivalStrips = computed(() => store.arrivalStrips)
</script>

<style scoped>
.strip-bay {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  gap: 1rem 0rem;
}

/* Each column: let it flex so ARR and DEP share space */
.column {
  display: flex;
  flex-direction: column;
  flex: 1 1 0; /* Grow/shrink equally, no fixed width */
  min-width: 250px;
}

.column-header {
  background-color: #333;
  color: #fff;
  padding: 0.5rem;
  text-align: center;
  font-size: 1rem;
  margin-bottom: 0;
  border-radius: 4px 4px 0 0;
}

.column-body {
  background-color: #9fc5f3; /* for departures */
  border: 2px solid #333;
  border-top: none;
  border-radius: 0 0 4px 4px;
  padding: 0.5rem 0.1rem;
}

.arrivals .column-body {
  background-color: #f0d598; /* For arrivals */
}
</style>
