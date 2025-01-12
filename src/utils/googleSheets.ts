/**
 * Google Sheets API Utilities
 * @module googleSheets
 * @description Provides functions for fetching and processing data from Google Sheets
 * @see {@link https://developers.google.com/sheets/api}
 */

/**
 * Cache implementation with versioning
 * @type {Map<string, { data: any, timestamp: number, version: number }>}
 * @description 
 * - Key: `${sheetId}-${gid}` 
 * - Value: { data: processed sheet data, timestamp: last fetch time, version: cache version }
 */
const cache = new Map<string, { data: any, timestamp: number, version: number }>();
/**
 * Cache structure details:
 * - Key format: `${sheetId}-${gid}`
 * - Value structure:
 *   - data: Processed sheet data
 *   - timestamp: Last fetch time in milliseconds
 *   - version: Cache version number for change tracking
 * - Cache invalidation occurs:
 *   - After POLL_INTERVAL (1 minute)
 *   - On webhook updates
 *   - When version changes
 */

/**
 * Current cache version
 * @type {number}
 * @description Incremented with each cache update to track changes
 */
let currentVersion = 0;

/**
 * Polling interval for cache refresh
 * @constant {number}
 * @default 60000 (1 minute)
 */
const POLL_INTERVAL = 1 * 60 * 1000;

/**
 * Last modified timestamp
 * @type {number}
 * @description Tracks when the sheet data was last updated
 */
let lastModified = Date.now();

/**
 * Fetches and processes data from a Google Sheet
 * @async
 * @function getGoogleSheetData
 * @param {string} sheetId - The ID of the Google Sheet
 * @param {string} [gid='0'] - The grid ID of the specific sheet tab
 * @returns {Promise<Array<Object>>} - Processed data from the sheet
 * @throws Will throw an error if the request fails
 * @example
 * const data = await getGoogleSheetData('1A2B3C4D5E6F7G8H9I0J');
 */
export async function getGoogleSheetData(sheetId: string, gid: string = '0') {
  /**
   * Data fetching workflow:
   * 1. Check cache for existing data
   * 2. If cache is stale or missing:
   *    - Fetch fresh data from Google Sheets
   *    - Parse and transform response
   *    - Update cache with new version
   * 3. Return processed data
   * 
   * Error handling:
   * - Invalid sheet IDs return empty array
   * - Network errors are logged and return empty array
   * - Malformed responses are logged and return empty array
   */
  const cacheKey = `${sheetId}-${gid}`;
  
  // Check if we need to refresh
  const now = Date.now();
  const shouldRefresh = !cache.has(cacheKey) || 
    (now - lastModified) > POLL_INTERVAL;

  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`;
    console.log('Fetching Google Sheet from:', url);
    
    const response = await fetch(url);
    const text = await response.text();
    console.log('Raw Google Sheets response:', text);
    
    // Remove the prefix and suffix from the response
    const json = JSON.parse(text.substring(47).slice(0, -2));
    console.log('Parsed JSON:', json);
    
    // Convert the Google Sheets data to a more usable format
    const rows = json.table.rows;
    const headers = json.table.cols.map((col: any) => col.label?.toString().toLowerCase().replace(/\s+/g, '_') || '');
    console.log('Headers:', headers);
    
    const data = rows.map((row: any) => {
      const obj: any = {};
      const cells = row.c;
      
      // Map new column structure
      obj.evento = cells[0]?.v || null; // Title (A)
      
      // Parse date and time from separate columns
      const dateStr = cells[1]?.v || '';
      const timeStr = cells[2]?.v || '';
      
      // Parse date
      if (dateStr) {
        const [day, month, year] = dateStr.split('/').map(Number);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          obj.date = new Date(Date.UTC(year, month - 1, day));
        } else {
          console.warn('Invalid date format in row:', row);
          obj.date = null;
        }
      } else {
        obj.date = null;
      }
      
      // Parse time
      if (timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          obj.time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        } else {
          console.warn('Invalid time format in row:', row);
          obj.time = null;
        }
      } else {
        obj.time = null;
      }
      
      obj.local = cells[3]?.v || null; // Location (D)
      obj.tipo_evento = cells[4]?.v || null; // Type (E)
      obj.url = cells[5]?.v || null; // URL (F)
      obj.flyer = cells[6]?.v || null; // Image URL (G)
      
      return obj;
    });
    
    console.log('Transformed data:', JSON.stringify(data, null, 2));
    console.log('First 3 rows:', JSON.stringify(data.slice(0, 3), null, 2));
    
    // Update cache with new version
    const newVersion = currentVersion + 1;
    currentVersion = newVersion;
    lastModified = Date.now();
    
    cache.set(cacheKey, { 
      data, 
      timestamp: lastModified,
      version: newVersion
    });
    
    return data;
  } catch (error) {
    /**
     * Error handling:
     * - Logs detailed error information
     * - Returns empty array to prevent app crashes
     * - Preserves existing cache if available
     * - Includes error type and stack trace
     */
    if (error instanceof Error) {
      console.error('Error fetching Google Sheet data:', {
        message: error.message,
        stack: error.stack,
        type: error.name,
        timestamp: Date.now()
      });
    } else {
      console.error('Unknown error fetching Google Sheet data:', error);
    }
    return cache.get(cacheKey)?.data || [];
  }
}

/**
 * Handles webhook updates from Google Sheets
 * @async
 * @function handleWebhookUpdate
 * @param {string} sheetId - The ID of the Google Sheet
 * @param {string} [gid='0'] - The grid ID of the specific sheet tab
 * @returns {Promise<Array<Object>>} - Updated data from the sheet
 * @description Invalidates cache and optionally triggers a new fetch
 * @example
 * await handleWebhookUpdate('1A2B3C4D5E6F7G8H9I0J');
 */
/**
 * Updates Google Sheet with new data
 * @async
 * @function updateGoogleSheet
 * @param {string} sheetId - The ID of the Google Sheet
 * @param {Array<Object>} data - Array of event data to update
 * @returns {Promise<void>}
 * @throws Will throw an error if the update fails
 */
/**
 * Updates Google Sheet with new data
 * @async
 * @function updateGoogleSheet
 * @param {string} sheetId - The ID of the Google Sheet
 * @param {Array<Object>} data - Array of event data to update
 * @returns {Promise<void>}
 * @throws Will throw an error if the update fails
 * @todo Implement Google Sheets API update functionality
 */
export async function updateGoogleSheet(sheetId: string, data: any[]) {
  // TODO: Implement Google Sheets API update functionality
  console.log('Updating Google Sheet:', sheetId);
  console.log('Data to update:', data);
}

export async function handleWebhookUpdate(sheetId: string, gid: string = '0') {
  const cacheKey = `${sheetId}-${gid}`;
  cache.delete(cacheKey); // Invalidate cache
  console.log(`Cache invalidated for ${cacheKey}`);
  
  // Optionally trigger a new fetch
  return getGoogleSheetData(sheetId, gid);
}
