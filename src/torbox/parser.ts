import type {
  ParsedRelease,
  ReleaseGroup,
  ReleaseSource,
  VideoCodec,
  AudioCodec,
  TorrentCandidate
} from "../types.js";

import {
  getReleaseGroup,
  isKnownReleaseGroup
} from "./release-groups.js";

const VIDEO_CODECS: Array<
  [VideoCodec, RegExp]
> = [
  ["H266", /\bH[.\s-]?266\b/i],
  ["VVC", /\bVVC\b/i],
  ["AV1", /\bAV1\b/i],
  ["H265", /\bH[.\s-]?265\b/i],
  ["HEVC", /\bHEVC\b/i],
  ["H264", /\bH[.\s-]?264\b/i],
  ["AVC", /\bAVC\b/i],
  ["VP9", /\bVP9\b/i],
  ["VP8", /\bVP8\b/i],
  ["MPEG-4", /\bMPEG[\s.-]?4\b/i],
  ["MPEG-2", /\bMPEG[\s.-]?2\b/i]
];

const AUDIO_CODECS: Array<
  [AudioCodec, RegExp]
> = [
  ["TrueHD Atmos", /\bTRUEHD[\s.-]?ATMOS\b/i],
  ["DTS:X", /\bDTS[\s._-]?X\b/i],
  ["DTS-HD MA", /\bDTS[\s.-]?HD[\s.-]?MA\b/i],
  ["DTS-HD", /\bDTS[\s.-]?HD\b/i],
  ["TrueHD", /\bTRUEHD\b/i],
  ["EAC3-JOC", /\bEAC3[\s.-]?JOC\b/i],
  ["EAC3", /\bEAC3\b|\bDDP\b|\bDD\+\b/i],
  ["AC3", /\bAC3\b|\bDD\b/i],
  ["DTS", /\bDTS\b/i],
  ["FLAC", /\bFLAC\b/i],
  ["Opus", /\bOPUS\b/i],
  ["Vorbis", /\bVORBIS\b/i],
  ["PCM", /\bPCM\b/i],
  ["AAC", /\bAAC\b/i]
];

const SOURCES: Array<
  [ReleaseSource, RegExp]
> = [
  [
    "UHD-BLURAY",
    /\bUHD[\s.-]?BLU[\s.-]?RAY\b|\bUHD[\s.-]?BD\b/i
  ],
  ["REMUX", /\bREMUX\b/i],
  [
    "BLURAY",
    /\bBLU[\s.-]?RAY\b|\bBDRIP\b|\bBDMV\b/i
  ],
  [
    "WEB-DL",
    /\bWEB[\s.-]?DL\b|\bWEBDL\b/i
  ],
  [
    "WEBRIP",
    /\bWEB[\s.-]?RIP\b|\bWEBRIP\b/i
  ],
  ["HDTV", /\bHDTV\b/i],
  ["DVD", /\bDVD\b|\bDVDRIP\b/i],
  ["TELESYNC", /\bTELESYNC\b/i],
  ["TELECINE", /\bTELECINE\b/i],
  ["CAM", /\bCAM\b|\bCAMRIP\b/i]
];

const EDITIONS: Array<
  [
    NonNullable<ParsedRelease["edition"]>,
    RegExp
  ]
> = [
  [
    "DIRECTORS-CUT",
    /\bDIRECTOR'?S[\s.-]?CUT\b/i
  ],
  ["EXTENDED", /\bEXTENDED\b/i],
  ["UNRATED", /\bUNRATED\b/i],
  ["IMAX", /\bIMAX\b/i],
  ["THEATRICAL", /\bTHEATRICAL\b/i]
];

const TECHNICAL_TAGS = new Set([
  "2160p",
  "1440p",
  "1080p",
  "720p",
  "576p",
  "480p",
  "360p",
  "4320p",
  "4k",
  "uhd",
  "hdr",
  "hdr10",
  "hdr10+",
  "hdr10plus",
  "sdr",
  "dv",
  "dovi",
  "hlg",
  "hevc",
  "h265",
  "h264",
  "avc",
  "av1",
  "vvc",
  "h266",
  "vp8",
  "vp9",
  "web-dl",
  "webdl",
  "webrip",
  "bluray",
  "blu-ray",
  "bdrip",
  "bdmv",
  "remux",
  "amzn",
  "amazon",
  "nf",
  "netflix",
  "dsnp",
  "disney",
  "atvp",
  "apple",
  "hmax",
  "max",
  "hulu",
  "pcok",
  "paramount",
  "peacock",
  "ac3",
  "dd",
  "ddp",
  "eac3",
  "dts",
  "dtsx",
  "dts-hd",
  "truehd",
  "aac",
  "flac",
  "opus",
  "vorbis",
  "pcm",
  "5.1",
  "7.1",
  "2.0",
  "atmos",
  "8bit",
  "10bit",
  "12bit",
  "extended",
  "unrated",
  "imax",
  "theatrical"
]);

function detectResolution(
  name: string
): ParsedRelease["resolution"] {
  const match = name.match(
    /\b(4320|2160|1440|1080|720|576|480|360)p\b/i
  );

  if (match?.[1]) {
    return `${match[1]}p` as ParsedRelease["resolution"];
  }

  if (
    /\b4K\b/i.test(name) ||
    /\bUHD\b/i.test(name)
  ) {
    return "2160p";
  }

  return undefined;
}

