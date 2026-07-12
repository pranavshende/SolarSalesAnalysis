const xlsx = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');
const prisma = require('../config/prisma');

const UTILITY_SHARE = 0.80;
const ROOFTOP_SHARE = 0.20;
const UTILITY_COST_PER_KW = 4.0 / 1000; // Cr per kW
const ROOFTOP_COST_PER_KW = 0.5 / 1000; // Cr per kW

const processFile = async (filePath, fileType, userId) => {
  const datasetVersion = `v_${Date.now()}`;
  let rawData = [];

  if (fileType === 'xlsx') {
    rawData = processExcel(filePath);
  } else {
    rawData = await processCSV(filePath);
  }

  const processedData = normalizeData(rawData, datasetVersion, userId);
  await prisma.solarData.createMany({
    data: processedData,
    skipDuplicates: true
  });
  
  return {
    version: datasetVersion,
    count: processedData.length
  };
};

const processExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
};

const processCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

const normalizeData = (rawData, version, userId) => {
  const normalized = [];

  rawData.forEach((row) => {
    // Basic normalization of keys (case insensitive, space removal)
    const normalizedRow = {};
    Object.keys(row).forEach(key => {
      const cleanKey = key.toString().trim();
      normalizedRow[cleanKey] = row[key];
    });

    const state = normalizedRow['State'] || normalizedRow['State Name'] || 'Unknown';
    const city = normalizedRow['City'] || normalizedRow['City Name'] || normalizedRow['Solar Park Name'] || 'All';

    // If it's the long format from solar_sales_analysis.csv
    if (normalizedRow['Solar_kW'] !== undefined && normalizedRow['Year'] !== undefined) {
      const year = parseInt(normalizedRow['Year']);
      const capacity_kW = parseFloat(normalizedRow['Solar_kW']) || 0;
      const revenue_Cr = parseFloat(normalizedRow['Revenue_Cr']) || 0;
      
      if (capacity_kW > 0 || revenue_Cr > 0) {
        normalized.push({
          state: state.trim(),
          city: city.trim(),
          year: year,
          capacity_kW: capacity_kW,
          revenue_Cr: revenue_Cr,
          datasetVersion: version,
          uploadedBy: userId
        });
      }
    } else {
      // Handle wide format columns that look like years (2014, 2015(MW), etc.)
      const sortedYears = Object.keys(normalizedRow)
        .map(key => {
          const match = key.match(/(\d{4})/);
          return match ? { key, year: parseInt(match[1]) } : null;
        })
        .filter(x => x)
        .sort((a, b) => a.year - b.year);

      let prevCapacityMW = 0;

      sortedYears.forEach(({ key, year }) => {
        let cumulativeCapacityMW = parseFloat(normalizedRow[key]) || 0;
        let addedCapacityMW = Math.max(0, cumulativeCapacityMW - prevCapacityMW);
        prevCapacityMW = cumulativeCapacityMW;
        
        // Convert to kW
        const cumulativeCapacityKW = cumulativeCapacityMW * 1000;
        const addedCapacityKW = addedCapacityMW * 1000;

        // Calculate Revenue (Cr) based on ANNUAL added capacity, not cumulative!
        const revenue_Cr = (addedCapacityKW * UTILITY_SHARE * UTILITY_COST_PER_KW) +
                           (addedCapacityKW * ROOFTOP_SHARE * ROOFTOP_COST_PER_KW);

        if (cumulativeCapacityKW > 0 || revenue_Cr > 0) {
          normalized.push({
            state: state.trim(),
            city: city.trim(),
            year: year,
            capacity_kW: cumulativeCapacityKW,
            revenue_Cr: revenue_Cr,
            datasetVersion: version,
            uploadedBy: userId
          });
        }
      });
    }
  });

  return normalized;
};

module.exports = { processFile };
