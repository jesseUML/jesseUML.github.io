// Content for the finished project gallery and the active workbench.
// Placement/room interactions live in js/game/rooms.js.
// Set status to "completed" or "wip" to identify wall and bench exhibits.
export const projects = [
  {
    id: 'stm32-card',
    title: 'STM32 LED Business Card',
    code: 'EXHIBIT 01 / REV 1',
    status: 'completed', location: 'wall', art: 'led-card',
    displaySrc: './assets/images/projects/stm32-rev1-front.webp',
    summary: 'A pocket-sized portfolio: a custom PCB, an 8×8 LED matrix, and motion-reactive firmware.',
    description: 'Designed around the STM32G030 microcontroller with a multiplexed LED matrix and a six-axis inertial sensor. Different animations and interactions turn a business card into something you can actually demo.',
    lessons: 'Small footprints, decoupling placement, LED brightness, and physical rework all matter. Several revisions taught me more than the first successful power-on.',
    tags: ['STM32G030', 'Embedded C', 'IMU', 'PCB Layout'],
    photos: [
      {src:'./assets/images/projects/stm32-rev1-front.webp',caption:'Rev 1 — front side with QR/contact layout'},
      {src:'./assets/images/projects/stm32-rev1-back.webp',caption:'Rev 1 — populated side with STM32, LED matrix, and coin-cell holder'}
    ],
    github: ''
  },
  {
    id: 'team-fishies',
    title: 'Team Fishies Line Follower',
    code: 'EXHIBIT 02 / SMTA',
    status: 'completed', location: 'wall', art: 'robot',
    displaySrc: './assets/images/projects/team-fishies-3d.webp',
    summary: 'A custom PIC18-based line-following robot built for the SMTA electronics manufacturing competition.',
    description: 'Worked with Team Fishies to develop the electronics for a line follower using optical sensors, motor drivers, and a PIC18F47Q43. The project combined schematic capture, PCB layout, firmware, assembly, and real-world testing.',
    lessons: 'We tied for first in the PCB design category. Layout reviews reinforced the importance of trace widths, silkscreen clearances, sensor placement, and getting eyes on the board before fabrication.',
    tags: ['PIC18F47Q43', 'Altium', 'Robotics', 'SMTA'],
    photos: [
      {src:'./assets/images/projects/team-fishies-3d.webp',caption:'Competition board — 3D assembly view with motors and sensor wing'},
      {src:'./assets/images/projects/team-fishies-layout.webp',caption:'Competition board — routed top-layer layout screenshot'},
      {src:'./assets/images/projects/team-fishies-final-time.webp',caption:'The team in front of our final time'},
      {src:'./assets/images/projects/team-fishies-mentor-giant-check.webp',caption:'Our team and our mentor with the giant check'}
    ],
    github: 'https://github.com/NeilPraj/TeamFishy'
  },
  {
    id: 'nfc-card',
    title: 'NFC Business Card V2.01',
    code: 'BENCH 01 / IN PROGRESS',
    status: 'wip', location: 'bench', art: 'nfc',
    displaySrc: './assets/images/projects/nfc-kicad-front.webp',
    summary: 'A new take on the electronic business card, with NFC, motion sensing, and discrete LED animations.',
    description: 'The next board combines an NXP NT3H2111 NFC tag, LIS2DW12 accelerometer, and LP5024 LED driver. The antenna and compact layout are important parts of the design.',
    lessons: 'Current focus: antenna/annular-ring clearance, component placement, power budget, and moving from board design into validation. Status and specifications can be edited as the build develops.',
    tags: ['NFC', 'LIS2DW12', 'LP5024', 'PCB Design'],
    photos: [
      {src:'./assets/images/projects/nfc-kicad-front.webp',caption:'KiCad render — NFC card front, LEDs and circuitry'},
      {src:'./assets/images/projects/nfc-kicad-back.webp',caption:'KiCad render — antenna and NFC profile legend'}
    ],
    github: ''
  },
  {
    id: 'mcu-cluster',
    title: 'Modular MCU Cluster',
    code: 'BENCH 02 / CONCEPT',
    status: 'wip', location: 'bench', art: 'cluster',
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
    status: 'wip', location: 'bench', art: 'controller',
    summary: 'Wireless controls and power electronics for a more accessible car-washing system.',
    description: 'Designed around an ESP32-based remote control and receiver, with attention to motor control, power distribution, solenoid switching, and independent safety provisions.',
    lessons: 'Ongoing engineering work includes protection components, PCB layout, test planning, and coordination between the electronics and mechanical portions of the system. Only non-confidential details are shared here.',
    tags: ['ESP32', 'Power Electronics', 'Wireless', 'Accessibility'],
    github: ''
  }
];
export const findProject = id => projects.find(project => project.id === id);
