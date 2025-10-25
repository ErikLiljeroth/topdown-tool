# Changelog

### v0.6 [2025-10-25]

- Merge fix from M.Insulander for VatIRIS METAR API

### v0.5 [2025-08-05]

- Update position and ownership dataset after ESOS position re-sectorization.
- Add ESSR_MM_APP and ESAA_CTR.
- Handle missing NOTAM data from VatIRIS API.

### v0.4 [2025-03-04]

- For departures display the first (valid) route waypoint in strip.
- For arrivals display the last (valid) route waypoint in strip.
- Display full route on callsign hover (and click to persist).
- Display "preferred" (if any) runway according to LOP with a border around the runway badge.
- Add basic drag and drop for strips within each bay.

### v0.3 [2025-02-20]

- Fix compatibility with multiple "\_" in login name.
- Selecting a position now considers it as "online" (even if not actually online). - (currently it may take a few seconds before refreshed, to be fixed)
- When removing omitted airports, refresh strips immediately.
- Added ESSR_CTR (RTC) and ESSP_APP (ÖKC) to selectable positions.
- Corrected API URL in console logging messages.

### v0.2 [2025-02-06]

- Generate strips for departures that connect but have not yet submitted a flight plan.

### v0.1 [2025-02-05]

- Initial version.
