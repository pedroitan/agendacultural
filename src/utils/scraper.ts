/**
 * Web Scraping Utilities
 * @module scraper
 * @description Provides functions for scraping event data from websites
 * and synchronizing with Google Sheets
 */

import { getGoogleSheetData } from './googleSheets';
import { updateGoogleSheet } from './googleSheets';
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Target website URL for scraping
 * @constant {string}
 * @default 'https://elcabong.com.br/agenda/'
 */
const TARGET_URL = 'https://elcabong.com.br/agenda/';

/**
 * Google Sheets ID for storing event data
 * @constant {string}
 * @default '1184qmC-7mpZtpg15R--il4K3tVxSTAcJUZxpWf9KFAs'
 */
const SHEET_ID = '1184qmC-7mpZtpg15R--il4K3tVxSTAcJUZxpWf9KFAs';

/**
 * Interface representing event data structure
 * @interface EventData
 * @property {string} eventName - Name of the event
 * @property {string[]} tags - Array of tags/categories
 * @property {string} startDate - ISO string of start date/time
 * @property {string} endDate - ISO string of end date/time
 * @property {string} location - Event location
 * @property {string} description - Event description
 * @property {string} image - URL of event image
 * @property {string} [registrationLink] - Optional registration link
 */
export interface EventData {
  eventName: string;
  tags: string[];
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  image: string;
  registrationLink?: string;
}

/**
 * Main scraping and synchronization function
 * @async
 * @function scrapeAndUpdateEvents
 * @returns {Promise<number>} - Number of new events added
 * @throws Will throw an error if scraping or synchronization fails
 * @description
 * 1. Scrapes events from target website
 * 2. Gets existing data from Google Sheet
 * 3. Filters out duplicates
 * 4. Updates Google Sheet with new events
 */
export async function scrapeAndUpdateEvents() {
  try {
    console.log('Starting scrapeAndUpdateEvents...');
    
    // 1. Scrape data from target website
    console.log('Scraping events from website...');
    const events = await scrapeEvents();
    console.log('Scraped events:', events.length);
    
    // 2. Get existing data from Google Sheet
    console.log('Fetching existing data from Google Sheet...');
    const existingData = await getGoogleSheetData(SHEET_ID, '2043142206');
    console.log('Existing data count:', existingData.length);
    
    // 3. Filter out duplicates
    console.log('Filtering new events...');
    const newEvents = filterNewEvents(events, existingData);
    console.log('New events count:', newEvents.length);
    
    // 4. Add new events to Google Sheet
    if (newEvents.length > 0) {
      console.log('Adding new events to Google Sheet...');
      await updateGoogleSheet(SHEET_ID, newEvents);
      console.log(`Added ${newEvents.length} new events to the sheet`);
    } else {
      console.log('No new events to add');
    }
    
    return newEvents.length;
  } catch (error) {
    /**
     * Error handling:
     * - Logs detailed error information
     * - Preserves error stack trace
     * - Throws error to propagate up the call stack
     * - Includes timestamp for debugging
     */
    console.error('Error in scrapeAndUpdateEvents:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

/**
 * Scrapes events from target website
 * @async
 * @function scrapeEvents
 * @returns {Promise<EventData[]>} - Array of scraped event data
 * @throws Will throw an error if scraping fails
 * @description Uses Cheerio to parse HTML and extract event information
 */
export async function scrapeEvents(): Promise<EventData[]> {
  /**
   * Scraping process details:
   * 1. Fetches HTML from target URL using axios
   * 2. Loads HTML into Cheerio for parsing
   * 3. Extracts event information from specific CSS selectors
   * 4. Transforms raw data into standardized EventData format
   * 
   * Data transformation:
   * - Converts date/time strings to ISO format
   * - Handles missing image URLs with fallback
   * - Normalizes text content (trim whitespace, etc.)
   */
  const { data } = await axios.get(TARGET_URL);
  const $ = cheerio.load(data);
  const events: EventData[] = [];

  // Scrape events from El Cabong's agenda
  $('.evento').each((i, element) => {
    const title = $(element).find('.evento__titulo').text().trim();
    const dateTime = $(element).find('.evento__data').text().trim();
    const [date, time] = dateTime.split(' ');
    const location = 'El Cabong';
    const description = $(element).find('.evento__descricao').text().trim();
    const imageUrl = $(element).find('.evento__imagem img').attr('src') || undefined;

    const event: EventData = {
      eventName: title,
      tags: [], // Will need to extract tags from the source
      startDate: new Date(`${date}T${time}:00Z`).toISOString(),
      endDate: new Date(`${date}T${time}:00Z`).toISOString(), // Will need to extract end time
      location,
      description,
      image: imageUrl || '/images/astro-post.jpg'
    };
    
    events.push(event);
  });

  return events;
}

/**
 * Filters out events that already exist in the Google Sheet
 * @function filterNewEvents
 * @param {EventData[]} newEvents - Array of newly scraped events
 * @param {any[]} existingData - Array of existing events from Google Sheet
 * @returns {any[]} - Array of new events not present in the sheet
 * @description Compares events based on name and start time
 */
/**
 * Filters out events that already exist in the Google Sheet
 * @function filterNewEvents
 * @param {EventData[]} newEvents - Array of newly scraped events
 * @param {any[]} existingData - Array of existing events from Google Sheet
 * @returns {any[]} - Array of new events not present in the sheet
 * @description Compares events based on name and start time
 * @example
 * const newEvents = filterNewEvents(scrapedEvents, existingEvents);
 */
function filterNewEvents(newEvents: EventData[], existingData: any[]): any[] {
  /**
   * Filtering logic:
   * - Compares events based on name and start time
   * - Uses strict equality for comparison
   * - Maps EventData to Google Sheets column format
   * 
   * Column mapping:
   * - evento: eventName
   * - tipo_de_evento: tags (joined)
   * - horário_de_início: startDate
   * - horário_de_término: endDate
   * - local: location
   * - descrição: description
   * - flyer: image
   * - link_de_inscrição: registrationLink (or empty string)
   */
  return newEvents.filter(newEvent => {
    return !existingData.some(existingEvent => 
      existingEvent.evento === newEvent.eventName &&
      existingEvent.horário_de_início === newEvent.startDate
    );
  }).map(event => ({
    evento: event.eventName,
    tipo_de_evento: event.tags.join(', '),
    horário_de_início: event.startDate,
    horário_de_término: event.endDate,
    local: event.location,
    descrição: event.description,
    flyer: event.image,
    link_de_inscrição: event.registrationLink || ''
  }));
}
