export type TorFuseConfig = {
  config_id: string;
};

export type StoredConfig = {
  torbox_api_key: string;
  created_at: number;
};

export type TorrentCandidate = {
  name: string;
  hash: string;
  magnet?: string;
  size?: number;
  seeders?: number;
  leechers?: number;
  source?: string;
  url?: string;
};

export type VideoCodec =
  | "AV1"
  | "AVC"
  | "H264"
  | "H265"
  | "HEVC"
  | "VP8"
  | "VP9"
  | "VVC"
  | "H266"
  | "MPEG-2"
  | "MPEG-4";

export type AudioCodec =
  | "AAC"
  | "AC3"
  | "EAC3"
  | "EAC3-JOC"
  | "DTS"
  | "DTS-HD"
  | "DTS-HD MA"
  | "DTS:X"
  | "TrueHD"
  | "TrueHD Atmos"
  | "FLAC"
  | "Opus"
  | "Vorbis"
  | "PCM";

export type ReleaseSource =
  | "REMUX"
  | "BLURAY"
  | "UHD-BLURAY"
  | "WEB-DL"
  | "WEBRIP"
  | "HDTV"
  | "DVD"
  | "CAM"
  | "TELESYNC"
  | "TELECINE";

export type ReleaseGroup = {
  name: string;
  trusted?: boolean;
  score?: number;
};

export type ParsedRelease = {
  name: string;
  hash: string;
  magnet?: string;

  size?: number;
  seeders?: number;
  leechers?: number;

  resolution?:
    | "4320p"
    | "2160p"
    | "1440p"
    | "1080p"
    | "720p"
    | "576p"
    | "480p"
    | "360p";

  codec?: VideoCodec;
  audioCodec?: AudioCodec;

  hdr?: boolean;
  hdr10?: boolean;
  hdr10Plus?: boolean;
  dolbyVision?: boolean;
  hlg?: boolean;

  source?: ReleaseSource;

  bitDepth?: 8 | 10 | 12;

  colorSpace?:
    | "BT.709"
    | "BT.2020";

  audioChannels?:
    | "2.0"
    | "5.1"
    | "7.1"
    | "Atmos";

  edition?:
    | "THEATRICAL"
    | "EXTENDED"
    | "DIRECTORS-CUT"
    | "UNRATED"
    | "IMAX";

  group?: ReleaseGroup;

  cached?: boolean;

  score?: number;
};