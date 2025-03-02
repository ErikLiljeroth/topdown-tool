<!-- /src/components/Strips/Departurestrip.vue-->
<template>
  <div class="strip departure" :class="{ blinking: strip.newAlert }">
    <!-- The right column (spanning 3 rows) -->
    <div class="ack-cell">
      <!-- If not acked, show ACK button. Otherwise, show X button. -->
      <button v-if="!strip.acked" class="ack-btn" @click="acknowledge">ACK</button>
      <button v-else class="remove-btn" @click="promptRemove = true">X</button>
    </div>

    <!-- Removal confirmation overlay, appears when user pressed "X" -->
    <div v-if="promptRemove" class="overlay">
      <div class="overlay-content">
        <p>Delete strip?</p>
        <button @click="removeStrip" class="yes-btn">YES</button>
        <button @click="promptRemove = false" class="no-btn">NO</button>
      </div>
    </div>

    <!-- Row 1, left column -->
    <div class="row1">
      <span class="etd">{{ strip.etd || '----' }}</span>

      <label class="callsign">
        {{ strip.callsign }}<span v-if="!strip.hasFlightPlan">*</span>
      </label>
      <div class="callsign-container">
        <button class="callsign-btn" @click="toggleRouteOverlay">
          {{ strip.callsign }}<span v-if="!strip.hasFlightPlan">*</span>
        </button>
      </div>
      <span class="type">{{ strip.aircraftType }}</span>

      <!-- Runway Badges Container -->
      <div class="runway-badges">
        <RunwayBadge
          v-for="rwy in aerodrome.runways"
          :key="rwy"
          :runway="rwy"
          :metar="fullMetar || ''"
        />
      </div>
    </div>

    <!-- Row 2: Full METAR or fallback -->
    <div class="row2">
      <span class="metar-text">
        <label class="aerodrome-name">
          {{ strip.departureAerodrome }}<span v-if="aerodrome.atcOrAfis === 'AFIS'">*</span>
        </label>
        <span v-if="fullMetar"> {{ fullMetar }} </span>
        <span v-else> --No METAR-- </span>
      </span>
    </div>

    <!-- Row 3: SNOWTAM button + remarks -->
    <div class="row3">
      <!--<span class="tl-label">TL{{ transitionLevel }}</span>-->
      <!-- do not show TL for departures to reduce cluttering-->
      <button class="snowtam-btn" @click="toggleSnowtamOverlay">NOTAM</button>
      <label class="remarks-label">RMK:</label>
      <input class="remarks-field" type="text" :value="localRemarks" @input="onRemarksInput" />
    </div>

    <!-- Flight Route Overlay -->
    <div v-if="showRouteOverlay" class="route-overlay">
      <div class="overlay-content">
        <h4>Route</h4>
        <!-- Display the route string; note that you should have computed it in your store -->
        <p>{{ strip.flightRoute }}</p>
        <button @click="toggleRouteOverlay">Close</button>
      </div>
    </div>

    <!-- Snowtam overlay if open -->
    <div v-if="showSnowtam" class="snowtam-overlay">
      <div class="snowtam-overlay-content">
        <h4>NOTAM for {{ strip.departureAerodrome }}</h4>
        <pre v-if="notamText"
          >{{ notamText }}
        </pre>
        <pre v-else>No NOTAM found for {{ strip.departureAerodrome }}.</pre>

        <button @click="toggleSnowtamOverlay">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTopdownStore } from '@/stores/topdownStore.js'
import RunwayBadge from './RunwayBadge.vue'
import { AERODROMES } from '@/data/swedenAerodromes.js'

const store = useTopdownStore()

const props = defineProps({
  strip: {
    type: Object,
    required: true,
  },
})

// Local states
const promptRemove = ref(false)
const showSnowtam = ref(false)
const notamText = computed(() => {
  const icao = props.strip.departureAerodrome
  return store.notamsByIcao[icao] || ''
})

/**
 * Computed property to fetch the aerodrome information based on the departureAerodrome ICAO.
 */
const aerodrome = computed(() => {
  return AERODROMES.find((aero) => aero.icao === props.strip.departureAerodrome) || {}
})

const localRemarks = ref(props.strip.remarks)

watch(localRemarks, (newVal) => {
  store.updateDepartureRemarks(props.strip.callsign, newVal)
})

/**
 * ACK button => strip is acked => newAlert=false, acked=true
 */
function acknowledge() {
  store.ackDepartureStrip(props.strip.callsign)
}

