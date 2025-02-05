# topdowntool

Support tool for Sweden Vatsim ACC (Area Control Centre) controllers to manage information for regional departures and arrivals. The tool automates a lot of the "boring" stuff regarding information gathering, allowing the controller to focus on ATS.

## Steps to start dev server locally

1. Clone this repo and move into repo
2. `npm install`
3. `npm run dev`

## Strips

Strips are generated for traffic to covered aerodromes. The tool detects departures that have not yet filed a flight plan.

## ETA calculation for arrivals

The topdown-tool uses a naive calculation for the ETA for arrivals.

> ETA = EOBT (as filed in FPL) + 15 min (estimated departure taxi time) + enroute time (as filed in FPL)
