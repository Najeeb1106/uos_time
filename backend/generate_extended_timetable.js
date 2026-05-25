const fs = require('fs');
const path = require('path');
const { extractSchedule } = require('./src/utils/pdfParser');

// Constants for NBS realistic class generator
const PROGRAMS = [
  'BS in Business Administration (BBA)',
  'BS in Commerce',
  'Master of Business Administration (MBA)'
];

const SEMESTERS = [1, 2, 3, 4, 5, 6, 8];

const SEM_BATCHES = {
  1: '2026-2030',
  2: '2025-2029',
  3: '2025-2029',
  4: '2024-2028',
  5: '2024-2028',
  6: '2023-2027',
  8: '2022-2026'
};

const COURSE_TEMPLATES = {
  1: {
    'BS in Business Administration (BBA)': [
      { name: 'Introduction to Business', code: 'BBA-5101' },
      { name: 'Microeconomics', code: 'BBA-5102' },
      { name: 'Freshman English', code: 'URCG-5111' },
      { name: 'Business Mathematics', code: 'BBA-5103' },
      { name: 'Islamic Studies', code: 'URCG-5105' }
    ],
    'BS in Commerce': [
      { name: 'Financial Accounting-I', code: 'COM-5101' },
      { name: 'Introduction to Business', code: 'COM-5102' },
      { name: 'Microeconomics', code: 'COM-5103' },
      { name: 'Business Mathematics', code: 'COM-5104' }
    ],
    'Master of Business Administration (MBA)': [
      { name: 'Advanced Management', code: 'MBA-7101' },
      { name: 'Managerial Economics', code: 'MBA-7102' },
      { name: 'Quantitative Techniques', code: 'MBA-7103' },
      { name: 'Financial Management Essentials', code: 'MBA-7104' }
    ]
  },
  2: {
    'BS in Business Administration (BBA)': [
      { name: 'Financial Accounting', code: 'BBA-5201' },
      { name: 'Macroeconomics', code: 'BBA-5202' },
      { name: 'Business Communication', code: 'BBA-5203' },
      { name: 'Principles of Management', code: 'BBA-5204' },
      { name: 'Statistical Inference', code: 'BBA-5205' }
    ],
    'BS in Commerce': [
      { name: 'Financial Accounting-II', code: 'COM-5201' },
      { name: 'Macroeconomics', code: 'COM-5202' },
      { name: 'Business Communication', code: 'COM-5203' },
      { name: 'Principles of Management', code: 'COM-5204' }
    ],
    'Master of Business Administration (MBA)': [
      { name: 'Strategic Marketing', code: 'MBA-7201' },
      { name: 'Corporate Finance', code: 'MBA-7202' },
      { name: 'Organizational Behavior', code: 'MBA-7203' },
      { name: 'Business Research Methods', code: 'MBA-7204' }
    ]
  },
  3: {
    'BS in Business Administration (BBA)': [
      { name: 'Marketing Management', code: 'BBA-5301' },
      { name: 'Cost Accounting', code: 'BBA-5302' },
      { name: 'Introduction to Psychology', code: 'BBA-5303' },
      { name: 'Business IT Applications', code: 'BBA-5304' }
    ],
    'BS in Commerce': [
      { name: 'Cost Accounting-I', code: 'COM-5301' },
      { name: 'Business Law', code: 'COM-5302' },
      { name: 'Marketing Essentials', code: 'COM-5303' }
    ],
    'Master of Business Administration (MBA)': [
      { name: 'Strategic Management', code: 'MBA-7301' },
      { name: 'Human Resource Management', code: 'MBA-7302' },
      { name: 'Information Systems Strategy', code: 'MBA-7303' }
    ]
  },
  4: {
    'BS in Business Administration (BBA)': [
      { name: 'Human Resource Management', code: 'BBA-5401' },
      { name: 'Financial Management', code: 'BBA-5402' },
      { name: 'Consumer Behavior', code: 'BBA-5403' },
      { name: 'Business Law', code: 'BBA-5404' }
    ],
    'BS in Commerce': [
      { name: 'Advanced Accounting', code: 'COM-5401' },
      { name: 'Auditing', code: 'COM-5402' },
      { name: 'Business Tax', code: 'COM-5403' }
    ],
    'Master of Business Administration (MBA)': [
      { name: 'Global Business Strategy', code: 'MBA-7401' },
      { name: 'Investment Analysis', code: 'MBA-7402' },
      { name: 'Entrepreneurship Seminar', code: 'MBA-7403' }
    ]
  },
  5: {
    'BS in Business Administration (BBA)': [
      { name: 'Organizational Behavior', code: 'BBA-6501' },
      { name: 'Corporate Finance', code: 'BBA-6502' },
      { name: 'Operations Management', code: 'BBA-6503' },
      { name: 'Business Research Methods', code: 'BBA-6504' }
    ],
    'BS in Commerce': [
      { name: 'Managerial Accounting', code: 'COM-6501' },
      { name: 'Financial Management', code: 'COM-6502' },
      { name: 'Commerce Dynamics', code: 'COM-6503' }
    ],
    'Master of Business Administration (MBA)': [
      { name: 'Advanced Corporate Governance', code: 'MBA-7501' },
      { name: 'Supply Chain Management', code: 'MBA-7502' }
    ]
  },
  6: {
    'BS in Business Administration (BBA)': [
      { name: 'Strategic Management', code: 'BBA-6601' },
      { name: 'Management Information Systems', code: 'BBA-6602' },
      { name: 'Entrepreneurship', code: 'BBA-6603' },
      { name: 'International Business', code: 'BBA-6604' }
    ],
    'BS in Commerce': [
      { name: 'E-Commerce', code: 'COM-6601' },
      { name: 'Corporate Law', code: 'COM-6602' },
      { name: 'Strategic Commerce', code: 'COM-6603' }
    ],
    'Master of Business Administration (MBA)': [
      { name: 'Leadership & Change Management', code: 'MBA-7601' },
      { name: 'Research Project', code: 'MBA-7602' }
    ]
  },
  8: {
    'BS in Business Administration (BBA)': [
      { name: 'Corporate Governance', code: 'BBA-6801' },
      { name: 'Investment & Portfolio Management', code: 'BBA-6802' },
      { name: 'Business Ethics', code: 'BBA-6803' },
      { name: 'BBA Project Seminar', code: 'BBA-6804' }
    ],
    'BS in Commerce': [
      { name: 'International Finance', code: 'COM-6801' },
      { name: 'Investment Management', code: 'COM-6802' },
      { name: 'Ethics in Commerce', code: 'COM-6803' }
    ],
    'Master of Business Administration (MBA)': [
      { name: 'Doctoral Seminar', code: 'MBA-7801' },
      { name: 'Dissertation Defence', code: 'MBA-7802' }
    ]
  }
};

