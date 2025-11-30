// Utility functions for fetching BoardGameGeek collection data
import { getCachedData, setCachedData } from './cache';

export interface BGGGame {
  id: string;
  name: string;
  thumbnail: string | null;
  image: string | null;
  minPlayers: number;
  maxPlayers: number;
  minPlaytime: number;
  maxPlaytime: number;
  averageWeight: number | null;
  numPlays: number;
  rating: number | null;
  averageRating: number | null;
  lastPlayed: string | null;
  owned: boolean;
  isExpansion: boolean;
}

export interface BGGCollectionSummary {
  totalGames: number;
  expansions: number;
  totalPlays: number;
  playsPerYear: Record<string, number>;
  games: BGGGame[];
}

async function fetchWithPolling(url: string, token: string | undefined, maxRetries = 8): Promise<string> {
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  let response = await fetch(url, { headers });
  let tries = 0;

  // BGG API returns 202 when queuing request
  while (response.status === 202 && tries < maxRetries) {
    await new Promise(resolve => setTimeout(resolve, 1000 + tries * 500));
    response = await fetch(url, { headers });
    tries++;
  }

  if (!response.ok) {
    throw new Error(`BGG API error: ${response.status} ${response.statusText}`);
  }

  return await response.text();
}

function parseXMLValue(xmlText: string, pattern: RegExp): string | null {
  const match = xmlText.match(pattern);
  return match ? match[1] : null;
}

function parseXMLNumber(xmlText: string, pattern: RegExp): number | null {
  const value = parseXMLValue(xmlText, pattern);
  return value ? parseFloat(value) : null;
}

