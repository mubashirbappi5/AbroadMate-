import zlib from "zlib";

interface ZipFileEntry {
  path: string;
  data: Buffer;
}

/**
 * Pure Node.js standard PKZIP archive generator without external dependencies.
 */
function createZipArchive(files: ZipFileEntry[]): Buffer {
  const fileHeaders: Buffer[] = [];
  const centralDirHeaders: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const filenameBuffer = Buffer.from(file.path, "utf-8");
    const compressed = zlib.deflateRawSync(file.data);

    // CRC32 calculation
    const crc = crc32(file.data);

    // Local file header
    const localHeader = Buffer.alloc(30 + filenameBuffer.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local file header signature
    localHeader.writeUInt16LE(20, 4); // Version needed to extract (2.0)
    localHeader.writeUInt16LE(0, 6); // General purpose bit flag
    localHeader.writeUInt16LE(8, 8); // Compression method (8 = Deflated)
    localHeader.writeUInt16LE(0, 10); // File last mod time
    localHeader.writeUInt16LE(0, 12); // File last mod date
    localHeader.writeUInt32LE(crc, 14); // CRC-32
    localHeader.writeUInt32LE(compressed.length, 18); // Compressed size
    localHeader.writeUInt32LE(file.data.length, 22); // Uncompressed size
    localHeader.writeUInt16LE(filenameBuffer.length, 26); // Filename length
    localHeader.writeUInt16LE(0, 28); // Extra field length
    filenameBuffer.copy(localHeader, 30);

    fileHeaders.push(localHeader, compressed);

    // Central directory header
    const cdHeader = Buffer.alloc(46 + filenameBuffer.length);
    cdHeader.writeUInt32LE(0x02014b50, 0); // Central directory header signature
    cdHeader.writeUInt16LE(20, 4); // Version made by
    cdHeader.writeUInt16LE(20, 6); // Version needed to extract
    cdHeader.writeUInt16LE(0, 8); // General purpose bit flag
    cdHeader.writeUInt16LE(8, 10); // Compression method
    cdHeader.writeUInt16LE(0, 12); // Last mod time
    cdHeader.writeUInt16LE(0, 14); // Last mod date
    cdHeader.writeUInt32LE(crc, 16); // CRC-32
    cdHeader.writeUInt32LE(compressed.length, 20); // Compressed size
    cdHeader.writeUInt32LE(file.data.length, 24); // Uncompressed size
    cdHeader.writeUInt16LE(filenameBuffer.length, 28); // Filename length
    cdHeader.writeUInt16LE(0, 30); // Extra field length
    cdHeader.writeUInt16LE(0, 32); // File comment length
    cdHeader.writeUInt16LE(0, 34); // Disk number start
    cdHeader.writeUInt16LE(0, 36); // Internal file attributes
    cdHeader.writeUInt32LE(0, 38); // External file attributes
    cdHeader.writeUInt32LE(offset, 42); // Relative offset of local header
    filenameBuffer.copy(cdHeader, 46);

    centralDirHeaders.push(cdHeader);
    offset += localHeader.length + compressed.length;
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const cdh of centralDirHeaders) {
    centralDirSize += cdh.length;
  }

  // End of central directory record
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
  eocd.writeUInt16LE(0, 4); // Number of this disk
  eocd.writeUInt16LE(0, 6); // Disk where central directory starts
  eocd.writeUInt16LE(files.length, 8); // Number of central directory records on this disk
  eocd.writeUInt16LE(files.length, 10); // Total number of central directory records
  eocd.writeUInt32LE(centralDirSize, 12); // Size of central directory
  eocd.writeUInt32LE(centralDirOffset, 16); // Offset of start of central directory
  eocd.writeUInt16LE(0, 20); // Comment length

  return Buffer.concat([...fileHeaders, ...centralDirHeaders, eocd]);
}

/**
 * Standard CRC-32 implementation
 */
function crc32(buf: Buffer): number {
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    const byte = buf[i] ?? 0;
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 0xff]!;
  }
  return (crc ^ -1) >>> 0;
}

const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[i] = c >>> 0;
}

/**
 * Generates a valid Microsoft Word .docx Buffer from title and paragraphs.
 */
export function generateDocxBuffer(title: string, paragraphs: string[]): Buffer {
  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const titleXml = `
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="300" w:line="276" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:b/>
          <w:sz w:val="32"/>
        </w:rPr>
        <w:t>${escapeXml(title)}</w:t>
      </w:r>
    </w:p>`;

  const bodyXml = paragraphs
    .map(
      (para) => `
    <w:p>
      <w:pPr>
        <w:spacing w:after="200" w:line="276" w:lineRule="auto"/>
        <w:ind w:firstLine="720"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>${escapeXml(para)}</w:t>
      </w:r>
    </w:p>`
    )
    .join("");

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${titleXml}
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const files: ZipFileEntry[] = [
    { path: "[Content_Types].xml", data: Buffer.from(contentTypesXml, "utf-8") },
    { path: "_rels/.rels", data: Buffer.from(relsXml, "utf-8") },
    { path: "word/document.xml", data: Buffer.from(documentXml, "utf-8") },
  ];

  return createZipArchive(files);
}
