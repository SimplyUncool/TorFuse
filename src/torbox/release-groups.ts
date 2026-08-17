import type { ReleaseGroup } from "../types.js";

type ReleaseGroupInfo = {
  trusted: boolean;
  score: number;
};

const GROUPS: Record<string, ReleaseGroupInfo> = {
  "NTb": { trusted: true, score: 100 },
  "FLUX": { trusted: true, score: 100 },
  "HONE": { trusted: true, score: 98 },
  "NTG": { trusted: true, score: 96 },
  "CAKES": { trusted: true, score: 96 },
  "CMRG": { trusted: true, score: 94 },
  "SMURF": { trusted: true, score: 94 },
  "KOGi": { trusted: true, score: 94 },
  "PECULATE": { trusted: true, score: 94 },
  "EDITH": { trusted: true, score: 94 },
  "ETHEL": { trusted: true, score: 94 },
  "BLAKE": { trusted: true, score: 92 },
  "KiNGS": { trusted: true, score: 92 },
  "GGEZ": { trusted: true, score: 92 },
  "DEViL": { trusted: true, score: 90 },
  "BAMBOOZLE": { trusted: true, score: 90 },
  "SuccessfulCrab": { trusted: true, score: 90 },
  "NOSiViD": { trusted: true, score: 88 },
  "ViSUM": { trusted: true, score: 88 },
  "ELEANOR": { trusted: true, score: 88 },
  "ORENJI": { trusted: true, score: 88 },
  "ANON": { trusted: true, score: 86 },
  "SPiRiT": { trusted: true, score: 86 },
  "TOMMY": { trusted: true, score: 86 },
  "TOMMYT": { trusted: true, score: 86 },
  "SKYFiRE": { trusted: true, score: 86 },
  "COLLECTiVE": { trusted: true, score: 86 },
  "MEMENTO": { trusted: true, score: 86 },
  "NAISU": { trusted: true, score: 86 },
  "WELP": { trusted: true, score: 84 },
  "POKE": { trusted: true, score: 84 },
  "NOGRP": { trusted: false, score: 0 },
  "Vyndros": { trusted: true, score: 90 },

  "FraMeSToR": { trusted: true, score: 100 },
  "EPSiLON": { trusted: true, score: 100 },
  "CiNEPHiLES": { trusted: true, score: 96 },
  "DON": { trusted: true, score: 96 },
  "CtrlHD": { trusted: true, score: 96 },
  "TERMiNAL": { trusted: true, score: 94 },
  "CHD": { trusted: true, score: 92 },
  "CHDBits": { trusted: true, score: 92 },
  "MTeam": { trusted: true, score: 90 },
  "TTG": { trusted: true, score: 90 },
  "WiLDCAT": { trusted: true, score: 88 },
  "BHD": { trusted: true, score: 96 },
  "BHDStudio": { trusted: true, score: 96 },
  "BLURANiUM": { trusted: true, score: 94 },
  "BeyondHD": { trusted: true, score: 96 },
  "HiDt": { trusted: true, score: 88 },
  "HDMaNiA": { trusted: true, score: 84 },
  "HDTime": { trusted: true, score: 84 },
  "HDHome": { trusted: true, score: 84 },
  "HDME": { trusted: true, score: 84 },
  "HDS": { trusted: true, score: 84 },
  "HD4U": { trusted: true, score: 84 },
  "HDClub": { trusted: true, score: 84 },
  "HDChina": { trusted: true, score: 84 },
  "HDVN": { trusted: true, score: 84 },
  "EuReKA": { trusted: true, score: 88 },
  "HiFi": { trusted: true, score: 88 },
  "D-Z0N3": { trusted: true, score: 80 },
  "DECiBEL": { trusted: true, score: 82 },
  "TRiToN": { trusted: true, score: 82 },
  "VietHD": { trusted: true, score: 88 },
  "KRaLiMaRKo": { trusted: true, score: 88 },
  "ESiR": { trusted: true, score: 90 },
  "EbP": { trusted: true, score: 90 },
  "WiKi": { trusted: true, score: 90 },
  "BeAst": { trusted: true, score: 88 },
  "CRiSC": { trusted: true, score: 88 },
  "TDD": { trusted: true, score: 84 },
  "Geek": { trusted: true, score: 82 },

  "QxR": { trusted: true, score: 88 },
  "Tigole": { trusted: true, score: 88 },
  "VARYG": { trusted: true, score: 82 },
  "Bandi": { trusted: true, score: 80 },
  "UTR": { trusted: true, score: 82 },
  "Joy": { trusted: true, score: 82 },
  "MeGusta": { trusted: true, score: 78 },
  "SHiNOBi": { trusted: true, score: 80 },
  "TBS": { trusted: true, score: 78 },
  "FLAWL3SS": { trusted: true, score: 78 },
  "W4NK3R": { trusted: true, score: 78 },
  "T0PAZ": { trusted: true, score: 78 },
  "MIRCrew": { trusted: true, score: 74 },
  "Pahe": { trusted: true, score: 74 },
  "YIFY": { trusted: true, score: 68 },
  "YTS": { trusted: true, score: 68 },
  "PSA": { trusted: true, score: 78 },
  "RMTeam": { trusted: true, score: 74 },
  "GalaxyRG": { trusted: true, score: 72 },
  "GalaxyTV": { trusted: true, score: 72 },
  "Sasukeduc": { trusted: true, score: 72 },
  "ShAaNiG": { trusted: true, score: 72 },
  "Ozlem": { trusted: true, score: 72 },
  "ETRG": { trusted: true, score: 70 },
  "ETTV": { trusted: true, score: 70 },
  "FGT": { trusted: true, score: 70 },
  "EVO": { trusted: true, score: 70 },
  "Silence": { trusted: true, score: 70 },
  "Judas": { trusted: true, score: 70 },
  "SPHD": { trusted: true, score: 70 },
  "Sicario": { trusted: true, score: 70 },
  "MkvCage": { trusted: true, score: 68 },
  "MkvCageWS": { trusted: true, score: 68 },
  "Ganool": { trusted: true, score: 68 },
  "TOPAZ": { trusted: true, score: 78 },

  "SubsPlease": { trusted: true, score: 80 },
  "Erai-raws": { trusted: true, score: 80 },
  "EMBER": { trusted: true, score: 80 },
  "LostYears": { trusted: true, score: 80 },
  "ASW": { trusted: true, score: 78 },
  "AnimeTime": { trusted: true, score: 78 },
  "HorribleSubs": { trusted: true, score: 78 },
  "Jocko": { trusted: true, score: 76 },
  "Tsundere": { trusted: true, score: 76 },
  "Commie": { trusted: true, score: 78 },
  "CTR": { trusted: true, score: 76 },
  "Coalgirls": { trusted: true, score: 78 },
  "FFF": { trusted: true, score: 78 },
  "UTW": { trusted: true, score: 78 },
  "Underwater": { trusted: true, score: 76 },
  "Doki": { trusted: true, score: 76 },
  "Vivid": { trusted: true, score: 76 },
  "PAS": { trusted: true, score: 76 },
  "MTBB": { trusted: true, score: 78 },
  "Baws": { trusted: true, score: 74 },
  "ToonsHub": { trusted: true, score: 74 },

  "aXXo": { trusted: true, score: 60 },
  "FXG": { trusted: true, score: 65 },
  "DiAMOND": { trusted: true, score: 65 },
  "DEMAND": { trusted: true, score: 65 },
  "IMMERSE": { trusted: true, score: 70 },
  "AMIABLE": { trusted: true, score: 70 },
  "REWARD": { trusted: true, score: 65 },
  "COCAIN": { trusted: true, score: 65 },
  "ViSiON": { trusted: true, score: 65 },
  "DEPRiVED": { trusted: true, score: 65 },
  "LiMiTED": { trusted: true, score: 65 },
  "DOMiNO": { trusted: true, score: 65 },
  "SANTi": { trusted: true, score: 65 },
  "NoGRP": { trusted: false, score: 0 },
  "iNTERNAL": { trusted: false, score: 0 },
  "iNT": { trusted: false, score: 0 },
  "LiNE": { trusted: true, score: 62 },
  "SPARKS": { trusted: true, score: 70 },
  "GECKOS": { trusted: true, score: 70 },
  "DRONES": { trusted: true, score: 70 },
  "VXT": { trusted: true, score: 68 }
};

const NORMALIZED_GROUPS =
  new Map<string, ReleaseGroupInfo>();

for (const [name, info] of Object.entries(GROUPS)) {
  NORMALIZED_GROUPS.set(
    name.toLowerCase(),
    info
  );
}

export function getReleaseGroup(
  name: string
): ReleaseGroup {
  const info =
    NORMALIZED_GROUPS.get(
      name.toLowerCase()
    );

  return {
    name,
    trusted: info?.trusted ?? false,
    score: info?.score ?? 0
  };
}

export function isKnownReleaseGroup(
  name: string
): boolean {
  return NORMALIZED_GROUPS.has(
    name.toLowerCase()
  );
}

export function isTrustedReleaseGroup(
  name: string
): boolean {
  return (
    NORMALIZED_GROUPS.get(
      name.toLowerCase()
    )?.trusted ?? false
  );
}

export function getReleaseGroupScore(
  name: string
): number {
  return (
    NORMALIZED_GROUPS.get(
      name.toLowerCase()
    )?.score ?? 0
  );
}