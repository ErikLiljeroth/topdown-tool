// swedenPositions.js (or swedenPositions.ts)
export const POSITIONS = [
  // --- 1) Swedish “Planner”  ---
  {
    callsign: 'ESAA_CTR',
    name: 'Sweden Control',
    frequency: '126.825',
    sectorCode: 'AA',
    facilityType: 'CTR',
    icao: 'ESAA',
  },

  // --- 2) ESCF (Malmen) ---
  {
    callsign: 'ESCF_APP',
    name: 'Malmen Approach',
    frequency: '135.850',
    sectorCode: 'CFA',
    facilityType: 'APP',
    icao: 'ESCF',
  },
  {
    callsign: 'ESCF_GND',
    name: 'Malmen Ground',
    frequency: '121.850',
    sectorCode: 'CFG',
    facilityType: 'GND',
    icao: 'ESCF',
  },
  {
    callsign: 'ESCF_P_APP',
    name: 'Malmen Precision',
    frequency: '125.200',
    sectorCode: 'CFP',
    facilityType: 'APP',
    icao: 'ESCF',
  },
  {
    callsign: 'ESCF_TWR',
    name: 'Malmen Tower',
    frequency: '129.800',
    sectorCode: 'CF',
    facilityType: 'TWR',
    icao: 'ESCF',
  },

  // --- 3) ESCM (Uppsala) ---
  {
    callsign: 'ESCM_APP',
    name: 'Uppsala Approach',
    frequency: '130.400',
    sectorCode: 'CMA',
    facilityType: 'APP',
    icao: 'ESCM',
  },
  {
    callsign: 'ESCM_TWR',
    name: 'Uppsala Tower',
    frequency: '119.200',
    sectorCode: 'CM',
    facilityType: 'TWR',
    icao: 'ESCM',
  },

  // --- 4) ESCR_CTR “Grizzly” ---
  {
    callsign: 'ESCR_CTR',
    name: 'Grizzly',
    frequency: '135.200',
    sectorCode: 'GRIZ',
    facilityType: 'CTR',
    icao: 'ESCR',
  },

  // --- 5) ESDF (Ronneby) ---
  {
    callsign: 'ESDF_APP',
    name: 'Ronneby Approach',
    frequency: '128.450',
    sectorCode: 'DFA',
    facilityType: 'APP',
    icao: 'ESDF',
  },
  {
    callsign: 'ESDF_GND',
    name: 'Ronneby Ground',
    frequency: '121.850',
    sectorCode: 'DFG',
    facilityType: 'GND',
    icao: 'ESDF',
  },
  {
    callsign: 'ESDF_P_APP',
    name: 'Ronneby Precision',
    frequency: '134.100',
    sectorCode: 'DFP',
    facilityType: 'APP',
    icao: 'ESDF',
  },
  {
    callsign: 'ESDF_TWR',
    name: 'Ronneby Tower',
    frequency: '119.200',
    sectorCode: 'DF',
    facilityType: 'TWR',
    icao: 'ESDF',
  },

  // --- 6) ESDK_CTR “Blue Shark” ---
  {
    callsign: 'ESDK_CTR',
    name: 'Blue Shark',
    frequency: '132.100',
    sectorCode: 'SHRK',
    facilityType: 'CTR',
    icao: 'ESDK',
  },

  // --- 7) ESFR (Råda?) ---
  {
    callsign: 'ESFR_APP',
    name: 'R da Approach',
    frequency: '133.500',
    sectorCode: 'FRA',
    facilityType: 'APP',
    icao: 'ESFR',
  },
  {
    callsign: 'ESFR_TWR',
    name: 'R da Tower',
    frequency: '136.025',
    sectorCode: 'FR',
    facilityType: 'TWR',
    icao: 'ESFR',
  },

  // --- 8) ESGG (Göteborg/Landvetter) ---
  {
    callsign: 'ESGG_ATIS',
    name: 'Landvetter ATIS',
    frequency: '118.380',
    sectorCode: 'ATGG',
    facilityType: 'ATIS',
    icao: 'ESGG',
  },
  {
    callsign: 'ESGG_A_APP',
    name: 'Göteborg Arrival',
    frequency: '120.130',
    sectorCode: 'GA',
    facilityType: 'APP',
    icao: 'ESGG',
  },
  {
    callsign: 'ESGG_DEL',
    name: 'Landvetter Clearance Delivery',
    frequency: '121.680',
    sectorCode: 'GGD',
    facilityType: 'DEL',
    icao: 'ESGG',
  },
  {
    callsign: 'ESGG_E_APP',
    name: 'Göteborg Approach',
    frequency: '124.680',
    sectorCode: 'GE',
    facilityType: 'APP',
    icao: 'ESGG',
  },
  {
    callsign: 'ESGG_GND',
    name: 'Landvetter Ground',
    frequency: '121.905',
    sectorCode: 'GGG',
    facilityType: 'GND',
    icao: 'ESGG',
  },
  {
    callsign: 'ESGG_TWR',
    name: 'Landvetter Tower',
    frequency: '118.605',
    sectorCode: 'GG',
    facilityType: 'TWR',
    icao: 'ESGG',
  },
  {
    callsign: 'ESGG_W_APP',
    name: 'Göteborg Approach',
    frequency: '124.205',
    sectorCode: 'GW',
    facilityType: 'APP',
    icao: 'ESGG',
  },

  // --- 9) ESGJ (Jönköping) ---
  {
    callsign: 'ESGJ_TWR',
    name: 'Jönköping Tower',
    frequency: '118.255',
    sectorCode: 'GJ',
    facilityType: 'TWR',
    icao: 'ESGJ',
  },

  // --- 10) ESGP (Säve) ---
  {
    callsign: 'ESGP_TWR',
    name: 'Säve Tower',
    frequency: '119.055',
    sectorCode: 'GP',
    facilityType: 'TWR',
    icao: 'ESGP',
  },

  // --- 11) ESGT (Trollhättan) ---
  {
    callsign: 'ESGT_TWR',
    name: 'Trollhättan Tower',
    frequency: '122.730',
    sectorCode: 'GT',
    facilityType: 'TWR',
    icao: 'ESGT',
  },

  // --- 12) ESIA (Karlsborg) ---
  {
    callsign: 'ESIA_APP',
    name: 'Karlsborg Approach',
    frequency: '132.050',
    sectorCode: 'IAA',
    facilityType: 'APP',
    icao: 'ESIA',
  },
  {
    callsign: 'ESIA_TWR',
    name: 'Karlsborg Tower',
    frequency: '133.000',
    sectorCode: 'IA',
    facilityType: 'TWR',
    icao: 'ESIA',
  },

  // --- 13) ESIB (Såtenäs) ---
  {
    callsign: 'ESIB_APP',
    name: 'Såtenäs Approach',
    frequency: '134.550',
    sectorCode: 'IBA',
    facilityType: 'APP',
    icao: 'ESIB',
  },
  {
    callsign: 'ESIB_GND',
    name: 'Såtenäs Ground',
    frequency: '121.850',
    sectorCode: 'IBG',
    facilityType: 'GND',
    icao: 'ESIB',
  },
  {
    callsign: 'ESIB_P_APP',
    name: 'Såtenäs Precision',
    frequency: '119.300',
    sectorCode: 'IBP',
    facilityType: 'APP',
    icao: 'ESIB',
  },
  {
    callsign: 'ESIB_TWR',
    name: 'Såtenäs Tower',
    frequency: '128.200',
    sectorCode: 'IB',
    facilityType: 'TWR',
    icao: 'ESIB',
  },

  // --- 14) ESKM (Mora) ---
  {
    callsign: 'ESKM_I_TWR',
    name: 'Mora Information',
    frequency: '119.055',
    sectorCode: 'KM',
    facilityType: 'TWR',
    icao: 'ESKM',
  },

  // --- 15) ESKN (Stockholm/Skavsta) ---
  {
    callsign: 'ESKN_ATIS',
    name: 'Skavsta ATIS',
    frequency: '126.280',
    sectorCode: 'ATKN',
    facilityType: 'ATIS',
    icao: 'ESKN',
  },
  {
    callsign: 'ESKN_TWR',
    name: 'Skavsta Tower',
    frequency: '127.705',
    sectorCode: 'KN',
    facilityType: 'TWR',
    icao: 'ESKN',
  },

  // --- 16) ESKS (Sälen) ---
  {
    callsign: 'ESKS_TWR',
    name: 'Sälen Tower',
    frequency: '124.460',
    sectorCode: 'KS',
    facilityType: 'TWR',
    icao: 'ESKS',
  },

  // --- 17) ESMK (Kristianstad) ---
  {
    callsign: 'ESMK_TWR',
    name: 'Kristianstad Tower',
    frequency: '129.355',
    sectorCode: 'KT',
    facilityType: 'TWR',
    icao: 'ESMK',
  },

  // --- 18) ESMM (Sweden Control) ---
  {
    callsign: 'ESMM_2_CTR',
    name: 'Sweden Control',
    frequency: '127.755',
    sectorCode: 'M2',
    facilityType: 'CTR',
    icao: 'ESMM',
  },
  {
    callsign: 'ESMM_3_CTR',
    name: 'Sweden Control',
    frequency: '128.055',
    sectorCode: 'M3',
    facilityType: 'CTR',
    icao: 'ESMM',
  },
  {
    callsign: 'ESMM_4_CTR',
    name: 'Sweden Control',
    frequency: '124.405',
    sectorCode: 'M4',
    facilityType: 'CTR',
    icao: 'ESMM',
  },
  {
    callsign: 'ESMM_5_CTR',
    name: 'Sweden Control',
    frequency: '132.765',
    sectorCode: 'M5',
    facilityType: 'CTR',
    icao: 'ESMM',
  },
  {
    callsign: 'ESMM_6_CTR',
    name: 'Sweden Control',
    frequency: '135.805',
    sectorCode: 'M6',
    facilityType: 'CTR',
    icao: 'ESMM',
  },
  {
    callsign: 'ESMM_7_CTR',
    name: 'Sweden Control',
    frequency: '124.155',
    sectorCode: 'M7',
    facilityType: 'CTR',
    icao: 'ESMM',
  },
  {
    callsign: 'ESMM_8_CTR',
    name: 'Sweden Control',
    frequency: '128.180',
    sectorCode: 'M8',
    facilityType: 'CTR',
    icao: 'ESMM',
  },
  {
    callsign: 'ESMM_9_CTR',
    name: 'Sweden Control',
    frequency: '135.980',
    sectorCode: 'M9',
    facilityType: 'CTR',
    icao: 'ESMM',
  },
  {
    callsign: 'ESMM_IN_CTR',
    name: 'Sweden Control',
    frequency: '128.630',
    sectorCode: 'MIN',
    facilityType: 'CTR',
    icao: 'ESMM',
  },
  {
    callsign: 'ESMM_K_CTR',
    name: 'Sweden Control',
    frequency: '131.280',
    sectorCode: 'MK',
    facilityType: 'CTR',
    icao: 'ESMM',
  },
  {
    callsign: 'ESMM_W_CTR',
    name: 'Sweden Control',
    frequency: '133.260',
    sectorCode: 'MW',
    facilityType: 'CTR',
    icao: 'ESMM',
  },
  {
    callsign: 'ESMM_XK_CTR',
    name: 'Sweden Control',
    frequency: '124.855',
    sectorCode: 'MXK',
    facilityType: 'CTR',
    icao: 'ESMM',
  },
  {
    callsign: 'ESMM_Y_CTR',
    name: 'Sweden Control',
    frequency: '134.455',
    sectorCode: 'MY',
    facilityType: 'CTR',
    icao: 'ESMM',
  },

  {
    callsign: 'ESMS_APP',
    name: 'Sweden Control',
    frequency: '134.980',
    sectorCode: 'ML',
    facilityType: 'APP',
    icao: 'ESMS',
  },

  {
    callsign: 'ESMS_IS_APP',
    name: 'Sweden Control',
    frequency: '133.805',
    sectorCode: 'MIS',
    facilityType: 'APP',
    icao: 'ESMS',
  },
  {
    callsign: 'ESMS_XL_APP',
    name: 'Sweden Control',
    frequency: '134.155',
    sectorCode: 'MXL',
    facilityType: 'APP',
    icao: 'ESMS',
  },

  // --- 19) ESMQ (Kalmar) ---
  {
    callsign: 'ESMQ_TWR',
    name: 'Kalmar Tower',
    frequency: '130.805',
    sectorCode: 'MQ',
    facilityType: 'TWR',
    icao: 'ESMQ',
  },

  // --- 20) ESMS (Malmö/Sturup) ---

  {
    callsign: 'ESMS_ATIS',
    name: 'Sturup ATIS',
    frequency: '129.280',
    sectorCode: 'ATMS',
    facilityType: 'ATIS',
    icao: 'ESMS',
  },
  {
    callsign: 'ESMS_GND',
    name: 'Sturup Ground',
    frequency: '121.705',
    sectorCode: 'MSG',
    facilityType: 'GND',
    icao: 'ESMS',
  },
  {
    callsign: 'ESMS_TWR',
    name: 'Sturup Tower',
    frequency: '118.805',
    sectorCode: 'MS',
    facilityType: 'TWR',
    icao: 'ESMS',
  },

  // --- 21) ESMT (Halmstad) ---
  {
    callsign: 'ESMT_TWR',
    name: 'Halmstad Tower',
    frequency: '130.105',
    sectorCode: 'MT',
    facilityType: 'TWR',
    icao: 'ESMT',
  },

  // --- 22) ESMV (Hagshult) ---
  {
    callsign: 'ESMV_APP',
    name: 'Hagshult Approach',
    frequency: '121.150',
    sectorCode: 'MVA',
    facilityType: 'APP',
    icao: 'ESMV',
  },
  {
    callsign: 'ESMV_TWR',
    name: 'Hagshult Tower',
    frequency: '136.250',
    sectorCode: 'MV',
    facilityType: 'TWR',
    icao: 'ESMV',
  },

  // --- 23) ESMX (Växjö/Kronoberg) ---
  {
    callsign: 'ESMX_TWR',
    name: 'Kronoberg Tower',
    frequency: '118.155',
    sectorCode: 'MX',
    facilityType: 'TWR',
    icao: 'ESMX',
  },

  // --- 24) ESND (Sveg) ---
  {
    callsign: 'ESND_I_TWR',
    name: 'Sveg Information',
    frequency: '122.205',
    sectorCode: 'ND',
    facilityType: 'TWR',
    icao: 'ESND',
  },

  // --- 25) ESNG (Gällivare) ---
  {
    callsign: 'ESNG_I_TWR',
    name: 'Gällivare Information',
    frequency: '122.330',
    sectorCode: 'NG',
    facilityType: 'TWR',
    icao: 'ESNG',
  },

  // --- 26) ESNJ (Jokkmokk) ---
  {
    callsign: 'ESNJ_APP',
    name: 'Jokkmokk Approach',
    frequency: '124.850',
    sectorCode: 'NJA',
    facilityType: 'APP',
    icao: 'ESNJ',
  },
  {
    callsign: 'ESNJ_TWR',
    name: 'Jokkmokk Tower',
    frequency: '133.000',
    sectorCode: 'NJ',
    facilityType: 'TWR',
    icao: 'ESNJ',
  },

  // --- 27) ESNK (Kramfors) ---
  {
    callsign: 'ESNK_I_TWR',
    name: 'Kramfors Information',
    frequency: '122.155',
    sectorCode: 'NK',
    facilityType: 'TWR',
    icao: 'ESNK',
  },

  // --- 28) ESNL (Lycksele) ---
  {
    callsign: 'ESNL_I_TWR',
    name: 'Lycksele Information',
    frequency: '122.230',
    sectorCode: 'NL',
    facilityType: 'TWR',
    icao: 'ESNL',
  },

  // --- 29) ESNN (Sundsvall) ---
  {
    callsign: 'ESNN_ATIS',
    name: 'Sundsvall ATIS',
    frequency: '127.405',
    sectorCode: 'ATNN',
    facilityType: 'ATIS',
    icao: 'ESNN',
  },
  {
    callsign: 'ESNN_TWR',
    name: 'Sundsvall Tower',
    frequency: '129.555',
    sectorCode: 'NN',
    facilityType: 'TWR',
    icao: 'ESNN',
  },

  // --- 30) ESNO (Örnsköldsvik) ---
  {
    callsign: 'ESNO_TWR',
    name: 'Örnsköldsvik Tower',
    frequency: '122.255',
    sectorCode: 'NO',
    facilityType: 'TWR',
    icao: 'ESNO',
  },

  // --- 31) ESNQ (Kiruna) ---
  {
    callsign: 'ESNQ_TWR',
    name: 'Kiruna Tower',
    frequency: '130.155',
    sectorCode: 'NQ',
    facilityType: 'TWR',
    icao: 'ESNQ',
  },

  // --- 32) ESNS (Skellefteå) ---
  {
    callsign: 'ESNS_TWR',
    name: 'Skellefteå Tower',
    frequency: '122.055',
    sectorCode: 'NS',
    facilityType: 'TWR',
    icao: 'ESNS',
  },

  // --- 33) ESNU (Umeå) ---
  {
    callsign: 'ESNU_TWR',
    name: 'Umeå Tower',
    frequency: '119.805',
    sectorCode: 'NU',
    facilityType: 'TWR',
    icao: 'ESNU',
  },

  // --- 34) ESNV (Vilhelmina) ---
  {
    callsign: 'ESNV_I_TWR',
    name: 'Vilhelmina Information',
    frequency: '122.555',
    sectorCode: 'NV',
    facilityType: 'TWR',
    icao: 'ESNV',
  },

  // --- 35) ESNX (Arvidsjaur) ---
  {
    callsign: 'ESNX_TWR',
    name: 'Arvidsjaur Tower',
    frequency: '122.730',
    sectorCode: 'NX',
    facilityType: 'TWR',
    icao: 'ESNX',
  },

  // --- 36) ESNZ (Åre Östersund) ---
  {
    callsign: 'ESNZ_TWR',
    name: 'Östersund Tower',
    frequency: '135.655',
    sectorCode: 'NZ',
    facilityType: 'TWR',
    icao: 'ESNZ',
  },

  // --- 37) ESOE (Örebro) ---
  {
    callsign: 'ESOE_TWR',
    name: 'Örebro Tower',
    frequency: '120.280',
    sectorCode: 'OE',
    facilityType: 'TWR',
    icao: 'ESOE',
  },

  // --- 38) ESOH (Hagfors) ---
  {
    callsign: 'ESOH_I_TWR',
    name: 'Hagfors Information',
    frequency: '122.230',
    sectorCode: 'OH',
    facilityType: 'TWR',
    icao: 'ESOH',
  },

  // --- 39) ESOK (Karlstad) ---
  {
    callsign: 'ESOK_TWR',
    name: 'Karlstad Tower',
    frequency: '119.455',
    sectorCode: 'OK',
    facilityType: 'TWR',
    icao: 'ESOK',
  },

  // --- 40) ESOS ( “Sweden Control”) ---
  {
    callsign: 'ESOS_1_CTR',
    name: 'Sweden Control',
    frequency: '118.405',
    sectorCode: 'S1',
    facilityType: 'CTR',
    icao: 'ESOS',
  },
  {
    callsign: 'ESOS_2_CTR',
    name: 'Sweden Control',
    frequency: '133.705',
    sectorCode: 'S2',
    facilityType: 'CTR',
    icao: 'ESOS',
  },
  {
    callsign: 'ESOS_3_CTR',
    name: 'Sweden Control',
    frequency: '131.130',
    sectorCode: 'S3',
    facilityType: 'CTR',
    icao: 'ESOS',
  },
  {
    callsign: 'ESOS_4_CTR',
    name: 'Sweden Control',
    frequency: '118.205',
    sectorCode: 'S4',
    facilityType: 'CTR',
    icao: 'ESOS',
  },
  {
    callsign: 'ESOS_6_CTR',
    name: 'Sweden Control',
    frequency: '132.480',
    sectorCode: 'S6',
    facilityType: 'CTR',
    icao: 'ESOS',
  },
  {
    callsign: 'ESOS_7_CTR',
    name: 'Sweden Control',
    frequency: '118.280',
    sectorCode: 'S7',
    facilityType: 'CTR',
    icao: 'ESOS',
  },
  {
    callsign: 'ESOS_8_CTR',
    name: 'Sweden Control',
    frequency: '129.180',
    sectorCode: 'S8',
    facilityType: 'CTR',
    icao: 'ESOS',
  },
  {
    callsign: 'ESOS_9_CTR',
    name: 'Sweden Control',
    frequency: '127.530',
    sectorCode: 'S9',
    facilityType: 'CTR',
    icao: 'ESOS',
  },
  {
    callsign: 'ESOS_F_CTR',
    name: 'Sweden Control',
    frequency: '124.430',
    sectorCode: 'SF',
    facilityType: 'CTR',
    icao: 'ESOS',
  },
  {
    callsign: 'ESOS_K_CTR',
    name: 'Sweden Control',
    frequency: '131.055',
    sectorCode: 'SK',
    facilityType: 'CTR',
    icao: 'ESOS',
  },
  {
    callsign: 'ESOS_N_CTR',
    name: 'Sweden Control',
    frequency: '132.155',
    sectorCode: 'SN',
    facilityType: 'CTR',
    icao: 'ESOS',
  },
  {
    callsign: 'ESOS_XK_CTR',
    name: 'Sweden Control',
    frequency: '125.600',
    sectorCode: 'SXK',
    facilityType: 'CTR',
    icao: 'ESOS',
  },
  {
    callsign: 'ESOS_YK_CTR',
    name: 'Sweden Control',
    frequency: '133.455',
    sectorCode: 'SYK',
    facilityType: 'CTR',
    icao: 'ESOS',
  },

  // --- 41) ESOW (Västerås) ---
  {
    callsign: 'ESOW_APP',
    name: 'Västerås Approach',
    frequency: '125.955',
    sectorCode: 'OWA',
    facilityType: 'APP',
    icao: 'ESOW',
  },
  {
    callsign: 'ESOW_ATIS',
    name: 'Västerås ATIS',
    frequency: '127.555',
    sectorCode: 'ATOW',
    facilityType: 'ATIS',
    icao: 'ESOW',
  },
  {
    callsign: 'ESOW_TWR',
    name: 'Västerås Tower',
    frequency: '130.605',
    sectorCode: 'OW',
    facilityType: 'TWR',
    icao: 'ESOW',
  },

  // --- 42) ESPA (Luleå/Kallax) ---
  {
    callsign: 'ESPA_APP',
    name: 'Kallax Approach',
    frequency: '125.450',
    sectorCode: 'PAA',
    facilityType: 'APP',
    icao: 'ESPA',
  },
  {
    callsign: 'ESPA_F_APP',
    name: 'Kallax Approach',
    frequency: '130.800',
    sectorCode: 'PAF',
    facilityType: 'APP',
    icao: 'ESPA',
  },
  {
    callsign: 'ESPA_P_APP',
    name: 'Kallax Precision',
    frequency: '119.000',
    sectorCode: 'PAP',
    facilityType: 'APP',
    icao: 'ESPA',
  },
  {
    callsign: 'ESPA_TWR',
    name: 'Kallax Tower',
    frequency: '128.200',
    sectorCode: 'PA',
    facilityType: 'TWR',
    icao: 'ESPA',
  },

  // --- 43) ESPE (Vidsel) ---
  {
    callsign: 'ESPE_APP',
    name: 'Vidsel Approach',
    frequency: '124.150',
    sectorCode: 'PEA',
    facilityType: 'APP',
    icao: 'ESPE',
  },
  {
    callsign: 'ESPE_P_APP',
    name: 'Vidsel Precision',
    frequency: '135.400',
    sectorCode: 'PEP',
    facilityType: 'APP',
    icao: 'ESPE',
  },
  {
    callsign: 'ESPE_TWR',
    name: 'Vidsel Tower',
    frequency: '130.400',
    sectorCode: 'PE',
    facilityType: 'TWR',
    icao: 'ESPE',
  },

  // --- 44) ESPF_CTR “Cobra” ---
  {
    callsign: 'ESPF_CTR',
    name: 'Cobra',
    frequency: '129.450',
    sectorCode: 'CBRA',
    facilityType: 'CTR',
    icao: 'ESPF',
  },

  // --- 45) ESSA (Stockholm-Arlanda) ---
  {
    callsign: 'ESSA_ATIS',
    name: 'Arlanda ATIS',
    frequency: '119.005',
    sectorCode: 'ATSA',
    facilityType: 'ATIS',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_A_APP',
    name: 'Stockholm Arrival',
    frequency: '120.505',
    sectorCode: 'A',
    facilityType: 'APP',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_A_ATIS',
    name: 'Arlanda Arrival ATIS',
    frequency: '119.005',
    sectorCode: 'ATSAA',
    facilityType: 'ATIS',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_DEL',
    name: 'Arlanda Clearance Delivery',
    frequency: '121.830',
    sectorCode: 'SAD',
    facilityType: 'DEL',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_D_ATIS',
    name: 'Arlanda Departure ATIS',
    frequency: '121.630',
    sectorCode: 'ATSAD',
    facilityType: 'ATIS',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_E_APP',
    name: 'Stockholm Approach',
    frequency: '126.655',
    sectorCode: 'E',
    facilityType: 'APP',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_E_DEP',
    name: 'Stockholm Departure',
    frequency: '130.330',
    sectorCode: 'DE',
    facilityType: 'DEP',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_E_GND',
    name: 'Arlanda Ground',
    frequency: '121.980',
    sectorCode: 'AGE',
    facilityType: 'GND',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_E_TWR',
    name: 'Arlanda Tower',
    frequency: '128.730',
    sectorCode: 'TE',
    facilityType: 'TWR',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_F_APP',
    name: 'Stockholm Arrival',
    frequency: '119.630',
    sectorCode: 'AW',
    facilityType: 'APP',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_N_GND',
    name: 'Arlanda Ground',
    frequency: '121.930',
    sectorCode: 'AGN',
    facilityType: 'GND',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_S_TWR',
    name: 'Arlanda Tower',
    frequency: '125.130',
    sectorCode: 'TS',
    facilityType: 'TWR',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_W_APP',
    name: 'Stockholm Approach',
    frequency: '123.755',
    sectorCode: 'W',
    facilityType: 'APP',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_W_DEP',
    name: 'Stockholm Departure',
    frequency: '124.105',
    sectorCode: 'DW',
    facilityType: 'DEP',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_W_GND',
    name: 'Arlanda Ground',
    frequency: '121.705',
    sectorCode: 'AGW',
    facilityType: 'GND',
    icao: 'ESSA',
  },
  {
    callsign: 'ESSA_W_TWR',
    name: 'Arlanda Tower',
    frequency: '118.505',
    sectorCode: 'TW',
    facilityType: 'TWR',
    icao: 'ESSA',
  },

  // --- 46) ESSB (Stockholm-Bromma) ---
  {
    callsign: 'ESSB_APP',
    name: 'Stockholm Approach',
    frequency: '120.155',
    sectorCode: 'S',
    facilityType: 'APP',
    icao: 'ESSB',
  },
  {
    callsign: 'ESSB_ATIS',
    name: 'Bromma ATIS',
    frequency: '122.455',
    sectorCode: 'ATSB',
    facilityType: 'ATIS',
    icao: 'ESSB',
  },
  {
    callsign: 'ESSB_GND',
    name: 'Bromma Ground',
    frequency: '121.605',
    sectorCode: 'SBG',
    facilityType: 'GND',
    icao: 'ESSB',
  },
  {
    callsign: 'ESSB_TWR',
    name: 'Bromma Tower',
    frequency: '118.105',
    sectorCode: 'SB',
    facilityType: 'TWR',
    icao: 'ESSB',
  },

  // --- 47) ESSD (Borlänge) ---
  {
    callsign: 'ESSD_TWR',
    name: 'Borlänge Tower',
    frequency: '127.305',
    sectorCode: 'SD',
    facilityType: 'TWR',
    icao: 'ESSD',
  },

  // --- 48) ESSL (Linköping Saab) ---
  {
    callsign: 'ESSL_TWR',
    name: 'Saab Tower',
    frequency: '118.805',
    sectorCode: 'SL',
    facilityType: 'TWR',
    icao: 'ESSL',
  },

  // --- 49) ESSP (Norrköping) ---
  {
    callsign: 'ESSP_APP',
    name: 'Östgöta Approach',
    frequency: '132.955',
    sectorCode: 'OKC',
    facilityType: 'APP',
    icao: 'ESSP',
  },
  {
    callsign: 'ESSP_TWR',
    name: 'Kungsängen Tower',
    frequency: '120.355',
    sectorCode: 'SP',
    facilityType: 'TWR',
    icao: 'ESSP',
  },

  // --- 50) ESSR_CTR (RTC Stockholm) ---
  {
    callsign: 'ESSR_CTR',
    name: 'RTC Stockholm',
    frequency: '130.900',
    sectorCode: 'RTC',
    facilityType: 'CTR',
    icao: 'ESSR',
  },

  // --- 51) ESSR_MM_APP (RTC Malmö) ---
  {
    callsign: 'ESSR_MM_APP',
    name: 'RTC Malmö',
    frequency: '122.325',
    sectorCode: 'RTM',
    facilityType: 'APP',
    icao: 'ESSR',
  },

  // --- 52) ESST (Torsby) ---
  {
    callsign: 'ESST_I_TWR',
    name: 'Torsby Information',
    frequency: '122.055',
    sectorCode: 'ST',
    facilityType: 'TWR',
    icao: 'ESST',
  },

  // --- 53) ESSU (Eskilstuna) ---
  {
    callsign: 'ESSU_I_TWR',
    name: 'Eskilstuna Information',
    frequency: '126.855',
    sectorCode: 'SU',
    facilityType: 'TWR',
    icao: 'ESSU',
  },

  // --- 54) ESSV (Visby) ---
  {
    callsign: 'ESSV_APP',
    name: 'Visby Approach',
    frequency: '126.155',
    sectorCode: 'SVA',
    facilityType: 'APP',
    icao: 'ESSV',
  },
  {
    callsign: 'ESSV_TWR',
    name: 'Visby Tower',
    frequency: '120.305',
    sectorCode: 'SV',
    facilityType: 'TWR',
    icao: 'ESSV',
  },

  // --- 55) ESTA (Ängelholm) ---
  {
    callsign: 'ESTA_APP',
    name: 'Ängelholm Approach',
    frequency: '132.455',
    sectorCode: 'TAA',
    facilityType: 'APP',
    icao: 'ESTA',
  },
  {
    callsign: 'ESTA_TWR',
    name: 'Ängelholm Tower',
    frequency: '127.105',
    sectorCode: 'TA',
    facilityType: 'TWR',
    icao: 'ESTA',
  },

  // --- 56) ESTL (Ljungbyhed) ---
  {
    callsign: 'ESTL_APP',
    name: 'Ljungbyhed Approach',
    frequency: '129.555',
    sectorCode: 'TLA',
    facilityType: 'APP',
    icao: 'ESTL',
  },
  {
    callsign: 'ESTL_ATIS',
    name: 'Ljungbyhed ATIS',
    frequency: '132.755',
    sectorCode: 'ATTL',
    facilityType: 'ATIS',
    icao: 'ESTL',
  },
  {
    callsign: 'ESTL_GND',
    name: 'Ljungbyhed Ground',
    frequency: '121.655',
    sectorCode: 'TLG',
    facilityType: 'GND',
    icao: 'ESTL',
  },
  {
    callsign: 'ESTL_TWR',
    name: 'Ljungbyhed Tower',
    frequency: '130.705',
    sectorCode: 'TL',
    facilityType: 'TWR',
    icao: 'ESTL',
  },

  // --- 57) ESUP (Pajala) ---
  {
    callsign: 'ESUP_I_TWR',
    name: 'Pajala Information',
    frequency: '118.380',
    sectorCode: 'UP',
    facilityType: 'TWR',
    icao: 'ESUP',
  },

  // --- 58) ESUT (Hemavan) ---
  {
    callsign: 'ESUT_I_TWR',
    name: 'Hemavan Information',
    frequency: '122.980',
    sectorCode: 'UT',
    facilityType: 'TWR',
    icao: 'ESUT',
  },
]
