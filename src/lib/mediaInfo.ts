interface IMediaInfo {
  codecInfo?: string;
  hdrInfo?: string;
  sourceInfo?: string;
  audioInfo?: string;
}

// Global cache for extractMediaInfo results
const mediaInfoCache = new Map<string, IMediaInfo>();

// Helper function to extract codec and source information from torrent name
export const extractMediaInfo = (name: string): IMediaInfo => {
  // Check if the result is already cached
  if (mediaInfoCache.has(name)) {
    return mediaInfoCache.get(name)!;
  }

  const normalizedName = name.toLowerCase();

  // Use a single pass for all regular expressions
  let codecInfo;
  let hdrInfo;
  let sourceInfo;
  let audioInfo;

  // Video codecs (search once)
  if (/[Hh][Ee][Vv][Cc]|[Xx]265|[Hh]\.?265/.test(name)) {
    codecInfo = 'H265';
  } else if (/[Aa][Vv][Cc]|[Xx]264|[Hh]\.?264/.test(name)) {
    codecInfo = 'H264';
  } else if (normalizedName.includes('av1')) {
    codecInfo = 'AV1';
  }

  // HDR formats (search once)
  if (normalizedName.includes('hdr10+')) {
    hdrInfo = 'HDR10+';
  } else if (normalizedName.includes('hdr10')) {
    hdrInfo = 'HDR10';
  } else if (normalizedName.includes('dolbyvision')) {
    hdrInfo = 'Dolby Vision';
  }

  // Sources (search once)
  if (/[Rr][Ee][Mm][Uu][Xx]/.test(name)) {
    sourceInfo = 'REMUX';
  } else if (/[Bb][Ll][Uu][Rr][Aa][Yy]|[Bb][Dd][Rr][Ii][Pp]/.test(name)) {
    sourceInfo = 'BLURAY';
  } else if (/[Ww][Ee][Bb][ -._]?[Dd][Ll]/.test(name)) {
    sourceInfo = 'WEB-DL';
  } else if (normalizedName.includes('webrip')) {
    sourceInfo = 'WEBRIP';
  } else if (/\b[Ww][Ee][Bb]\b/.test(name)) {
    sourceInfo = 'WEB';
  } else if (normalizedName.includes('hdtv')) {
    sourceInfo = 'HDTV';
  } else if (normalizedName.includes('dvdrip')) {
    sourceInfo = 'DVDRIP';
  }

  // Audio (search once)
  if (/[Dd][Tt][Ss][ -._]?[Hh][Dd]/.test(name)) {
    audioInfo = 'DTS-HD';
  } else if (/[Dd][Tt][Ss][ -._]?[Xx]/.test(name)) {
    audioInfo = 'DTS:X';
  } else if (normalizedName.includes('atmos')) {
    audioInfo = 'ATMOS';
  } else if (normalizedName.includes('truehd')) {
    audioInfo = 'TRUEHD';
  } else if (/[Dd][Dd]\+|[Ee][-_]?[Aa][Cc][-_]?3/.test(name)) {
    audioInfo = 'DD+';
  } else if (normalizedName.includes('dd')) {
    audioInfo = 'DD';
  } else if (normalizedName.includes('dts')) {
    audioInfo = 'DTS';
  } else if (normalizedName.includes('aac')) {
    audioInfo = 'AAC';
  }

  const result: IMediaInfo = { codecInfo, hdrInfo, sourceInfo, audioInfo };

  // Cache the result
  mediaInfoCache.set(name, result);

  return result;
};
