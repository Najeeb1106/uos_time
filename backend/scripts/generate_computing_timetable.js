const fs = require('fs');
const path = require('path');
const { extractSchedule } = require('../src/utils/pdfParser');

async function run() {
  try {
    console.log('🔄 Starting generation of clean Computing Timetable database...');

    // 1. Parse Class Timetable CS.pdf
    const csPdfPath = path.join(__dirname, '..', 'Class Timetable CS.pdf');
    if (!fs.existsSync(csPdfPath)) {
      throw new Error(`CS Timetable PDF not found at: ${csPdfPath}`);
    }
    console.log(`Parsing CS Timetable PDF: ${csPdfPath}...`);
    const csBuffer = fs.readFileSync(csPdfPath);
    const csClasses = await extractSchedule(csBuffer, null, null, null, null, 'global');
    console.log(`Parsed ${csClasses.length} CS/IT/AI/DS classes successfully!`);

    // 2. Parse Class Timetable SE.pdf
    const sePdfPath = path.join(__dirname, '..', 'Class Timetable SE.pdf');
    if (!fs.existsSync(sePdfPath)) {
      throw new Error(`SE Timetable PDF not found at: ${sePdfPath}`);
    }
    console.log(`Parsing SE Timetable PDF: ${sePdfPath}...`);
    const seBuffer = fs.readFileSync(sePdfPath);
    const seClasses = await extractSchedule(seBuffer, null, null, null, null, 'global');
    console.log(`Parsed ${seClasses.length} SE classes successfully!`);

    // 3. Merge & Dedup
    const merged = [];
    const seenKeys = new Set();

    const addClasses = (list, sourceName) => {
      let added = 0;
      list.forEach(cls => {
        // Dedup key based on key parameters
        const key = `${cls.name}|${cls.code}|${cls.day}|${cls.startTime}|${cls.endTime}|${cls.semester}|${cls.type}|${cls.section}|${cls.teacher}|${cls.program}`;
        if (!seenKeys.has(key)) {
          merged.push(cls);
          seenKeys.add(key);
          added++;
        }
      });
      console.log(`Merged ${added} unique classes from ${sourceName}.`);
    };

    addClasses(csClasses, 'Class Timetable CS.pdf');
    addClasses(seClasses, 'Class Timetable SE.pdf');

    console.log(`Total clean computing classes: ${merged.length}`);

    // 4. Overwrite all static reference json assets
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
      fs.writeFileSync(p, JSON.stringify(merged, null, 2));
      console.log(`✓ Updated static database asset at: ${p}`);
    });

    console.log('\n🎉 Clean Computing Timetable database created successfully!');
  } catch (err) {
    console.error('❌ Failed to generate clean computing timetable:', err);
  }
}

run();