/**
 * Delete strip
 */
function removeStrip() {
  promptRemove.value = false
  store.removeDepartureStrip(props.strip.callsign)
}

function onRemarksInput(event) {
  localRemarks.value = event.target.value
  store.updateArrivalRemarks(props.strip.callsign, localRemarks.value)
}

const showRouteOverlay = ref(false)
function toggleRouteOverlay() {
  showRouteOverlay.value = !showRouteOverlay.value
}

/**
 * Toggle the (S)NO(W)TAM overlay
 */
function toggleSnowtamOverlay() {
  showSnowtam.value = !showSnowtam.value
}

/**
 * Show the full METAR from store.
 */
const fullMetar = computed(() => {
  const icao = props.strip.departureAerodrome
  const metarObj = store.metarsByIcao[icao] || null
  if (!metarObj) return null
  return metarObj.message ? metarObj.message.slice(7) : '(parsed, no raw)'
})
</script>

<style scoped>
.strip {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 50px;
  grid-template-rows: auto auto auto;
  gap: 2px;
  min-width: 200px;
  border: 2px solid #222;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: #f4f8ff;
  color: #000;
  font-family: sans-serif;
  position: relative;
}

.ack-cell {
  grid-row: 1 / span 3;
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #8f96a0;
}

.row1 {
  grid-row: 1;
  grid-column: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  align-items: center;
  padding: 1px 4px;
  font-size: 0.8rem;
}

.row2 {
  grid-row: 2;
  grid-column: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 1px 4px;
}
.row3 {
  grid-row: 3;
  grid-column: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 1px 4px;
  font-size: 0.8rem;
}

.callsign {
  font-weight: bold;
  font-size: 0.9rem;
}

.callsign-btn {
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  font-weight: bold;
  padding: 0;
}
.route-overlay {
  position: absolute;
  top: 40px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px;
  border-radius: 4px;
  z-index: 1000;
}
.overlay-content h4 {
  margin: 0 0 5px;
}

.has-flight-plan {
  text-decoration: underline;
}

.runway-badges {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
}

.ack-btn {
  width: 40px;
  height: 100%;
  font-weight: bold;
  background-color: #cfc;
  border: 1px solid #999;
  border-radius: 4px;
  cursor: pointer;
}
.ack-btn:hover {
  background-color: #afe;
}

.remove-btn {
  width: 40px;
  height: 100%;
  font-weight: bold;
  background-color: #ccc;
  border: 1px solid #999;
  border-radius: 4px;
  cursor: pointer;
}
.remove-btn:hover {
  background-color: #bbb;
}

.blinking {
  animation: blink 0.3s infinite alternate;
}
@keyframes blink {
  0% {
    background-color: #80abdb;
  }
  100% {
    background-color: #fafafa;
  }
}

.metar-text {
  font-size: 0.8rem;
  font-family: monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.aerodrome-name {
  font-weight: bold;
  font-size: 0.9rem;
  margin-right: 4px;
}

.snowtam-btn {
  background-color: rgb(255, 255, 255);
  border: 1px solid #999;
  border-radius: 4px;
  padding: 1px 3px;
  cursor: pointer;
}
.snowtam-btn:hover {
  background-color: #ddf;
}

.remarks-field {
  flex: 1;
  min-width: 30px;
}

.remarks-label {
  font-size: 0.7rem;
}

.overlay {
  position: absolute;
  top: 5%;
  right: 5%;
  width: 150px;
  padding: 8px;
  background-color: rgba(100, 100, 100, 0.9);
  color: #fff;
  border: 2px solid #333;
  border-radius: 6px;
  z-index: 999;
  font-size: 1rem;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.yes-btn,
.no-btn {
  margin: 6px;
  padding: 2px 30px;
  font-size: 1rem;
  font-weight: bold;
}

.snowtam-overlay-content h4 {
  margin-top: 2px;
  margin-bottom: 2px;
  padding-top: 0;
  padding-bottom: 0;
}

.snowtam-overlay {
  position: absolute;
  top: 130px;
  left: 0px;
  width: 330px;
  min-height: 100px;
  background-color: #fff;
  border: 2px solid #333;
  border-radius: 4px;
  z-index: 998;
  padding: 6px;
  font-size: 0.75rem;
}
.snowtam-overlay-content {
  display: flex;
  flex-direction: column;
}
.snowtam-overlay-content pre {
  background-color: #eee;
  padding: 4px;
  max-height: 250px;
  overflow-y: auto;
}
</style>
