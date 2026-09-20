import { EXIF_CONSTANTS } from '@/constants/geocoding.constants';

export interface ExifMetadata {
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly captureTime: string | null;
  readonly cameraModel: string | null;
}

const JPEG_SOI = 0xffd8;
const APP1_MARKER = 0xffe1;
const SOS_MARKER = 0xffda;
const EXIF_HEADER_P1 = 0x45786966;
const EXIF_HEADER_P2 = 0x0000;
const LITTLE_ENDIAN_MARKER = 0x4949;
const BIG_ENDIAN_MARKER = 0x4d4d;
const TIFF_VALIDATION_MARKER = 0x002a;

const TAG_MODEL = 0x0110;
const TAG_EXIF_IFD = 0x8769;
const TAG_GPS_IFD = 0x8825;
const TAG_DATE_TIME_ORIGINAL = 0x9003;
const TAG_GPS_LAT_REF = 0x0001;
const TAG_GPS_LAT = 0x0002;
const TAG_GPS_LNG_REF = 0x0003;
const TAG_GPS_LNG = 0x0004;

interface ParsedExifData {
  latitude: number | null;
  longitude: number | null;
  captureTime: string | null;
  cameraModel: string | null;
}

function readRational(view: DataView, offset: number, littleEndian: boolean): number {
  const numerator = view.getUint32(offset, littleEndian);
  const denominator = view.getUint32(offset + 4, littleEndian);
  return denominator === 0 ? 0 : numerator / denominator;
}

function readCoordinate(view: DataView, offset: number, littleEndian: boolean): number {
  const degrees = readRational(view, offset, littleEndian);
  const minutes = readRational(view, offset + 8, littleEndian);
  const seconds = readRational(view, offset + 16, littleEndian);
  return degrees + minutes / 60 + seconds / 3600;
}

function readAscii(view: DataView, offset: number, length: number): string {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    const charCode = view.getUint8(offset + i);
    if (charCode === 0) break;
    result += String.fromCharCode(charCode);
  }
  return result.trim();
}