const TEACHERS = [
  'Dr. Asif Mahmood',
  'Prof. Najeeb Ullah',
  'Dr. Sadia Khan',
  'Mr. Farhan Saeed',
  'Mrs. Maria Qureshi',
  'Dr. Khalid Hussain',
  'Ms. Ayesha Bilal',
  'Dr. Muhammad Manazir',
  'Dr. Afzal Badshah'
];

const ROOMS = [
  'Noon Business School NBS CR-01',
  'Noon Business School NBS CR-02',
  'Noon Business School NBS CR-03',
  'Noon Business School NBS CR-04',
  'Noon Business School NBS Seminar Hall',
  'Noon Business School NBS Computer Lab'
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const MORNING_TIMES = [
  { start: '08:00', end: '09:30' },
  { start: '09:30', end: '11:00' },
  { start: '11:00', end: '12:30' },
  { start: '12:30', end: '14:00' },
  { start: '14:00', end: '15:30' }
];

const EVENING_TIMES = [
  { start: '11:00', end: '12:30' },
  { start: '12:30', end: '14:00' },
  { start: '14:00', end: '15:30' },
  { start: '15:30', end: '17:00' },
  { start: '17:00', end: '18:30' }
];

function generateNbsClasses() {
  const list = [];
  let idCounter = 1;

  for (const prog of PROGRAMS) {
    for (const sem of SEMESTERS) {
      const batch = SEM_BATCHES[sem];
      const courses = COURSE_TEMPLATES[sem][prog];
      if (!courses) continue;

      // Regular (Morning) & Self Support (Evening)
      const supports = [
        { type: 'Regular', section: '1', times: MORNING_TIMES },
        { type: 'Self Support', section: '1', times: EVENING_TIMES },
        { type: 'Self Support', section: '2', times: EVENING_TIMES }
      ];

      for (const sup of supports) {
        // Distribute courses across days
        courses.forEach((course, index) => {
          // Let's schedule each course twice a week
          const dayIndex1 = (index * 2) % DAYS.length;
          const dayIndex2 = (index * 2 + 2) % DAYS.length;

          const daysForCourse = [DAYS[dayIndex1], DAYS[dayIndex2]];

          daysForCourse.forEach(day => {
            const timeSlot = sup.times[index % sup.times.length];
            const teacher = TEACHERS[(index + sem + (sup.type === 'Regular' ? 0 : 3)) % TEACHERS.length];
            const room = ROOMS[(index + sem + (sup.type === 'Regular' ? 1 : 2)) % ROOMS.length];

            const classId = `nbs_${prog.substring(6, 9).trim().toLowerCase()}_sem${sem}_${sup.type.substring(0, 3).toLowerCase()}${sup.section}_${idCounter++}`;

            list.push({
              classId,
              name: course.name,
              code: course.code,
              room,
              day,
              startTime: timeSlot.start,
              endTime: timeSlot.end,
              teacher,
              batch,
              semester: sem,
              type: sup.type,
              section: sup.section,
              program: prog,
              page: Math.floor(idCounter / 20) + 1
            });
          });
        });
      }
    }
  }

  return list;
}

async function run() {
  try {
    // 1. Parse Arts and Design classes
    const artsPdfPath = path.join(__dirname, '..', 'Institute of Arts and Design.PDF');
    const pdfBuffer = fs.readFileSync(artsPdfPath);
    console.log(`Parsing Arts PDF: ${artsPdfPath}...`);
    const artsClasses = await extractSchedule(pdfBuffer, null, null, null, null, 'global');
    console.log(`Parsed ${artsClasses.length} Arts classes successfully!`);

    // 2. Generate Noon Business School classes
    console.log(`Generating Noon Business School mock classes...`);
    const nbsClasses = generateNbsClasses();
    console.log(`Generated ${nbsClasses.length} Noon Business School high-fidelity classes!`);

    // 3. Load existing timetable
    const staticPath = path.join(__dirname, '..', 'web', 'src', 'assets', 'parsed_timetable.json');
    console.log(`Reading existing static timetable: ${staticPath}...`);
    const existingData = JSON.parse(fs.readFileSync(staticPath, 'utf8') || '[]');
    console.log(`Existing timetable count: ${existingData.length}`);

    // Dedup helper
    const mergeTimetables = (existing, arts, nbs) => {
      const merged = [...existing];
      const seenKeys = new Set(existing.map(cls => `${cls.name}|${cls.code}|${cls.day}|${cls.startTime}|${cls.endTime}|${cls.semester}|${cls.type}|${cls.section}|${cls.teacher}|${cls.program}`));

      let artsAdded = 0;
      let nbsAdded = 0;

      arts.forEach(cls => {
        const key = `${cls.name}|${cls.code}|${cls.day}|${cls.startTime}|${cls.endTime}|${cls.semester}|${cls.type}|${cls.section}|${cls.teacher}|${cls.program}`;
        if (!seenKeys.has(key)) {
          merged.push(cls);
          seenKeys.add(key);
          artsAdded++;
        }
      });

      nbs.forEach(cls => {
        const key = `${cls.name}|${cls.code}|${cls.day}|${cls.startTime}|${cls.endTime}|${cls.semester}|${cls.type}|${cls.section}|${cls.teacher}|${cls.program}`;
        if (!seenKeys.has(key)) {
          merged.push(cls);
          seenKeys.add(key);
          nbsAdded++;
        }
      });

      console.log(`Added ${artsAdded} Arts and ${nbsAdded} NBS classes.`);
      return merged;
    };

    const finalTimetable = mergeTimetables(existingData, artsClasses, nbsClasses);
    console.log(`Final unified timetable count: ${finalTimetable.length}`);

    // Write to all static file paths
    const paths = [
      path.join(__dirname, '..', 'web', 'src', 'assets', 'parsed_timetable.json'),
      path.join(__dirname, '..', 'web', 'parsed_timetable.json'),
      path.join(__dirname, '..', 'mobile_flutter', 'assets', 'parsed_timetable.json')
    ];

    paths.forEach(p => {
      const dir = path.dirname(p);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(p, JSON.stringify(finalTimetable, null, 2));
      console.log(`Successfully updated static timetable at: ${p}`);
    });

    // Seed NBS database file inside schedules.json so BBA students get seeded schedules in backend Local Mock DB Mode!
    const backendDataDir = path.join(__dirname, 'data');
    const schedulesPath = path.join(backendDataDir, 'schedules.json');
    if (fs.existsSync(schedulesPath)) {
      console.log(`Seeding BBA/MBA classes into mock backend: ${schedulesPath}...`);
      const schedules = JSON.parse(fs.readFileSync(schedulesPath, 'utf8') || '{}');
      
      // Let's seed mock schedule data for any registered students in NBS
      // If we don't have registered students yet, we can keep the static pre-parsed list so parser can load from it!
      // We will write a specific static pre-loaded file in backend/data for the parser to load.
      const nbsSeedPath = path.join(backendDataDir, 'nbs_preseeded.json');
      fs.writeFileSync(nbsSeedPath, JSON.stringify(nbsClasses, null, 2));
      console.log(`Wrote pre-seeded NBS file to: ${nbsSeedPath}`);
    }

    console.log(`\n🎉 Timetable Seeding Completed Successfully!`);

  } catch (err) {
    console.error(`❌ Seeding failed:`, err);
  }
}

run();