export async function fetchBGGCollection(username: string, token: string | undefined): Promise<BGGCollectionSummary> {
  // Check cache first
  const cacheKey = `bgg_collection_${username}`;
  const cached = getCachedData<BGGCollectionSummary>(cacheKey);

  if (cached) {
    console.log('[BGG] Using cached collection data');
    return cached;
  }

  console.log('[BGG] Fetching fresh data from API');

  // Fetch both base games and expansions
  const baseGamesUrl = `https://boardgamegeek.com/xmlapi2/collection?username=${username}&stats=1&own=1&excludesubtype=boardgameexpansion`;
  const expansionsUrl = `https://boardgamegeek.com/xmlapi2/collection?username=${username}&stats=1&own=1&subtype=boardgameexpansion`;
  const playsUrl = `https://boardgamegeek.com/xmlapi2/plays?username=${username}`;

  // Fetch base games and expansions
  const [baseGamesXml, expansionsXml] = await Promise.all([
    fetchWithPolling(baseGamesUrl, token),
    fetchWithPolling(expansionsUrl, token),
  ]);

  // Check if we got valid XML
  if (!baseGamesXml || baseGamesXml.includes('<error>')) {
    throw new Error('Failed to fetch base games from BGG');
  }

  // Parse collection
  const games: BGGGame[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;

  // Parse base games
  let match;
  while ((match = itemRegex.exec(baseGamesXml)) !== null) {
    const itemXml = match[1];
    const fullItemXml = match[0];

    const id = parseXMLValue(fullItemXml, /objectid="(\d+)"/) || '';
    const subtype = parseXMLValue(fullItemXml, /subtype="([^"]+)"/);
    const name = parseXMLValue(itemXml, /<name[^>]*>([^<]+)<\/name>/) || 'Unknown';
    const thumbnail = parseXMLValue(itemXml, /<thumbnail>([^<]+)<\/thumbnail>/);
    const image = parseXMLValue(itemXml, /<image>([^<]+)<\/image>/);

    const minPlayers = parseXMLNumber(itemXml, /<minplayers[^>]*>(\d+)<\/minplayers>/) || 0;
    const maxPlayers = parseXMLNumber(itemXml, /<maxplayers[^>]*>(\d+)<\/maxplayers>/) || 0;
    const minPlaytime = parseXMLNumber(itemXml, /<minplaytime[^>]*>(\d+)<\/minplaytime>/) || 0;
    const maxPlaytime = parseXMLNumber(itemXml, /<maxplaytime[^>]*>(\d+)<\/maxplaytime>/) || 0;

    const averageWeight = parseXMLNumber(itemXml, /<averageweight[^>]*value="([^"]+)"/);
    const numPlays = parseXMLNumber(itemXml, /<numplays[^>]*>(\d+)<\/numplays>/) || 0;
    const rating = parseXMLNumber(itemXml, /<rating[^>]*value="([^"]+)"/);
    const averageRating = parseXMLNumber(itemXml, /<average[^>]*value="([^"]+)"/);

    const owned = /<status[^>]*own="1"/.test(itemXml);

    games.push({
      id,
      name,
      thumbnail,
      image,
      minPlayers,
      maxPlayers,
      minPlaytime,
      maxPlaytime,
      averageWeight,
      numPlays,
      rating,
      averageRating,
      lastPlayed: null,
      owned,
      isExpansion: false, // Base games
    });
  }

  // Parse expansions
  itemRegex.lastIndex = 0; // Reset regex
  while ((match = itemRegex.exec(expansionsXml)) !== null) {
    const itemXml = match[1];
    const fullItemXml = match[0];

    const id = parseXMLValue(fullItemXml, /objectid="(\d+)"/) || '';
    const subtype = parseXMLValue(fullItemXml, /subtype="([^"]+)"/);
    const name = parseXMLValue(itemXml, /<name[^>]*>([^<]+)<\/name>/) || 'Unknown';
    const thumbnail = parseXMLValue(itemXml, /<thumbnail>([^<]+)<\/thumbnail>/);
    const image = parseXMLValue(itemXml, /<image>([^<]+)<\/image>/);

    const minPlayers = parseXMLNumber(itemXml, /<minplayers[^>]*>(\d+)<\/minplayers>/) || 0;
    const maxPlayers = parseXMLNumber(itemXml, /<maxplayers[^>]*>(\d+)<\/maxplayers>/) || 0;
    const minPlaytime = parseXMLNumber(itemXml, /<minplaytime[^>]*>(\d+)<\/minplaytime>/) || 0;
    const maxPlaytime = parseXMLNumber(itemXml, /<maxplaytime[^>]*>(\d+)<\/maxplaytime>/) || 0;

    const averageWeight = parseXMLNumber(itemXml, /<averageweight[^>]*value="([^"]+)"/);
    const numPlays = parseXMLNumber(itemXml, /<numplays[^>]*>(\d+)<\/numplays>/) || 0;
    const rating = parseXMLNumber(itemXml, /<rating[^>]*value="([^"]+)"/);
    const averageRating = parseXMLNumber(itemXml, /<average[^>]*value="([^"]+)"/);

    const owned = /<status[^>]*own="1"/.test(itemXml);

    games.push({
      id,
      name,
      thumbnail,
      image,
      minPlayers,
      maxPlayers,
      minPlaytime,
      maxPlaytime,
      averageWeight,
      numPlays,
      rating,
      averageRating,
      lastPlayed: null,
      owned,
      isExpansion: true, // Expansions
    });
  }

  // Fetch plays data for statistics
  let playsXml: string;
  try {
    playsXml = await fetchWithPolling(playsUrl, token, 5);
  } catch (error) {
    // If plays API fails, continue with collection data
    playsXml = '';
  }

  // Calculate plays per year and total plays from plays API
  const playsPerYear: Record<string, number> = {};
  let totalPlaysCount = 0;
  const playRegex = /<play[^>]*date="(\d{4})-\d{2}-\d{2}"[^>]*>/g;
  let playMatch;
  while ((playMatch = playRegex.exec(playsXml)) !== null) {
    const year = playMatch[1];
    playsPerYear[year] = (playsPerYear[year] || 0) + 1;
    totalPlaysCount++;
  }

  // Calculate summary
  const totalGames = games.filter(g => !g.isExpansion).length;
  const expansions = games.filter(g => g.isExpansion).length;
  // Use total from plays API (includes games not owned), or fall back to collection sum
  const totalPlays = totalPlaysCount > 0 ? totalPlaysCount : games.reduce((sum, g) => sum + g.numPlays, 0);

  const result: BGGCollectionSummary = {
    totalGames,
    expansions,
    totalPlays,
    playsPerYear,
    games: games.sort((a, b) => b.numPlays - a.numPlays), // Sort by most played
  };

  // Cache the result
  setCachedData(cacheKey, result);

  return result;
}
