<template>
  <div class="strip arrival" :class="{ blinking: strip.newAlert }" ref="stripRef">
    <div class="ack-cell">
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

    <!-- Row 1: ETA, callsign, aircraft type, flight plan indicator, last route point, runway badges -->
    <div class="row1">
      <span class="eta">{{ strip.eta || 'eta' }}</span>
      <div class="callsign-container">
        <button
          class="callsign-btn"
          @mouseover="onCallsignMouseOver"
          @mouseleave="onCallsignMouseLeave"
          @click="onCallsignClick"
        >
          {{ strip.callsign }}<span v-if="!strip.hasFlightPlan">*</span>
        </button>
        <!-- Route overlay shows on hover or when locked open -->
        <div v-if="showRouteOverlay" class="route-overlay">
          <p>{{ strip.flightRoute }}</p>
        </div>
      </div>
      <span class="type">{{ strip.aircraftType }}</span>

      <!-- New element: Display the last route point (if available) -->
      <span class="route-point" v-if="lastRoutePoint">{{ lastRoutePoint }}</span>

      <div class="runway-badges">
        <RunwayBadge
          v-for="rwy in aerodrome.runways"
          :key="rwy"
          :runway="rwy"
          :metar="fullMetar || ''"
          :preferred="aerodrome.prfArrRWY && aerodrome.prfArrRWY.includes(rwy)"
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
import { ref, computed, onBeforeUnmount } from 'vue'
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

const notamText = computed(() => {
  const icao = props.strip.arrivalAerodrome
  return store.notamsByIcao[icao] || ''
})

const aerodrome = computed(() => {
  return AERODROMES.find((aero) => aero.icao === props.strip.arrivalAerodrome) || {}
})

const localRemarks = ref(props.strip.remarks)
function onRemarksInput(event) {
  localRemarks.value = event.target.value
  store.updateArrivalRemarks(props.strip.callsign, localRemarks.value)
}

function acknowledge() {
  store.ackArrivalStrip(props.strip.callsign)
}

function removeStrip() {
  promptRemove.value = false
  store.removeArrivalStrip(props.strip.callsign)
}

// Route overlay logic
const showRouteOverlay = ref(false)
const overlayLocked = ref(false)
const stripRef = ref(null)

function onCallsignMouseOver() {
  if (!overlayLocked.value) {
    showRouteOverlay.value = true
  }
}

function onCallsignMouseLeave() {
  if (!overlayLocked.value) {
    showRouteOverlay.value = false
  }
}

function onCallsignClick(event) {
  if (!overlayLocked.value) {
    overlayLocked.value = true
    showRouteOverlay.value = true
    document.addEventListener('click', handleClickOutside)
    event.stopPropagation() // Prevent the click from immediately triggering the outside handler
  }
}

function handleClickOutside(event) {
  if (stripRef.value && !stripRef.value.contains(event.target)) {
    overlayLocked.value = false
    showRouteOverlay.value = false
    document.removeEventListener('click', handleClickOutside)
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Full METAR text for the arrival aerodrome
const fullMetar = computed(() => {
  const icao = props.strip.arrivalAerodrome
  const metarObj = store.metarsByIcao[icao] || null
  if (!metarObj) return null
  return metarObj.message ? metarObj.message.slice(7) : '(parsed, no raw)'
})

const transitionLevel = computed(() => {
  if (!fullMetar.value) return '--'
  const match = fullMetar.value.match(/\bQ(\d{3,4})\b/)
  if (!match) return '--'
  const qnh = parseInt(match[1], 10)
  if (isNaN(qnh)) return '--'
  const ta = aerodrome.value.transitionAltitude || 5000
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
  const row = table.find((r) => qnh >= r.min && qnh <= r.max)
  if (!row) return '--'
  const key = [5000, 6000, 9000].includes(ta) ? ta : 5000
  return row.tl[key]
})

// Computed property to extract the last route point from the flight route
const lastRoutePoint = computed(() => {
  if (!props.strip.flightRoute) return ''
  // Split the route into words (by whitespace)
  const words = props.strip.flightRoute.trim().split(/\s+/)
  // Iterate backwards to find the first word that has 3 or 5 characters
  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i]
    if (word.length === 3 || word.length === 5) {
      return word
    }
  }
  return ''
})

function toggleSnowtamOverlay() {
  showSnowtam.value = !showSnowtam.value
}
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

.callsign-container {
  position: relative;
  display: inline-block;
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
  bottom: 100%;
  left: 50%;
  transform: translateX(-0%);
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 4px;
  white-space: normal;
  z-index: 1000;
  margin-bottom: 4px;
  min-width: 256px;
  max-width: 90vw;
  text-align: center;
}

/* New styling for the last route point */
.route-point {
  font-size: 0.8rem;
  color: #000;
  margin: 0 4px;
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
