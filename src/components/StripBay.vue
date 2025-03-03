<template>
  <div class="strip-bay">
    <div class="column departures">
      <div class="column-header">DEP</div>
      <draggable
        v-model="departureStrips"
        tag="div"
        class="column-body"
        :options="{
          group: 'departure',
          animation: 300,
          forceFallback: true,
          fallbackClass: 'sortable-fallback',
          ghostClass: 'sortable-ghost',
        }"
        :itemKey="'callsign'"
      >
        <template #item="{ element }">
          <DepartureStrip :strip="element" :key="element.callsign" />
        </template>
      </draggable>
    </div>

    <div class="column arrivals">
      <div class="column-header">ARR</div>
      <draggable
        v-model="arrivalStrips"
        tag="div"
        class="column-body"
        :options="{
          group: 'arrival',
          animation: 300,
          forceFallback: true,
          fallbackClass: 'sortable-fallback',
          ghostClass: 'sortable-ghost',
        }"
        :itemKey="'callsign'"
      >
        <template #item="{ element }">
          <ArrivalStrip :strip="element" :key="element.callsign" />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTopdownStore } from '@/stores/topdownStore.js'
import draggable from 'vuedraggable'
import ArrivalStrip from '@/components/Strips/ArrivalStrip.vue'
import DepartureStrip from '@/components/Strips/DepartureStrip.vue'

const store = useTopdownStore()

const departureStrips = computed({
  get: () => store.departureStrips,
  set: (val) => (store.departureStrips = val),
})

const arrivalStrips = computed({
  get: () => store.arrivalStrips,
  set: (val) => (store.arrivalStrips = val),
})
</script>

<style scoped>
.strip-bay {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  gap: 1rem 0;
}

.column {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
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
  border: 2px solid #333;
  border-top: none;
  border-radius: 0 0 4px 4px;
  padding: 0.5rem 0.1rem;
}

.departures .column-body {
  background-color: #9fc5f3;
}

.arrivals .column-body {
  background-color: #f0d598;
}

/* This class is applied to the placeholder element */
.sortable-ghost {
  opacity: 0;
}

/* The fallback class styles the dragged element to stand out */
.sortable-fallback {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition:
    transform 300ms ease,
    box-shadow 300ms ease;
}
</style>
