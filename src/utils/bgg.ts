// Utility functions for fetching BoardGameGeek collection data

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
  const collectionUrl = `https://boardgamegeek.com/xmlapi2/collection?username=${username}&stats=1&played=1`;
  const playsUrl = `https://boardgamegeek.com/xmlapi2/plays?username=${username}`;

  // Fetch collection data
  const collectionXml = await fetchWithPolling(collectionUrl, token);

  // Parse collection
  const games: BGGGame[] = [];
  const itemRegex = /<item[^>]*objecttype="thing"[^>]*>([\s\S]*?)<\/item>/gi;

  let match;
  while ((match = itemRegex.exec(collectionXml)) !== null) {
    const itemXml = match[1];
    const fullItemXml = match[0];

    const id = parseXMLValue(fullItemXml, /objectid="(\d+)"/) || '';
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
    const isExpansion = fullItemXml.includes('subtype="boardgameexpansion"');

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
      lastPlayed: null, // Will be filled from plays API if needed
      owned,
      isExpansion,
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

  // Calculate plays per year
  const playsPerYear: Record<string, number> = {};
  const playRegex = /<play[^>]*date="(\d{4})-\d{2}-\d{2}"[^>]*>/g;
  let playMatch;
  while ((playMatch = playRegex.exec(playsXml)) !== null) {
    const year = playMatch[1];
    playsPerYear[year] = (playsPerYear[year] || 0) + 1;
  }

  // Calculate summary
  const totalGames = games.filter(g => !g.isExpansion).length;
  const expansions = games.filter(g => g.isExpansion).length;
  const totalPlays = games.reduce((sum, g) => sum + g.numPlays, 0);

  return {
    totalGames,
    expansions,
    totalPlays,
    playsPerYear,
    games: games.sort((a, b) => b.numPlays - a.numPlays), // Sort by most played
  };
}
