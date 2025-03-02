<!-- src/components/Strips/ArrivalStrip.vue -->
<template>
  <div class="strip arrival" :class="{ blinking: strip.newAlert }">
    <div class="ack-cell">
      <!-- If not acked, show ACK button. Otherwise, show X button. -->
      <button v-if="!strip.acked" class="ack-btn" @click="acknowledge">ACK</button>
      <button v-else class="remove-btn" @click="promptRemove = true">X</button>
    </div>

    <!-- Strip deletion confirmation overlay -->
    <div v-if="promptRemove" class="overlay">
      <div class="overlay-content">
        <p>Delete strip?</p>
        <button @click="removeStrip" class="yes-btn">YES</button>
        <button @click="promptRemove = false" class="no-btn">NO</button>
      </div>
    </div>

    <!-- Row 1: ETA, callsign, aircraft type, flight plan indicator, runway badges -->
    <div class="row1">
      <span class="eta">{{ strip.eta || 'eta' }}</span>
      <div class="callsign-container">
        <button class="callsign-btn" @click="toggleRouteOverlay">
          {{ strip.callsign }}<span v-if="!strip.hasFlightPlan">*</span>
        </button>
      </div>
      <span class="type">{{ strip.aircraftType }}</span>

      <div class="runway-badges">
        <RunwayBadge
          v-for="rwy in aerodrome.runways"
          :key="rwy"
          :runway="rwy"
          :metar="fullMetar || ''"
        />
      </div>
    </div>

    <!-- Row 2: Full METAR text -->
    <div class="row2">
      <span class="metar-text">
        <label class="aerodrome-name">
          {{ strip.arrivalAerodrome }}<span v-if="aerodrome.atcOrAfis === 'AFIS'">*</span>
        </label>
        <span v-if="fullMetar"> {{ fullMetar }} </span>
        <span v-else> --No METAR-- </span>
      </span>
    </div>

    <!-- Row 3: Transition Level display, NOTAM button, and remarks field -->
    <div class="row3">
      <span class="tl-label">TL{{ transitionLevel }}</span>
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

    <!-- NOTAM overlay -->
    <div v-if="showSnowtam" class="snowtam-overlay">
      <div class="snowtam-overlay-content">
        <h4>NOTAM for {{ strip.arrivalAerodrome }}</h4>
        <pre v-if="notamText">{{ notamText }}</pre>
        <pre v-else>No NOTAM found for {{ strip.arrivalAerodrome }}.</pre>
        <button @click="toggleSnowtamOverlay">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

// Local state for removal confirmation and NOTAM overlay
const promptRemove = ref(false)
const showSnowtam = ref(false)

// Use the arrival aerodrome for NOTAM lookup
const notamText = computed(() => {
  const icao = props.strip.arrivalAerodrome
  return store.notamsByIcao[icao] || ''
})

// Get the aerodrome information for the arrival aerodrome
const aerodrome = computed(() => {
  return AERODROMES.find((aero) => aero.icao === props.strip.arrivalAerodrome) || {}
})

const localRemarks = ref(props.strip.remarks)

function onRemarksInput(event) {
  localRemarks.value = event.target.value
  store.updateArrivalRemarks(props.strip.callsign, localRemarks.value)
}

// ACK function
function acknowledge() {
  store.ackArrivalStrip(props.strip.callsign)
}

// Delete strip
function removeStrip() {
  promptRemove.value = false
  store.removeArrivalStrip(props.strip.callsign)
}

const showRouteOverlay = ref(false)
function toggleRouteOverlay() {
  showRouteOverlay.value = !showRouteOverlay.value
}

// Toggle the NOTAM overlay
function toggleSnowtamOverlay() {
  showSnowtam.value = !showSnowtam.value
}

// Full METAR text for the arrival aerodrome
const fullMetar = computed(() => {
  const icao = props.strip.arrivalAerodrome
  const metarObj = store.metarsByIcao[icao] || null
  if (!metarObj) return null
  return metarObj.message ? metarObj.message.slice(7) : '(parsed, no raw)'
})

// Computed transition level (TL)
const transitionLevel = computed(() => {
  if (!fullMetar.value) return '--'

  // Extract QNH from the METAR (look for "Q" followed by 3 or 4 digits)
  const match = fullMetar.value.match(/\bQ(\d{3,4})\b/)
  if (!match) return '--'
  const qnh = parseInt(match[1], 10)
  if (isNaN(qnh)) return '--'

  // Get the local transition altitude from the aerodrome data
  // (Expected values: 5000, 6000, or 9000; default to 5000 if undefined)
  const ta = aerodrome.value.transitionAltitude || 5000

  // Lookup table for TL determination:
  // Each row is defined by a QNH range and the corresponding TL (in flight level units) for each TA.
  const table = [
    { min: 1051, max: Infinity, tl: { 5000: 50, 6000: 60, 9000: 90 } },
    { min: 1032, max: 1050, tl: { 5000: 55, 6000: 65, 9000: 95 } },
    { min: 1014, max: 1031, tl: { 5000: 60, 6000: 70, 9000: 100 } },
    { min: 996, max: 1013, tl: { 5000: 65, 6000: 75, 9000: 105 } },
    { min: 978, max: 995, tl: { 5000: 70, 6000: 80, 9000: 110 } },
    { min: 960, max: 977, tl: { 5000: 75, 6000: 85, 9000: 115 } },
    { min: 943, max: 959, tl: { 5000: 80, 6000: 90, 9000: 120 } },
    { min: -Infinity, max: 942, tl: { 5000: 85, 6000: 95, 9000: 125 } },
  ]

  // Find the row matching the current QNH
  const row = table.find((r) => qnh >= r.min && qnh <= r.max)
  if (!row) return '--'

  // Use the TA as key – if it isn’t one of the expected ones, default to the 5000 column.
  const key = [5000, 6000, 9000].includes(ta) ? ta : 5000
  return row.tl[key]
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
  background-color: #fdfde8;
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
  font-size: 0.75rem;
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
    background-color: #d6b220;
  }
  100% {
    background-color: #ffffe0;
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
  background-color: rgb(250, 232, 133);
}

.remarks-field {
  flex: 1;
  min-width: 30px;
}

.tl-label {
  font-size: 0.8rem;
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
