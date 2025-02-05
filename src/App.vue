<!-- src/App.vue-->
<template>
  <div class="app-container">
    <!-- Top Bar: Title, position select and overlay buttons -->
    <div class="top-bar">
      <h1 class="app-title">TopDown Tool</h1>

      <select v-model="store.userPosition" @change="toggleDropdown">
        <option disabled value="">-- Select your position --</option>
        <optgroup label="ESMM Positions">
          <option value="ESMM_2_CTR">ESMM_2_CTR</option>
          <option value="ESMM_3_CTR">ESMM_3_CTR</option>
          <option value="ESMM_4_CTR">ESMM_4_CTR</option>
          <option value="ESMM_5_CTR">ESMM_5_CTR</option>
          <option value="ESMM_6_CTR">ESMM_6_CTR</option>
          <option value="ESMM_7_CTR">ESMM_7_CTR</option>
          <option value="ESMM_8_CTR">ESMM_8_CTR</option>
          <option value="ESMM_9_CTR">ESMM_9_CTR</option>
          <option value="ESMS_APP">ESMS_APP</option>
          <option value="ESMM_K_CTR">ESMM_K_CTR</option>
          <option value="ESMM_W_CTR">ESMM_W_CTR</option>
          <option value="ESMM_Y_CTR">ESMM_Y_CTR</option>
        </optgroup>
        <optgroup label="ESOS Positions">
          <option value="ESOS_1_CTR">ESOS_1_CTR</option>
          <option value="ESOS_2_CTR">ESOS_2_CTR</option>
          <option value="ESOS_3_CTR">ESOS_3_CTR</option>
          <option value="ESOS_4_CTR">ESOS_4_CTR</option>
          <option value="ESOS_6_CTR">ESOS_6_CTR</option>
          <option value="ESOS_7_CTR">ESOS_7_CTR</option>
          <option value="ESOS_8_CTR">ESOS_8_CTR</option>
          <option value="ESOS_N_CTR">ESOS_N_CTR</option>
          <option value="ESOS_F_CTR">ESOS_F_CTR</option>
          <option value="ESOS_K_CTR">ESOS_K_CTR</option>
        </optgroup>
      </select>

      <button class="overlay-btn" @click="toggleCoverageOverlay">Covered AD</button>
      <button class="overlay-btn" @click="toggleOmittedOverlay">Ignored AD</button>
      <button class="overlay-btn" @click="toggleDeletedOverlay">Deleted Strips</button>
    </div>

    <!-- Overlays -->

    <!-- Covered Aerodromes Overlay -->
    <div v-if="showCoverage" class="overlay-container" @click="toggleCoverageOverlay">
      <div class="overlay-window compact" @click.stop>
        <h2>Covered Aerodromes</h2>
        <div class="aerodrome-grid">
          <span
            v-for="item in coverageList"
            :key="item.icao"
            class="aerodrome-badge"
            :class="{
              'aerodrome-badge-other': item.controllingSector,
              'aerodrome-badge-ignored': item.isOmitted,
              'aerodrome-badge-active': item.willGenerateStrips,
            }"
          >
            <template v-if="!item.controllingSector">
              {{ item.icao }}
            </template>
            <template v-else> {{ item.icao }}({{ item.controllingSector }}) </template>
          </span>
        </div>
        <button @click="toggleCoverageOverlay">Close</button>
      </div>
    </div>

    <!-- Omitted/ignored Airports Overlay -->
    <div v-if="showOmitted" class="overlay-container" @click="toggleOmittedOverlay">
      <div class="overlay-window" @click.stop>
        <h2>Ignored Aerodromes</h2>
        <div class="omitted-input">
          <input v-model="newOmittedIcao" placeholder="Enter ICAO" />
          <button @click="addNewOmitted">Add</button>
        </div>
        <ul class="omitted-list">
          <li v-for="airport in sortedOmitted" :key="airport">
            {{ airport }}
            <button @click="store.removeOmittedAirport(airport)">Remove</button>
          </li>
        </ul>
        <button @click="toggleOmittedOverlay">Close</button>
      </div>
    </div>

    <!-- Deleted Strips Overlay -->
    <div v-if="showDeleted" class="overlay-container" @click="toggleDeletedOverlay">
      <div class="overlay-window" @click.stop>
        <h2>Deleted Strips</h2>
        <ul class="deleted-list">
          <li v-for="callsign in sortedIgnored" :key="callsign">
            {{ callsign }}
            <button @click="restoreStrip(callsign)">Restore</button>
          </li>
        </ul>
        <button @click="toggleDeletedOverlay">Close</button>
      </div>
    </div>

    <!-- Strip Bay Container -->
    <div class="strip-bay-container">
      <StripBay />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTopdownStore } from '@/stores/topdownStore.js'
import StripBay from '@/components/StripBay.vue'
import { AERODROMES } from '@/data/swedenAerodromes.js'
import { POSITIONS } from '/home/erik/topdowntool/src/data/swedenPositions.js'

const store = useTopdownStore()

// Overlay toggles
const showCoverage = ref(false)
const showOmitted = ref(false)
const showDeleted = ref(false)

function toggleCoverageOverlay() {
  showCoverage.value = !showCoverage.value
}

function toggleOmittedOverlay() {
  showOmitted.value = !showOmitted.value
}

function toggleDeletedOverlay() {
  showDeleted.value = !showDeleted.value
}