function detectVideoCodec(
  name: string
): VideoCodec | undefined {
  for (const [codec, pattern] of VIDEO_CODECS) {
    if (pattern.test(name)) {
      return codec;
    }
  }

  return undefined;
}

function detectAudioCodec(
  name: string
): AudioCodec | undefined {
  for (const [codec, pattern] of AUDIO_CODECS) {
    if (pattern.test(name)) {
      return codec;
    }
  }

  return undefined;
}

function detectSource(
  name: string
): ReleaseSource | undefined {
  for (const [source, pattern] of SOURCES) {
    if (pattern.test(name)) {
      return source;
    }
  }

  return undefined;
}

function detectBitDepth(
  name: string
): ParsedRelease["bitDepth"] {
  if (/\b12[\s.-]?bit\b/i.test(name)) {
    return 12;
  }

  if (/\b10[\s.-]?bit\b/i.test(name)) {
    return 10;
  }

  if (/\b8[\s.-]?bit\b/i.test(name)) {
    return 8;
  }

  return undefined;
}

function detectColorSpace(
  name: string
): ParsedRelease["colorSpace"] {
  if (
    /\bBT[\s.-]?2020\b/i.test(name) ||
    /\bREC[\s.-]?2020\b/i.test(name)
  ) {
    return "BT.2020";
  }

  if (
    /\bBT[\s.-]?709\b/i.test(name) ||
    /\bREC[\s.-]?709\b/i.test(name)
  ) {
    return "BT.709";
  }

  return undefined;
}

function detectAudioChannels(
  name: string
): ParsedRelease["audioChannels"] {
  if (/\bATMOS\b/i.test(name)) {
    return "Atmos";
  }

  if (/\b7[\s.]1\b/i.test(name)) {
    return "7.1";
  }

  if (/\b5[\s.]1\b/i.test(name)) {
    return "5.1";
  }

  if (/\b2[\s.]0\b/i.test(name)) {
    return "2.0";
  }

  return undefined;
}

function detectHdr(
  name: string
): Pick<
  ParsedRelease,
  | "hdr"
  | "hdr10"
  | "hdr10Plus"
  | "dolbyVision"
  | "hlg"
> {
  const sdr =
    /\bSDR\b/i.test(name);

  const dolbyVision =
    /\bDV\b/i.test(name) ||
    /\bDOVI\b/i.test(name) ||
    /\bDOLBY[\s.-]?VISION\b/i.test(name);

  const hdr10Plus =
    /\bHDR10\+\b/i.test(name) ||
    /\bHDR10PLUS\b/i.test(name);

  const hdr10 =
    /\bHDR10\b/i.test(name) &&
    !hdr10Plus;

  const hlg =
    /\bHLG\b/i.test(name);

  const genericHdr =
    /\bHDR\b/i.test(name);

  const explicitHdr =
    dolbyVision ||
    hdr10Plus ||
    hdr10 ||
    hlg ||
    genericHdr;

  return {
    hdr:
      sdr
        ? false
        : explicitHdr
          ? true
          : undefined,

    hdr10,
    hdr10Plus,
    dolbyVision,
    hlg
  };
}

function detectEdition(
  name: string
): ParsedRelease["edition"] {
  for (const [edition, pattern] of EDITIONS) {
    if (pattern.test(name)) {
      return edition;
    }
  }

  return undefined;
}

function cleanReleaseGroup(
  value: string
): string {
  return value
    .replace(/^[\s._-]+/, "")
    .replace(/[\s._-]+$/, "")
    .trim();
}

function detectReleaseGroup(
  name: string
): ReleaseGroup | undefined {
  const parts = name
    .split(/[.\s]+/)
    .map(part =>
      part.trim()
    )
    .filter(Boolean);

  if (parts.length === 0) {
    return undefined;
  }

  const candidates: string[] = [];

  const lastPart = parts.at(-1);

  if (lastPart) {
    candidates.push(
      cleanReleaseGroup(lastPart)
    );
  }

  const dashMatch =
    name.match(
      /[-\s]([A-Za-z0-9][A-Za-z0-9._-]{1,30})$/
    );

  if (dashMatch?.[1]) {
    candidates.push(
      cleanReleaseGroup(
        dashMatch[1]
      )
    );
  }

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    if (
      TECHNICAL_TAGS.has(
        candidate.toLowerCase()
      )
    ) {
      continue;
    }

    if (
      isKnownReleaseGroup(candidate)
    ) {
      return getReleaseGroup(candidate);
    }
  }

  return undefined;
}

export function parseRelease(
  candidate: TorrentCandidate
): ParsedRelease {
  const name =
    candidate.name;

  return {
    name,

    hash:
      candidate.hash,

    magnet:
      candidate.magnet,

    resolution:
      detectResolution(name),

    codec:
      detectVideoCodec(name),

    audioCodec:
      detectAudioCodec(name),

    ...detectHdr(name),

    source:
      detectSource(name),

    bitDepth:
      detectBitDepth(name),

    colorSpace:
      detectColorSpace(name),

    audioChannels:
      detectAudioChannels(name),

    edition:
      detectEdition(name),

    group:
      detectReleaseGroup(name),

    cached:
      false
  };
}

export function parseReleases(
  candidates: TorrentCandidate[]
): ParsedRelease[] {
  return candidates.map(
    parseRelease
  );
}