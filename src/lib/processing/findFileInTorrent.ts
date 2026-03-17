import type { IMediaType, ITorrentFile } from '../../types.ts';
import { numberPad, sortBy } from '../util.js';

export function findFileInTorrent(
  files: ITorrentFile[],
  type: IMediaType,
  season: number,
  episode: number
): ITorrentFile | undefined {
  if (type == 'movie') {
    const sortedFiles = files.toSorted(sortBy('size', true));
    return sortedFiles[0];
  } else if (type == 'series') {
    // Only return the file matching the episode, no fallback to the first file
    return findEpisodeFile(files, season, episode);
  }
}

export function findEpisodeFile(files: ITorrentFile[], season: number, episode: number): ITorrentFile | undefined {
  const sortedFiles = files.toSorted(sortBy('size', true));

  // Traditional formats for TV series
  return (
    sortedFiles.find((file) => file.name.toUpperCase().includes(`S${numberPad(season, 2)}E${numberPad(episode, 3)}`)) || // SXXEYYY
    sortedFiles.find((file) => file.name.toUpperCase().includes(`S${numberPad(season, 2)}E${numberPad(episode, 2)}`)) || // SXXEYY
    sortedFiles.find((file) => file.name.toUpperCase().includes(`S${season}E${episode}`)) || // SXY
    sortedFiles.find((file) => file.name.includes(`${season}${numberPad(episode, 2)}`)) || // XYY
    // Specific formats for anime
    sortedFiles.find((file) => new RegExp(`\\bE(pisode)?\\s*${numberPad(episode, 2)}\\b`, 'i').test(file.name)) ||
    sortedFiles.find((file) => new RegExp(`\\bEP\\s*${numberPad(episode, 2)}\\b`, 'i').test(file.name)) ||
    sortedFiles.find((file) => new RegExp(`\\[\\s*${numberPad(episode, 2)}\\s*\\]`).test(file.name)) ||
    sortedFiles.find((file) => new RegExp(`\\s-\\s*${numberPad(episode, 2)}\\b`).test(file.name)) ||
    // Simple format with just the episode number (use as last resort)
    sortedFiles.find((file) => file.name.includes(`${numberPad(episode, 2)}`))
  );
}
