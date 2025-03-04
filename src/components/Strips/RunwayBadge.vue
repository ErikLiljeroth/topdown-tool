<template>
  <div
    class="runway-badge"
    :class="{
      'preferred-runway': preferred,
      tailwind: isSignificantTailwind,
      headwind: isSignificantHeadwind,
    }"
  >
    <!-- Wind components (stacked vertically) -->
    <div class="wind-components" v-if="windData">
      <!-- Top row: Headwind or Tailwind -->
      <div class="headwind component">
        <span class="arrow headwind-arrow" :class="headwindArrowClass">
          {{ headwindArrow }}
        </span>
        <span class="value"> {{ Math.abs(headwindComponent) }}KT </span>
      </div>

      <!-- Bottom row: Crosswind (left or right) -->
      <div class="crosswind component">
        <span class="arrow cross-arrow">
          {{ crossArrow }}
        </span>
        <span class="value"> {{ crosswindComponent }}KT </span>
      </div>
    </div>

    <!-- If no wind data found in METAR -->
    <div v-else class="no-data">No wind data</div>

    <!-- Runway number on the right -->
    <div class="runway-number">
      {{ runway }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  runway: {
    type: String,
    required: true,
  },
  metar: {
    type: String,
    required: true,
  },

  preferred: {
    type: Boolean,
    default: false,
  },
})

/**
 * Parse wind from METAR, ignoring gust for the component calculations.
 * e.g. "23018G30KT" => windDir=230, windSpeed=18 (gust ignored)
 */
function parseWind(metarText) {
  if (!metarText) return null
  const regex = /(\d{3})(\d{2,3})(G(\d{2,3}))?KT/
  const match = metarText.match(regex)
  if (match) {
    return {
      windDir: parseInt(match[1], 10),
      windSpeed: parseInt(match[2], 10),
    }
  }
  return null
}

function degToRad(deg) {
  return (deg * Math.PI) / 180
}

/** Convert runway label "15" => heading 150°, "03" => 30° */
const runwayHeading = computed(() => {
  const num = parseInt(props.runway, 10)
  return num * 10
})

const windData = computed(() => parseWind(props.metar))

/**
 * Calculate wind components relative to the runway heading.
 */
const components = computed(() => {
  if (!windData.value) return null
  const { windDir, windSpeed } = windData.value
  const rwyHeading = runwayHeading.value
  let angleDiff = windDir - rwyHeading
  angleDiff = ((angleDiff + 180) % 360) - 180
  const angleRad = degToRad(angleDiff)
  const crosswind = Math.abs(windSpeed * Math.sin(angleRad))
  const headwind = windSpeed * Math.cos(angleRad)
  return {
    angleDiff,
    crosswind: Math.round(crosswind),
    headwind: Math.round(headwind),
  }
})

const isTailwind = computed(() => {
  return components.value && components.value.headwind < 0
})

const headwindComponent = computed(() => (components.value ? components.value.headwind : 0))
const crosswindComponent = computed(() => (components.value ? components.value.crosswind : 0))

const headwindArrow = computed(() => {
  return isTailwind.value ? '↑' : '↓'
})

const crossArrow = computed(() => {
  if (!components.value) return ''
  return components.value.angleDiff < 0 ? '→' : '←'
})

const headwindArrowClass = computed(() => {
  if (!components.value) return ''
  const mag = Math.abs(headwindComponent.value)
  return isTailwind.value
    ? mag >= 5
      ? 'arrow-red'
      : 'arrow-white'
    : mag >= 5
      ? 'arrow-green'
      : 'arrow-white'
})

const isSignificantTailwind = computed(() => {
  if (!components.value) return false
  return isTailwind.value && Math.abs(headwindComponent.value) >= 5
})

const isSignificantHeadwind = computed(() => {
  if (!components.value) return false
  return !isTailwind.value && Math.abs(headwindComponent.value) >= 5
})
</script>

<style scoped>
.runway-badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0px 3px;
  font-family: sans-serif;
  font-size: 0.75rem;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  margin: 0 1px;
  transition: background-color 0.2s ease;
  cursor: default;
  justify-content: space-between;
}

.preferred-runway {
  border: 2px solid black;
}

.runway-number {
  margin-left: 2px;
}

.runway-badge.tailwind {
  background-color: #ffecec;
}

.runway-badge.headwind {
  background-color: #e0ffe0;
}

.wind-components {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.65rem;
}

.component {
  display: flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
}

.arrow {
  font-size: 1rem;
  line-height: 0.5;
}

.arrow-green {
  color: green;
  font-weight: bold;
}

.arrow-red {
  color: red;
  font-weight: bold;
}

.arrow-white {
  color: black;
  font-weight: bold;
}

.cross-arrow {
  color: black;
  font-weight: bold;
}

.no-data {
  font-style: italic;
  color: #999;
  margin-right: 6px;
}
</style>
