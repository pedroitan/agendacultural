// Cache implementation with versioning
const cache = new Map<string, { data: any, timestamp: number, version: number }>();
let currentVersion = 0;

// Polling interval (1 minute)
const POLL_INTERVAL = 1 * 60 * 1000;

// Last modified timestamp
let lastModified = Date.now();

export async function getGoogleSheetData(sheetId: string, gid: string = '0') {
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
      row.c.forEach((cell: any, index: number) => {
        // Handle Google Sheets date format
        if (typeof cell?.v === 'string') {
            // Handle date and time parsing
            if (typeof cell.v === 'string') {
              if (cell.f) {
                // Parse formatted date string (dd/MM/yyyy HH:mm:ss)
                const [datePart, timePart] = cell.f.split(' ');
                const [day, month, year] = datePart.split('/').map(Number);
                const [hours, minutes, seconds] = timePart.split(':').map(Number);
                
                // Create date in UTC
                const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
                obj[headers[index]] = date;
              } else {
                // Fallback to raw value parsing
                const dateMatch = cell.v.match(/Date\((\d{4}),(\d+),(\d+),(\d+),(\d+),(\d+)\)/);
                if (dateMatch) {
                  const year = parseInt(dateMatch[1]);
                  const month = parseInt(dateMatch[2]);
                  const day = parseInt(dateMatch[3]);
                  const hours = parseInt(dateMatch[4]);
                  const minutes = parseInt(dateMatch[5]);
                  const seconds = parseInt(dateMatch[6]);
                  const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
                  obj[headers[index]] = date;
                } else {
                  // Try parsing as ISO date string
                  const isoDate = new Date(cell.v);
                  if (!isNaN(isoDate.getTime())) {
                    obj[headers[index]] = isoDate;
                  } else {
                    // Handle time strings in format "20:00"
                    const timeMatch = cell.v.match(/^(\d{1,2}):(\d{2})$/);
                    if (timeMatch) {
                      const hours = parseInt(timeMatch[1]);
                      const minutes = parseInt(timeMatch[2]);
                      const date = new Date();
                      date.setHours(hours);
                      date.setMinutes(minutes);
                      date.setSeconds(0);
                      obj[headers[index]] = date;
                    } else {
                      obj[headers[index]] = cell.v;
                    }
                  }
                }
              }
            } else {
              obj[headers[index]] = cell?.v || null;
            }
        } else {
          obj[headers[index]] = cell?.v || null;
        }
      });
      return obj;
    });
    
    console.log('Transformed data:', data);
    
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
    console.error('Error fetching Google Sheet data:', error);
    return [];
  }
}

// Webhook handler for Google Sheets updates
export async function handleWebhookUpdate(sheetId: string, gid: string = '0') {
  const cacheKey = `${sheetId}-${gid}`;
  cache.delete(cacheKey); // Invalidate cache
  console.log(`Cache invalidated for ${cacheKey}`);
  
  // Optionally trigger a new fetch
  return getGoogleSheetData(sheetId, gid);
}
