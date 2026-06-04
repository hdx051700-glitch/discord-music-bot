const youtubeSearchUrl = (query) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

const neteaseSearchUrl = (query) =>
  `https://music.163.com/#/search/m/?s=${encodeURIComponent(query)}&type=1`;

export function isDirectAudioUrl(input) {
  try {
    const url = new URL(input);
    return /\.(mp3|wav|ogg|flac|m4a|aac)(\?.*)?$/i.test(url.pathname + url.search);
  } catch {
    return false;
  }
}

export function buildSearchResult(query) {
  return {
    title: query,
    query,
    youtube: youtubeSearchUrl(query),
    netease: neteaseSearchUrl(query)
  };
}