function parseDateTimeString(raw: string): string | null {
  const parts = raw.split(' ');
  const datePart = parts[0];
  const timePart = parts[1];
  if (!datePart || !timePart) return null;
  const isoDate = datePart.replace(/:/g, '-');
  const parsed = new Date(`${isoDate}T${timePart}Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

interface GpsRawData {
  latRef: string;
  rawLat: number | null;
  lngRef: string;
  rawLng: number | null;
}

interface GpsParserContext {
  readonly tiffOffset: number;
  readonly littleEndian: boolean;
  readonly data: GpsRawData;
}

function parseGpsEntry(view: DataView, entryOffset: number, ctx: GpsParserContext): void {
  const { tiffOffset, littleEndian, data } = ctx;
  const tag = view.getUint16(entryOffset, littleEndian);
  if (tag === TAG_GPS_LAT_REF) {
    data.latRef = String.fromCharCode(view.getUint8(entryOffset + 8));
  } else if (tag === TAG_GPS_LAT) {
    const valOffset = view.getUint32(entryOffset + 8, littleEndian);
    data.rawLat = readCoordinate(view, tiffOffset + valOffset, littleEndian);
  } else if (tag === TAG_GPS_LNG_REF) {
    data.lngRef = String.fromCharCode(view.getUint8(entryOffset + 8));
  } else if (tag === TAG_GPS_LNG) {
    const valOffset = view.getUint32(entryOffset + 8, littleEndian);
    data.rawLng = readCoordinate(view, tiffOffset + valOffset, littleEndian);
  }
}

function parseGpsIfd(
  view: DataView,
  tiffOffset: number,
  gpsOffset: number,
  littleEndian: boolean,
): { lat: number | null; lng: number | null } {
  const entryCount = view.getUint16(tiffOffset + gpsOffset, littleEndian);
  const data: GpsRawData = { latRef: 'N', rawLat: null, lngRef: 'E', rawLng: null };
  const ctx: GpsParserContext = { tiffOffset, littleEndian, data };

  for (let i = 0; i < entryCount; i += 1) {
    const entryOffset = tiffOffset + gpsOffset + 2 + i * 12;
    parseGpsEntry(view, entryOffset, ctx);
  }

  const lat = data.rawLat !== null ? (data.latRef === 'S' ? -data.rawLat : data.rawLat) : null;
  const lng = data.rawLng !== null ? (data.lngRef === 'W' ? -data.rawLng : data.rawLng) : null;
  return { lat, lng };
}

function parseSubIfdDateTime(
  view: DataView,
  tiffOffset: number,
  exifOffset: number,
  littleEndian: boolean,
): string | null {
  const entryCount = view.getUint16(tiffOffset + exifOffset, littleEndian);
  for (let i = 0; i < entryCount; i += 1) {
    const entryOffset = tiffOffset + exifOffset + 2 + i * 12;
    const tag = view.getUint16(entryOffset, littleEndian);
    if (tag === TAG_DATE_TIME_ORIGINAL) {
      const count = view.getUint32(entryOffset + 4, littleEndian);
      const valOffset = view.getUint32(entryOffset + 8, littleEndian);
      const rawDate = readAscii(view, tiffOffset + valOffset, count);
      return parseDateTimeString(rawDate);
    }
  }
  return null;
}

function parseIfd0(
  view: DataView,
  tiffOffset: number,
  littleEndian: boolean,
  data: ParsedExifData,
): void {
  const ifd0Offset = view.getUint32(tiffOffset + 4, littleEndian);
  const entryCount = view.getUint16(tiffOffset + ifd0Offset, littleEndian);

  for (let i = 0; i < entryCount; i += 1) {
    const entryOffset = tiffOffset + ifd0Offset + 2 + i * 12;
    const tag = view.getUint16(entryOffset, littleEndian);
    if (tag === TAG_MODEL) {
      const count = view.getUint32(entryOffset + 4, littleEndian);
      const valOffset = view.getUint32(entryOffset + 8, littleEndian);
      data.cameraModel = readAscii(view, tiffOffset + valOffset, count);
    } else if (tag === TAG_GPS_IFD) {
      const gpsOffset = view.getUint32(entryOffset + 8, littleEndian);
      const coords = parseGpsIfd(view, tiffOffset, gpsOffset, littleEndian);
      data.latitude = coords.lat;
      data.longitude = coords.lng;
    } else if (tag === TAG_EXIF_IFD) {
      const exifOffset = view.getUint32(entryOffset + 8, littleEndian);
      data.captureTime = parseSubIfdDateTime(view, tiffOffset, exifOffset, littleEndian);
    }
  }
}

function parseApp1Segment(view: DataView, offset: number): ExifMetadata | null {
  const isExif =
    view.getUint32(offset + 4) === EXIF_HEADER_P1 && view.getUint16(offset + 8) === EXIF_HEADER_P2;
  if (!isExif) return null;

  const tiffOffset = offset + 10;
  const endianMarker = view.getUint16(tiffOffset);
  if (endianMarker !== LITTLE_ENDIAN_MARKER && endianMarker !== BIG_ENDIAN_MARKER) return null;
  const littleEndian = endianMarker === LITTLE_ENDIAN_MARKER;

  if (view.getUint16(tiffOffset + 2, littleEndian) !== TIFF_VALIDATION_MARKER) return null;

  const data: ParsedExifData = {
    latitude: null,
    longitude: null,
    captureTime: null,
    cameraModel: null,
  };

  parseIfd0(view, tiffOffset, littleEndian, data);
  return data;
}

function findApp1Offset(view: DataView): number | null {
  if (view.getUint16(0) !== JPEG_SOI) return null;
  let offset = 2;
  while (offset < view.byteLength - 4) {
    const marker = view.getUint16(offset);
    if (marker === APP1_MARKER) return offset;
    if (marker === SOS_MARKER) break;
    const length = view.getUint16(offset + 2);
    offset += 2 + length;
  }
  return null;
}

export async function extractExifMetadata(file: File): Promise<ExifMetadata | null> {
  const isJpeg =
    file.type.includes('jpeg') || file.type.includes('jpg') || /\.jpe?g$/i.test(file.name);
  if (!isJpeg) {
    return null;
  }
  try {
    const slice = file.slice(0, EXIF_CONSTANTS.HEADER_READ_BYTES);
    const buffer = await slice.arrayBuffer();
    const view = new DataView(buffer);
    const app1Offset = findApp1Offset(view);
    if (app1Offset === null) return null;
    return parseApp1Segment(view, app1Offset);
  } catch {
    return null;
  }
}
