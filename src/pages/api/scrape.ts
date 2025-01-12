import { scrapeAndUpdateEvents } from '../../utils/scraper';

export async function GET() {
  try {
    const newEventsCount = await scrapeAndUpdateEvents();
    return new Response(JSON.stringify({
      success: true,
      newEvents: newEventsCount
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