// Create list of aerodromes which indicates if covered by user or not
const coverageList = computed(() => {
  if (!store.userPosition) return []

  // 1) Find the user's sector code. Maybe optimize better later to avoid search?
  const userPosObj = POSITIONS.find((p) => p.callsign === store.userPosition)
  if (!userPosObj) return []
  const userSectorCode = userPosObj.sectorCode

  // 2) Build a lookup of which sectorCodes are online
  const onlineSectorCodes = {}
  store.onlineControllers.forEach((ctrl) => {
    const pos = POSITIONS.find((p) => p.callsign === ctrl.callsign)
    if (pos && pos.sectorCode) {
      onlineSectorCodes[pos.sectorCode] = ctrl.callsign
    }
  })

  // 3) For every aerodrome that includes userSectorCode in the chain...
  const result = []
  AERODROMES.forEach((aero) => {
    if (!aero.ownerHierarchy.includes(userSectorCode)) return

    // find who is controlling the AD
    let foundControlling = null
    for (const code of aero.ownerHierarchy) {
      if (onlineSectorCodes[code]) {
        foundControlling = code
        break
      }
    }

    // controllingSector === null => user effectively controls it (top-down or direct)
    // controllingSector !== null => someone else is controlling
    const isOmitted = store.omittedAirports.includes(aero.icao)
    const controllingSector = foundControlling === userSectorCode ? null : foundControlling

    // Will we generate strips for it? => user controls it (controllingSector === null)
    // AND user has *not* omitted it (isOmitted === false).
    const willGenerateStrips = controllingSector === null && !isOmitted

    result.push({
      icao: aero.icao,
      controllingSector,
      isOmitted,
      willGenerateStrips,
    })
  })

  // Sort by ICAO
  result.sort((a, b) => a.icao.localeCompare(b.icao))
  return result
})

// Sorted lists for overlays
const sortedOmitted = computed(() => [...store.omittedAirports].sort())
const sortedIgnored = computed(() => [...store.ignoredStrips].sort())

// For adding omitted airport
const newOmittedIcao = ref('')
function addNewOmitted() {
  if (newOmittedIcao.value) {
    store.addOmittedAirport(newOmittedIcao.value)
    newOmittedIcao.value = ''
  }
}

// Restore a deleted strip
function restoreStrip(callsign) {
  const index = store.ignoredStrips.indexOf(callsign.toUpperCase())
  if (index !== -1) {
    store.ignoredStrips.splice(index, 1)
  }
  store.updateStrips()
}

// Watch userPosition to update strips if it changes
watch(
  () => store.userPosition,
  (newVal) => {
    console.log('userPosition changed to:', newVal)
    store.resolveOwnership()
    store.fetchMetars(store.ownedAerodromes)
    store.fetchPilots()
    store.updateStrips()
  },
)

// Set up update intervals
let pilotControllerInterval = null
let metarInterval = null
let notamInterval = null

onMounted(async () => {
  await store.fetchControllers()
  store.resolveOwnership()
  store.fetchMetars(AERODROMES.map((aero) => aero.icao))
  await store.fetchPilots()
  store.updateStrips()
  store.fetchAllNotams()

  // fetch Pilots & controllers every 10 sec
  pilotControllerInterval = setInterval(async () => {
    await store.fetchControllers()
    store.resolveOwnership()
    await store.fetchPilots()
    store.updateStrips()
  }, 10000)

  // fetch METAR every 30 sec
  metarInterval = setInterval(() => {
    store.fetchMetars(AERODROMES.map((aero) => aero.icao))
  }, 30000)

  // fetch NOTAM every 15 min
  notamInterval = setInterval(() => {
    store.fetchAllNotams()
  }, 900000)
})

onUnmounted(() => {
  if (pilotControllerInterval) clearInterval(pilotControllerInterval)
  if (metarInterval) clearInterval(metarInterval)
  if (notamInterval) clearInterval(notamInterval)
})
</script>

<style scoped>
/* App container with dark-mode theme */
.app-container {
  min-height: 100vh;
  padding: 1rem;
  background-color: #121212;
  color: #e0e0e0;
  box-sizing: border-box;
}

.strip-bay-container {
  width: 100%;
  box-sizing: border-box;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: nowrap;
}
.app-title {
  font-size: 0.8rem;
  margin: 0;
  white-space: nowrap;
  color: #696969;
}

select {
  background-color: #1f1f1f;
  color: #e0e0e0;
  border: 1px solid #333;
  padding: 0.2rem;
  border-radius: 4px;
}

.overlay-btn {
  background-color: #1f1f1f;
  color: #e0e0e0;
  border: 1px solid #333;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.overlay-btn:hover {
  background-color: #333;
}

.overlay-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20px;
}
.overlay-window {
  background-color: #1f1f1f;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 90%;
  max-height: 80%;
  overflow-y: auto;
}
.overlay-window.compact {
  padding: 1rem;
}
.overlay-window h2 {
  margin-top: 0;
  text-align: center;
  font-size: 1.4rem;
  color: #e0e0e0;
}
.aerodrome-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  justify-content: center;
  margin: 1rem 0;
}
.aerodrome-badge {
  background-color: #333;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #e0e0e0;
}
.omitted-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.omitted-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #1f1f1f;
  color: #e0e0e0;
}
.omitted-list,
.deleted-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
}
.omitted-list li,
.deleted-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0;
  border-bottom: 1px solid #333;
}
.overlay-window button {
  background-color: #333;
  color: #e0e0e0;
  border: 1px solid #444;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.overlay-window button:hover {
  background-color: #555;
}

.aerodrome-badge {
  background-color: #333;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #e0e0e0;
}

.aerodrome-badge-other {
  background-color: #444;
  color: #999;
}

.aerodrome-badge-other {
  background-color: #444;
  color: #999;
}

.aerodrome-badge-ignored {
  text-decoration: line-through;
}

.aerodrome-badge-active {
  border: 1px solid rgb(121, 219, 121);
  background-color: #2b2b2b;
}
</style>
