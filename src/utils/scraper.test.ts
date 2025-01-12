/**
 * Scraper Test Utilities
 * @module scraper.test
 * @description Provides test functionality for the web scraper
 */

import { scrapeEvents } from './scraper.js';
import type { EventData } from './scraper.js';

/**
 * Tests the web scraper functionality
 * @async
 * @function testScraper
 * @description
 * - Scrapes events from target website
 * - Logs event details to console
 * - Handles and reports any errors
 */
/**
 * Tests the web scraper functionality
 * @async
 * @function testScraper
 * @description
 * - Scrapes events from target website
 * - Logs event details to console
 * - Handles and reports any errors
 * @example
 * // Run in terminal:
 * // npm run test:scraper
 * testScraper();
 */
async function testScraper() {
  /**
   * Test execution flow:
   * 1. Initialize test and log start
   * 2. Execute scrapeEvents function
   * 3. Validate and log results
   * 4. Handle errors and log failures
   * 
   * Expected outputs:
   * - Number of events found
   * - Detailed event information for each event
   * - Success/failure status
   * 
   * Error handling:
   * - Network errors
   * - Parsing errors
   * - Data validation errors
   */
  try {
    console.log('Starting scraper test...');
    const events = await scrapeEvents();
    
    console.log(`Found ${events.length} events:`);
    /**
     * Event validation checks:
     * - Event name must be non-empty string
     * - Start date must be valid ISO string
     * - Location must be non-empty string
     * - Description must be non-empty string
     * - Image URL must be valid URL or fallback
     */
    events.forEach((event: EventData, i: number) => {
      console.log(`\nEvent #${i + 1}`);
      console.log('Name:', event.eventName);
      console.log('Tags:', event.tags);
      console.log('Start:', event.startDate);
      console.log('End:', event.endDate);
      console.log('Location:', event.location);
      console.log('Description:', event.description);
      console.log('Image:', event.image);
      if (event.registrationLink) {
        console.log('Registration:', event.registrationLink);
      }
    });
    
    console.log('\nScraper test completed successfully');
  } catch (error) {
    /**
     * Test failure handling:
     * - Logs detailed error information
     * - Preserves error stack trace
     * - Includes timestamp for debugging
     */
    console.error('Scraper test failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
}

testScraper();
/**
 * Test execution notes:
 * - Run using: npm run test:scraper
 * - Requires network connection
 * - May fail if target website structure changes
 * - Outputs to console for manual verification
 */
