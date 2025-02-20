// src/stores/topdownStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { parseMetar } from 'metar-taf-parser'
import { POSITIONS } from '@/data/swedenPositions.js'
import { AERODROMES } from '@/data/swedenAerodromes.js'

// Manage cases where controllers use multiple underscores in callsigns
function normalizeCallsign(callsign) {
  return callsign.replace(/_+/g, '_')
}

// "Simple" Haversine to get distance in nautical miles based in lat/lon
function distanceNm(lat1, lon1, lat2, lon2) {
  const R = 6371e3 // earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180

  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δφ = toRad(lat2 - lat1)
  const Δλ = toRad(lon2 - lon1)

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const meters = R * c

  // 1 nautical mile = 1852 meters
  return meters / 1852
}

// remove any "///" sequences from METAR string, and potentially other stuff later if needed
function sanitizeMetar(raw) {
  let sanitized = raw.replace(/\/\/\//g, '')

  return sanitized.trim()
}

// naive function that attempts to extract NOTAM text for a single ICAO
function extractNotam(fullText, icao) {
  // Look for the ">>>" marker
  const marker = `&gt;&gt;&gt; ${icao.toUpperCase()}`
  const startIndex = fullText.indexOf(marker)
  if (startIndex === -1) {
    return `No SNOWTAM/NOTAM info found for ${icao}`
  }

  // Slice until the next marker or end "<<<"
  const nextMarkerIndex = fullText.indexOf('&gt;&gt;&gt; ', startIndex + marker.length)
  const notamSection =
    nextMarkerIndex === -1
      ? fullText.slice(startIndex)
      : fullText.slice(startIndex, nextMarkerIndex)

  // Convert HTML entities
  let cleanedSection = notamSection.replace(/&gt;/g, '>').replace(/&lt;/g, '<')

  // Split into lines, then chunk any lines >42 chars, for better display
  const lines = cleanedSection.split('\n')
  const processedLines = lines.map((line) => {
    if (line.length > 42) {
      return line.match(/.{1,42}/g).join('\n')
    }
    return line
  })

  const finalText = processedLines.join('\n').trim()

  // Collapse multiple blank lines into a single line break
  const condensed = finalText.replace(/\n{2,}/g, '\n')

  return condensed
}

export const useTopdownStore = defineStore('topdown', {
  state: () => ({
    userPosition: null,
    onlineControllers: [],
    pilots: [],
    departureStrips: [],
    arrivalStrips: [],
    omittedAirports: ['ESSA', 'ESGG'],
    ownedAerodromes: [],
    metarsByIcao: {},
    notamsByIcao: {},
    ignoredStrips: [],
    soundEnabled: false, // Can be used to control whether sound is played for new strips
    remarksByCallsign: {},
  }),

  getters: {
    chosenPosition(state) {
      return state.userPosition || 'UNDEFINED'
    },
  },

  actions: {
    setUserPosition(position) {
      console.log('Setting user position:', position)

      // 1) Normalize
      const normalized = normalizeCallsign(position)
      this.userPosition = normalized

      // 2) Check if we already have an entry for that callsign
      const existingIndex = this.onlineControllers.findIndex((ctrl) => ctrl.callsign === normalized)
      if (existingIndex === -1) {
        this.onlineControllers.push({
          callsign: normalized,
        })
      }

      this.resolveOwnership()
    },

    async fetchControllers() {
      try {
        const response = await axios.get('https://api.vatiris.se/data')
        const rawControllers = response.data.controllers || []

        const normalized = rawControllers.map((ctrl) => {
          const normCallsign = normalizeCallsign(ctrl.callsign)
          return {
            ...ctrl,
            callsign: normCallsign,
          }
        })

        // Overwrite
        this.onlineControllers = normalized

        // If user selected a position that isn't in the server data, re-add it:
        if (this.userPosition) {
          const userPos = this.userPosition
          const alreadyThere = this.onlineControllers.some((ctrl) => ctrl.callsign === userPos)
          if (!alreadyThere) {
            this.onlineControllers.push({ callsign: userPos })
          }
        }
      } catch (err) {
        console.error('fetchControllers error:', err)
      }
    },

    async fetchPilots() {
      try {
        console.log('fetching pilots from https://api.vatiris.se/data')
        const response = await axios.get('https://api.vatiris.se/data')
        this.pilots = response.data.pilots || []
      } catch (err) {
        console.error('fetchPilots error:', err)
      }
    },

    /**
     * Fetch METAR data for a list of ICAOs, e.g. ["ESMQ","ESSA"]
     * Then parse with metar-taf-parser, store result in `metarsByIcao`.
     */
    async fetchMetars(icaoList = []) {
      if (icaoList.length === 0) return

      const uniqueList = [...new Set(icaoList)]
      try {
        const url = `https://api.vatiris.se/metar?ids=${uniqueList.join(',')}`
        console.log('fetching metars from:', url)
        const response = await axios.get(url)
        const data = response.data || {}

        // We expect string for metars from vatiris api, otherwise throw error
        if (typeof data === 'string') {
          const lines = data.split('\n')
          lines.forEach((line) => {
            // e.g. "ESGG 301320Z 18005KT 2400..."
            if (!line) return
            const maybeIcao = line.substring(0, 4).toUpperCase()
            if (!/^[A-Z0-9]{4}$/i.test(maybeIcao)) {
              console.warn('Skipping line:', line)
              return
            }
            const cleaned = sanitizeMetar(line)
            try {
              const parsed = parseMetar(cleaned)
              this.metarsByIcao[maybeIcao] = parsed
            } catch (err) {
              console.error('Error parsing line:', line, err)
              this.metarsByIcao[maybeIcao] = null
            }
          })
        } else {
          console.error('Unexpected METAR data:', data)
        }
      } catch (err) {
        console.error('fetchMetars error:', err)
      }
    },

    /**
     * Fetch NOTAM data for all aerodromes in `AERODROMES` list.
     */
    async fetchAllNotams() {
      try {
        console.log('Fetching NOTAM from https://api.vatiris.se/notam')
        const resp = await axios.get('https://api.vatiris.se/notam')
        const fullNotamText = resp.data || ''

        AERODROMES.forEach((aerodrome) => {
          const snippet = extractNotam(fullNotamText, aerodrome.icao)
          this.notamsByIcao[aerodrome.icao] = snippet
        })
      } catch (err) {
        console.error('Error fetching NOTAM data:', err)
        // fallback: store error placeholders
        this.ownedAerodromes.forEach((icao) => {
          this.notamsByIcao[icao] = `Error fetching NOTAM for ${icao}`
        })
      }
    },

    addOmittedAirport(icao) {
      icao = icao.toUpperCase()
      if (!this.omittedAirports.includes(icao)) {
        this.omittedAirports.push(icao)
        this.updateStrips() // update strips to see effect instantly
      }
    },
    removeOmittedAirport(icao) {
      this.omittedAirports = this.omittedAirports.filter((a) => a !== icao)
      this.updateStrips() // update the strips to see effect instantly
    },

    /**
     * Re-calcualte AD ownership - to be used when new data has been polled
     */
    resolveOwnership() {
      if (!this.userPosition) {
        this.ownedAerodromes = []
        return
      }
      const userPosObj = POSITIONS.find((p) => p.callsign === this.userPosition)
      if (!userPosObj) {
        this.ownedAerodromes = []
        return
      }
      const userSectorCode = userPosObj.sectorCode

      const onlineSectorCodes = {}
      this.onlineControllers.forEach((ctrl) => {
        const pos = POSITIONS.find((p) => p.callsign === ctrl.callsign)
        if (pos && pos.sectorCode) {
          onlineSectorCodes[pos.sectorCode] = ctrl.callsign
        }
      })

      const result = []
      AERODROMES.forEach((aero) => {
        const { icao, ownerHierarchy } = aero
        if (!ownerHierarchy.includes(userSectorCode)) return

        let foundControlling = null
        for (const code of ownerHierarchy) {
          if (onlineSectorCodes[code]) {
            foundControlling = code
            break
          }
        }

        if (!foundControlling) {
          // no one is online
          result.push(icao)
        } else if (foundControlling === userSectorCode) {
          result.push(icao)
        }
      })

      this.ownedAerodromes = result
    },

    /**
     * Generate strips based on current data
     * The algorithm is not optimized as it loops over data several times -> TODO
     */
    updateStrips() {
      if (!this.userPosition || this.ownedAerodromes.length === 0) {
        return
      }

      const coverageSet = new Set(this.ownedAerodromes)
      const omittedSet = new Set(this.omittedAirports.map((i) => i.toUpperCase()))

      const depMap = new Map()
      this.departureStrips.forEach((s) => depMap.set(s.callsign.toUpperCase(), s))
      const arrMap = new Map()
      this.arrivalStrips.forEach((s) => arrMap.set(s.callsign.toUpperCase(), s))

      const newDeparture = []
      const newArrival = []

      // Gather active pilot callsigns
      const activePilotCallsigns = new Set(this.pilots.map((p) => p.callsign.toUpperCase()))

      // Keep existing strips only if pilot is still online
      this.departureStrips.forEach((strip) => {
        if (activePilotCallsigns.has(strip.callsign.toUpperCase())) {
          newDeparture.push(strip)
        }
      })
      this.arrivalStrips.forEach((strip) => {
        if (activePilotCallsigns.has(strip.callsign.toUpperCase())) {
          newArrival.push(strip)
        }
      })

      let newStripsCreated = false

      // 1) First case: handle flights that HAVE a flight plan
      this.pilots.forEach((pilot) => {
        const callsignUpper = pilot.callsign.toUpperCase()
        if (this.ignoredStrips.includes(callsignUpper)) return

        const fp = pilot.flight_plan
        if (!fp) return

        const depIcao = (fp.departure || '').toUpperCase()
        const arrIcao = (fp.arrival || '').toUpperCase()

        const depRelevant = coverageSet.has(depIcao) && !omittedSet.has(depIcao)
        const arrRelevant = coverageSet.has(arrIcao) && !omittedSet.has(arrIcao)

        if (!depRelevant && !arrRelevant) return

        // A) Update or create departure strip if relevant
        if (depRelevant) {
          const existingDepStrip = depMap.get(callsignUpper)
          if (existingDepStrip) {
            existingDepStrip.hasFlightPlan = true
            if (!newDeparture.includes(existingDepStrip)) {
              newDeparture.push(existingDepStrip)
            }
          } else {
            // Create new departure strip
            const oldRemarks = this.remarksByCallsign[callsignUpper] || ''
            newDeparture.push({
              callsign: pilot.callsign,
              hasFlightPlan: true,
              aircraftType: fp.aircraft_short || fp.aircraft || 'N/A',
              departureAerodrome: depIcao,
              etd: fp.deptime,
              newAlert: true,
              remarks: oldRemarks,
            })
            newStripsCreated = true
          }
        }

        // --- B) Arrival strip if relevant
        if (arrRelevant) {
          const existingArrStrip = arrMap.get(callsignUpper)
          if (existingArrStrip) {
            existingArrStrip.hasFlightPlan = true
            if (!newArrival.includes(existingArrStrip)) {
              newArrival.push(existingArrStrip)
            }
          } else {
            // Create brand-new arrival strip, merging old remarks
            const oldRemarks = this.remarksByCallsign[callsignUpper] || ''
            const depStr = fp.deptime?.toString().padStart(4, '0') || '0000'
            const depHours = Number(depStr.slice(0, 2))
            const depMinutes = Number(depStr.slice(2, 4))
            const depTotal = depHours * 60 + depMinutes
            const enroute = Number(fp.enroute_time) || 0
            const etaTotal = depTotal + enroute + 15
            const etaHours = Math.floor(etaTotal / 60) % 24
            const etaMins = etaTotal % 60
            const etaFormatted =
              etaHours.toString().padStart(2, '0') + etaMins.toString().padStart(2, '0')

            newArrival.push({
              callsign: pilot.callsign,
              hasFlightPlan: true,
              aircraftType: fp.aircraft_short || fp.aircraft || 'N/A',
              arrivalAerodrome: arrIcao,
              eta: etaFormatted,
              newAlert: true,
              remarks: oldRemarks, // preserve from dictionary
            })
            newStripsCreated = true
          }
        }
      })

      // 2) Second case: handle flights that have NO flight plan
      // In this case we have to check whether a flight is in a volume close to an AD
      this.pilots.forEach((pilot) => {
        const callsignUpper = pilot.callsign.toUpperCase()
        if (this.ignoredStrips.includes(callsignUpper)) return

        // If pilot has an FP, skip
        if (pilot.flight_plan) return

        // Basic “on the ground” heuristic
        const alt = pilot.altitude || 0
        const gspd = pilot.groundspeed || 0
        if (alt > 3000 || gspd > 40) {
          return
        }

        // Check for nearest AD within 3nm
        let nearestIcao = null
        let nearestDist = Infinity
        AERODROMES.forEach((aero) => {
          const icao = aero.icao
          if (!coverageSet.has(icao)) return
          if (omittedSet.has(icao)) return

          const dist = distanceNm(
            pilot.latitude,
            pilot.longitude,
            aero.position.lat,
            aero.position.lon,
          )
          if (dist < nearestDist) {
            nearestDist = dist
            nearestIcao = icao
          }
        })

        // If we found an AD
        if (nearestIcao && nearestDist <= 3) {
          const existingDepStrip = depMap.get(callsignUpper)
          if (existingDepStrip) {
            // Reuse old object, set hasFlightPlan = false
            existingDepStrip.hasFlightPlan = false
            if (!newDeparture.includes(existingDepStrip)) {
              newDeparture.push(existingDepStrip)
            }
          } else {
            // Create brand-new "no flight plan" departure strip
            const oldRemarks = this.remarksByCallsign[callsignUpper] || ''
            newDeparture.push({
              callsign: pilot.callsign,
              hasFlightPlan: false,
              aircraftType: 'N/A',
              departureAerodrome: nearestIcao,
              etd: null,
              newAlert: true,
              remarks: oldRemarks,
            })
            newStripsCreated = true
          }
        }
      })

      // 3) Final assignment back to the store
      this.departureStrips = newDeparture
      this.arrivalStrips = newArrival

      // 4) Optionally, play a beep if new strips were created... TBD, maybe configured by user IDK
      if (newStripsCreated && this.soundEnabled) {
        try {
          const audio = new Audio('/topdown-tool/audio/beep.mp3')
          audio.play()
        } catch (err) {
          console.warn('Unable to play new strip sound:', err)
        }
      }
    },

    removeDepartureStrip(callsign) {
      this.departureStrips = this.departureStrips.filter((s) => s.callsign !== callsign)
      if (!this.ignoredStrips.includes(callsign.toUpperCase())) {
        this.ignoredStrips.push(callsign.toUpperCase())
      }
    },
    removeArrivalStrip(callsign) {
      this.arrivalStrips = this.arrivalStrips.filter((s) => s.callsign !== callsign)
      if (!this.ignoredStrips.includes(callsign.toUpperCase())) {
        this.ignoredStrips.push(callsign.toUpperCase())
      }
    },

    ackArrivalStrip(callsign) {
      const strip = this.arrivalStrips.find((s) => s.callsign === callsign)
      if (strip) {
        strip.newAlert = false
        strip.acked = true
      }
    },

    ackDepartureStrip(callsign) {
      const strip = this.departureStrips.find((s) => s.callsign === callsign)
      if (strip) {
        strip.newAlert = false
        strip.acked = true
      }
    },

    updateArrivalRemarks(callsign, newRemarks) {
      this.remarksByCallsign[callsign.toUpperCase()] = newRemarks

      const strip = this.arrivalStrips.find(
        (s) => s.callsign.toUpperCase() === callsign.toUpperCase(),
      )
      if (strip) {
        strip.remarks = newRemarks
      }
    },

    updateDepartureRemarks(callsign, newRemarks) {
      this.remarksByCallsign[callsign.toUpperCase()] = newRemarks

      const strip = this.departureStrips.find(
        (s) => s.callsign.toUpperCase() === callsign.toUpperCase(),
      )
      if (strip) {
        strip.remarks = newRemarks
      }
    },
  },
})
