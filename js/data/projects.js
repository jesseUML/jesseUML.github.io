// Content for the finished project gallery and the active workbench.
//
// status decides where a project appears:
//   'wip'       -> on its workbench spot in the workshop (spots: BENCH_SLOTS in js/game/rooms.js)
//   'completed' -> framed in the gallery, in the order listed here
// To finish a project: change status to 'completed', update `code` (the dialog
// label, e.g. 'EXHIBIT 03 / REV 1'), and point displaySrc at your best photo.
// wallTitle (optional) is the short name on its gallery frame.
export const projects = [
  {
    id: 'stm32-card',
    title: 'STM32 LED Business Card',
    code: 'EXHIBIT 01 / REV 1',
    status: 'completed', art: 'led-card', wallTitle: 'STM32 BUSINESS CARD',
    displaySrc: './assets/images/projects/stm32-rev1-components.webp',
    // featured: shown as a card below the studio. highlight is the one-line hook.
    featured: {cover: './assets/images/projects/stm32-rev1-components.webp', highlight: '64 LEDs, an IMU, and an STM32 on a card that fits in a wallet.'},
    summary: 'A pocket-sized portfolio: a custom PCB, an 8×8 LED matrix, and motion-reactive firmware.',
    description: 'Designed around the STM32G030 microcontroller with a multiplexed LED matrix and a six-axis inertial sensor. Different animations and interactions turn a business card into something you can actually demo.',
    lessons: 'Small footprints, decoupling placement, LED brightness, and physical rework all matter. Several revisions taught me more than the first successful power-on.',
    tags: ['STM32G030', 'Embedded C', 'IMU', 'PCB Layout'],
    photos: [
      {src:'./assets/images/projects/stm32-rev1-components.webp',caption:'Rev 1 — populated front with STM32, LED array, and coin-cell holder'},
      {src:'./assets/images/projects/stm32-rev1-qr.webp',caption:'Rev 1 — back with QR code and contact details'}
    ],
    github: ''
  },
  {
    id: 'team-fishies',
    title: 'Team Fishies Line Follower',
    code: 'EXHIBIT 02 / SMTA',
    status: 'completed', art: 'robot', wallTitle: 'TEAM FISHIES',
    displaySrc: './assets/images/projects/team-fishies-3d.webp',
    featured: {cover: './assets/images/projects/team-fishies-mentor-giant-check.webp', coverPosition: 'center 40%', highlight: 'Tied for first in round 1, then won round 3 outright at the SMTA Bright Manufacturing Challenge.'},
    summary: 'A custom PIC18-based line-following robot built for the SMTA Bright Manufacturing Challenge.',
    description: 'Worked with Team Fishies to develop the electronics for a line follower using optical sensors, motor drivers, and a PIC18F47Q43. The project combined schematic capture, PCB layout, firmware, assembly, and real-world testing.',
    lessons: 'We tied for first in round 1 and won first place outright in round 3. Layout reviews reinforced the importance of trace widths, silkscreen clearances, sensor placement, and getting eyes on the board before fabrication.',
    tags: ['PIC18F47Q43', 'Altium', 'Robotics', 'SMTA'],
    photos: [
      {src:'./assets/images/projects/team-fishies-3d.webp',caption:'Competition board — 3D assembly view with motors and sensor wing'},
      {src:'./assets/images/projects/team-fishies-layout.webp',caption:'Competition board — routed top-layer layout screenshot'},
      {src:'./assets/images/projects/team-fishies-final-time.webp',caption:'The team in front of our final time'},
      {src:'./assets/images/projects/team-fishies-mentor-giant-check.webp',caption:'Our team and our mentor with the giant check after winning round 3'}
    ],
    github: 'https://github.com/NeilPraj/TeamFishy'
  },
  {
    id: 'nfc-card',
    title: 'NFC Business Card V2.01',
    code: 'BENCH 01 / IN PROGRESS',
    status: 'wip', art: 'nfc',
    displaySrc: './assets/images/projects/nfc-kicad-front.webp',
    featured: {cover: './assets/images/projects/nfc-kicad-front.webp', highlight: 'Designed to tap with a phone. Shake it to switch which profile it shares.'},
    summary: 'A new take on the electronic business card, with NFC, motion sensing, and discrete LED animations.',
    description: 'The next board combines an NXP NT3H2111 NFC tag, LIS2DW12 accelerometer, and LP5024 LED driver. The antenna and compact layout are important parts of the design.',
    lessons: 'Current focus: antenna/annular-ring clearance, component placement, power budget, and moving from board design into validation. Status and specifications can be edited as the build develops.',
    tags: ['NFC', 'LIS2DW12', 'LP5024', 'PCB Design'],
    photos: [
      {src:'./assets/images/projects/nfc-kicad-front.webp',caption:'KiCad render — front with NFC IC, LED components, and hardware'},
      {src:'./assets/images/projects/nfc-kicad-back.webp',caption:'KiCad render — contact/QR back of the NFC card'}
    ],
    github: ''
  },
  {
    id: 'mcu-cluster',
    title: 'Modular MCU Cluster',
    code: 'BENCH 02 / CONCEPT',
    status: 'wip', art: 'cluster',
    summary: 'Architecture study: a supervisor, manager controllers, and modular worker-MCU cards.',
    description: 'A supervisor/manager/worker architecture, with plug-in worker modules and a shared parallel bus. The long-term goal is a fun, visual demonstration of distributed computation on tiny processors.',
    lessons: 'The blueprint is conceptual, not a photo of a manufactured module. I am exploring bus timing, addressing, programming access, signal integrity, and whether a raycaster demo can show distributed MCU computation.',
    tags: ['STM32', 'Digital Design', 'Bus Protocol', 'Hardware'],
    github: ''
  },
  {
    id: 'capstone-controller',
    title: 'Capstone Control Electronics',
    code: 'BENCH 03 / PROTOTYPE',
    status: 'wip', art: 'controller', wallTitle: 'CAPSTONE ELECTRONICS',
    // Placeholder photos. Replace these three files with real photos (any
    // landscape image works; 16:10 fits the frames best), or change the paths
    // and captions here. The first photo is the one shown on the bench.
    displaySrc: './assets/images/projects/capstone-photo-1.webp',
    photos: [
      {src:'./assets/images/projects/capstone-photo-1.webp',caption:'Remote controller — photo coming soon'},
      {src:'./assets/images/projects/capstone-photo-2.webp',caption:'Receiver and power board — photo coming soon'},
      {src:'./assets/images/projects/capstone-photo-3.webp',caption:'Installed system — photo coming soon'}
    ],
    summary: 'Wireless controls and power electronics for a more accessible car-washing system.',
    description: 'Designed around an ESP32-based remote control and receiver, with attention to motor control, power distribution, solenoid switching, and independent safety provisions.',
    lessons: 'Ongoing engineering work includes protection components, PCB layout, test planning, and coordination between the electronics and mechanical portions of the system. Only non-confidential details are shared here.',
    tags: ['ESP32', 'Power Electronics', 'Wireless', 'Accessibility'],
    github: ''
  }
];
export const findProject = id => projects.find(project => project.id === id);
