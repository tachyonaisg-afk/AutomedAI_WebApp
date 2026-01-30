/**
 * Aadhaar Card QR Code Parser
 * Parses QR code XML data and Secure QR data from Aadhaar cards
 */

/* global BigInt */
import pako from 'pako';

/**
 * Convert a big integer string to byte array
 */
const bigIntToBytes = (bigIntStr) => {
  let bigInt = BigInt(bigIntStr);
  const bytes = [];

  while (bigInt > 0n) {
    bytes.unshift(Number(bigInt & 0xFFn));
    bigInt = bigInt >> 8n;
  }

  return new Uint8Array(bytes);
};

/**
 * Parse Secure QR Code format (numeric string that decompresses to data)
 * This is the format used in modern Aadhaar cards (post-2018)
 */
const parseSecureQR = (qrData) => {
  try {
    console.log("Attempting to parse Secure QR code...");
    console.log("QR Data length:", qrData.length);

    // Secure QR is a large numeric string (typically 100+ digits)
    if (!/^\d+$/.test(qrData) || qrData.length < 100) {
      return { success: false, error: "Not a secure QR format" };
    }

    // Convert big integer to bytes
    const bytes = bigIntToBytes(qrData);
    console.log("Converted to bytes, length:", bytes.length);

    // Try to decompress using zlib (try both inflate and inflateRaw)
    let decompressed;
    try {
      decompressed = pako.inflate(bytes);
      console.log("Decompressed with inflate");
    } catch (e) {
      try {
        decompressed = pako.inflateRaw(bytes);
        console.log("Decompressed with inflateRaw");
      } catch (e2) {
        console.log("Decompression failed:", e2.message);
        return { success: false, error: "Failed to decompress QR data" };
      }
    }

    console.log("Decompressed data length:", decompressed.length);

    // Parse based on the format version
    // Check first byte for version marker
    if (decompressed[0] === 2 || decompressed[0] === 3) {
      // V2/V3 format - binary with length-prefixed fields
      return parseSecureQRV2(decompressed);
    } else if (decompressed[0] >= 0x30 && decompressed[0] <= 0x39) {
      // Might be text format (starts with digit)
      const textDecoder = new TextDecoder('utf-8', { fatal: false });
      const textData = textDecoder.decode(decompressed);
      return parseSecureQRText(textData, decompressed);
    } else {
      // Try V2 format anyway
      return parseSecureQRV2(decompressed);
    }

  } catch (error) {
    console.error("Error parsing secure QR:", error);
    return { success: false, error: "Failed to parse secure QR: " + error.message };
  }
};

/**
 * Parse Secure QR V2/V3 format (binary format with length-prefixed fields)
 */
const parseSecureQRV2 = (data) => {
  try {
    console.log("Parsing Secure QR V2/V3 format...");
    console.log("First 20 bytes:", Array.from(data.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' '));

    let offset = 0;
    const textDecoder = new TextDecoder('utf-8', { fatal: false });

    // Skip version byte if present (2 or 3)
    if (data[0] === 2 || data[0] === 3) {
      offset = 1;
      console.log("Version:", data[0]);
    }

    // Skip email/mobile presence flags if they exist (next 2-3 bytes might be flags)
    // In V2: 2 bytes for email and mobile flags
    // Skip these if they look like flags (values 0 or 1)
    if (offset < data.length && (data[offset] === 0 || data[offset] === 1 || data[offset] === 2 || data[offset] === 3)) {
      offset += 2; // Skip 2 bytes for flags
      console.log("Skipped flags");
    }

    // Helper to read length-prefixed string
    const readLengthPrefixedString = () => {
      if (offset >= data.length) {
        console.log("End of data reached");
        return "";
      }

      const length = data[offset];
      console.log(`Reading field at offset ${offset}, length: ${length}`);
      offset += 1;

      if (length === 0 || length === 255 || offset + length > data.length) {
        console.log("Invalid length or EOF");
        return "";
      }

      const str = textDecoder.decode(data.slice(offset, offset + length));
      offset += length;
      console.log(`Read string: "${str}"`);
      return str.trim();
    };

    // Read fields in the expected order for V2 format
    // Order: ReferenceID, Name, DOB, Gender, CareOf, District, Landmark, House,
    //        Location, Pincode, PostOffice, State, Street, SubDistrict, VTC

    const referenceId = readLengthPrefixedString(); // Usually contains last 4 of Aadhaar
    const name = readLengthPrefixedString();
    const dob = readLengthPrefixedString();
    const gender = readLengthPrefixedString();
    const careOf = readLengthPrefixedString();
    const district = readLengthPrefixedString();
    const landmark = readLengthPrefixedString();
    const house = readLengthPrefixedString();
    const location = readLengthPrefixedString();
    const pincode = readLengthPrefixedString();
    const postOffice = readLengthPrefixedString();
    const state = readLengthPrefixedString();
    const street = readLengthPrefixedString();
    const subDistrict = readLengthPrefixedString();
    const vtc = readLengthPrefixedString();

    console.log("Parsed fields:", {
      referenceId, name, dob, gender, careOf, district,
      landmark, house, location, pincode, postOffice,
      state, street, subDistrict, vtc
    });

    // Extract UID from reference ID (usually first 4 or all 12 digits)
    let uid = "";
    if (referenceId) {
      const digits = referenceId.replace(/\D/g, '');
      if (digits.length >= 4) {
        uid = digits.slice(0, Math.min(12, digits.length));
      }
    }

    // Split name into first, middle, last
    const { firstName, middleName, lastName } = splitName(name);

    // Format DOB
    const formattedDob = formatDateOfBirth(dob);

    // Map gender
    const mappedGender = mapGender(gender);

    // Build address from components
    const addressParts = [
      careOf ? `C/O ${careOf}` : "",
      house,
      street,
      landmark,
      location,
      postOffice ? `PO: ${postOffice}` : "",
      vtc,
      subDistrict,
      district,
      state,
      pincode,
    ].filter((part) => part && part.trim());
    const fullAddress = addressParts.join(", ");

    console.log("Final extracted data:", { firstName, uid, formattedDob, mappedGender });

    // Check if we got meaningful data
    if (name || dob || gender || uid) {
      return {
        success: true,
        data: {
          firstName,
          middleName,
          lastName,
          uid,
          dateOfBirth: formattedDob,
          gender: mappedGender,
          address: fullAddress,
          careOf,
          house,
          street,
          landmark,
          location,
          postOffice,
          vtc,
          subDistrict,
          district,
          state,
          pincode,
        },
      };
    }

    return { success: false, error: "Could not extract meaningful data from QR" };
  } catch (error) {
    console.error("Error parsing V2 format:", error);
    return { success: false, error: "Failed to parse V2 format: " + error.message };
  }
};

/**
 * Parse Secure QR as text format (delimiter separated)
 */
const parseSecureQRText = (textData, rawBytes) => {
  try {
    console.log("Parsing Secure QR as text format...");
    console.log("Text length:", textData.length);
    console.log("First 200 chars:", textData.substring(0, 200));

    // Try different delimiters
    const delimiters = ['\x1e', '\x1c', '\x1d', '\x1f', '\x00', '|', '\n', ','];
    let fields = [];

    for (const delimiter of delimiters) {
      const parts = textData.split(delimiter).filter(p => p && p.trim().length > 0);
      if (parts.length > 5) {
        fields = parts.map(p => p.trim());
        console.log(`Found ${parts.length} fields using delimiter code:`, delimiter.charCodeAt(0));
        console.log("Fields:", fields.slice(0, 10));
        break;
      }
    }

    // Parse fields array - typical order: ReferenceId, Name, DOB, Gender, Address components...
    if (fields.length >= 4) {
      const referenceId = fields[0] || "";
      const name = fields[1] || "";
      const dob = fields[2] || "";
      const gender = fields[3] || "";

      // Rest are address components
      const addressFields = fields.slice(4).filter(f => f && f.length > 0);

      // Try to identify specific fields
      let pincode = "", state = "", district = "";
      for (const field of addressFields) {
        if (/^\d{6}$/.test(field)) {
          pincode = field;
        }
      }

      const { firstName, middleName, lastName } = splitName(name);
      const formattedDob = formatDateOfBirth(dob);
      const mappedGender = mapGender(gender);

      // Build address from remaining fields
      const fullAddress = addressFields.join(", ");

      console.log("Parsed text format:", { name, dob, gender, pincode });

      if (name || dob || gender) {
        return {
          success: true,
          data: {
            firstName,
            middleName,
            lastName,
            uid: referenceId,
            dateOfBirth: formattedDob,
            gender: mappedGender,
            address: fullAddress,
            district,
            state,
            pincode,
          },
        };
      }
    }

    return { success: false, error: "Could not parse text format" };
  } catch (error) {
    console.error("Error parsing text format:", error);
    return { success: false, error: "Failed to parse text format: " + error.message };
  }
};

/**
 * Parse Aadhaar QR code data (supports both XML and Secure QR formats)
 */
export const parseAadhaarQR = (qrData) => {
  try {
    if (!qrData || qrData.length < 10) {
      return { success: false, error: "Invalid QR code data" };
    }

    console.log("=== Parsing Aadhaar QR ===");
    console.log("QR Data length:", qrData.length);
    console.log("QR Data (first 100 chars):", qrData.substring(0, 100));

    // Check if it's XML format (old format, pre-2018)
    if (qrData.trim().startsWith("<") || qrData.includes("<?xml")) {
      console.log("Detected XML format");
      return parseXMLFormat(qrData);
    }

    // Check if it's Secure QR format (numeric string, post-2018)
    if (/^\d+$/.test(qrData.trim())) {
      console.log("Detected Secure QR format (numeric)");
      return parseSecureQR(qrData.trim());
    }

    // Try XML parsing if it contains any XML-like content
    if (qrData.includes("<")) {
      console.log("Contains XML tags, attempting XML parse...");
      const xmlResult = parseXMLFormat(qrData);
      if (xmlResult.success) return xmlResult;
    }

    return {
      success: false,
      error: "Unrecognized QR code format. Please ensure you're scanning an Aadhaar card QR code."
    };
  } catch (error) {
    console.error("Error parsing Aadhaar QR:", error);
    return { success: false, error: "Failed to parse Aadhaar data: " + error.message };
  }
};

/**
 * Parse XML format QR code (old Aadhaar format, pre-2018)
 */
const parseXMLFormat = (qrData) => {
  try {
    console.log("Parsing XML format...");

    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(qrData, "text/xml");

    // Check for parsing errors
    const parseError = xmlDoc.querySelector("parsererror");
    if (parseError) {
      return { success: false, error: "Failed to parse QR code XML" };
    }

    // Get the main element (PrintLetterBarcodeData or UidData)
    const dataElement =
      xmlDoc.querySelector("PrintLetterBarcodeData") ||
      xmlDoc.querySelector("UidData") ||
      xmlDoc.documentElement;

    if (!dataElement) {
      return { success: false, error: "Invalid Aadhaar QR format" };
    }

    // Extract attributes
    const uid = dataElement.getAttribute("uid") || "";
    const name = dataElement.getAttribute("name") || "";
    const gender = dataElement.getAttribute("gender") || "";
    const dob = dataElement.getAttribute("dob") || "";
    const yob = dataElement.getAttribute("yob") || "";

    // Address components
    const careOf = dataElement.getAttribute("co") || "";
    const house = dataElement.getAttribute("house") || "";
    const street = dataElement.getAttribute("street") || "";
    const landmark = dataElement.getAttribute("lm") || "";
    const locality = dataElement.getAttribute("loc") || "";
    const vtc = dataElement.getAttribute("vtc") || "";
    const district = dataElement.getAttribute("dist") || "";
    const state = dataElement.getAttribute("state") || "";
    const pincode = dataElement.getAttribute("pc") || "";

    console.log("Extracted XML data:", { uid, name, gender, dob, district, state, pincode });

    // Split name
    const { firstName, middleName, lastName } = splitName(name);

    // Format DOB
    const formattedDob = formatDateOfBirth(dob, yob);

    // Build address
    const addressParts = [
      careOf ? `C/O ${careOf}` : "",
      house,
      street,
      landmark,
      locality,
      vtc,
      district,
      state,
      pincode,
    ].filter((part) => part && part.trim());
    const fullAddress = addressParts.join(", ");

    // Map gender
    const mappedGender = mapGender(gender);

    return {
      success: true,
      data: {
        firstName,
        middleName,
        lastName,
        uid: uid.replace(/\s/g, ""),
        dateOfBirth: formattedDob,
        gender: mappedGender,
        address: fullAddress,
        careOf,
        house,
        street,
        landmark,
        locality,
        vtc,
        district,
        state,
        pincode,
      },
    };
  } catch (error) {
    console.error("Error parsing XML format:", error);
    return { success: false, error: "Failed to parse XML format: " + error.message };
  }
};

/**
 * Split full name into first, middle, and last name
 */
const splitName = (name) => {
  const nameParts = name.trim().split(/\s+/).filter(p => p.length > 0);
  let firstName = "";
  let middleName = "";
  let lastName = "";

  if (nameParts.length === 1) {
    firstName = nameParts[0];
  } else if (nameParts.length === 2) {
    firstName = nameParts[0];
    lastName = nameParts[1];
  } else if (nameParts.length >= 3) {
    firstName = nameParts[0];
    middleName = nameParts.slice(1, -1).join(" ");
    lastName = nameParts[nameParts.length - 1];
  }

  return { firstName, middleName, lastName };
};

/**
 * Format date of birth to YYYY-MM-DD
 */
const formatDateOfBirth = (dob, yob = "") => {
  if (dob) {
    // Handle formats: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, DDMMYYYY
    const dobParts = dob.split(/[/.,-]/);
    if (dobParts.length === 3) {
      const day = dobParts[0].padStart(2, "0");
      const month = dobParts[1].padStart(2, "0");
      let year = dobParts[2];

      // Handle 2-digit year
      if (year.length === 2) {
        const yearNum = parseInt(year);
        year = yearNum > 30 ? `19${year}` : `20${year}`;
      }

      // Validate the parts
      if (parseInt(day) >= 1 && parseInt(day) <= 31 &&
          parseInt(month) >= 1 && parseInt(month) <= 12 &&
          year.length === 4) {
        return `${year}-${month}-${day}`;
      }
    } else if (dob.length === 8 && /^\d{8}$/.test(dob)) {
      // Handle DDMMYYYY format
      const day = dob.substring(0, 2);
      const month = dob.substring(2, 4);
      const year = dob.substring(4, 8);
      if (parseInt(day) >= 1 && parseInt(day) <= 31 &&
          parseInt(month) >= 1 && parseInt(month) <= 12) {
        return `${year}-${month}-${day}`;
      }
    }
  }

  // Fallback to year of birth
  if (yob && yob.length === 4) {
    return `${yob}-01-01`;
  }

  return "";
};

/**
 * Map gender value to standard format (Male/Female/Other)
 */
const mapGender = (gender) => {
  if (!gender) return "";

  const g = gender.toUpperCase().trim();

  // Single letter codes
  if (g === "M") return "Male";
  if (g === "F") return "Female";
  if (g === "T" || g === "O") return "Other";

  // Full words
  if (g === "MALE" || g === "PURUSH") return "Male";
  if (g === "FEMALE" || g === "MAHILA") return "Female";
  if (g === "OTHER" || g === "TRANSGENDER") return "Other";

  return gender; // Return as-is if can't map
};

/**
 * Validate Aadhaar number using Verhoeff algorithm
 */
export const validateAadhaarNumber = (aadhaar) => {
  if (!aadhaar || aadhaar.length !== 12 || !/^\d{12}$/.test(aadhaar)) {
    return false;
  }

  // Verhoeff algorithm multiplication table
  const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];

  // Permutation table
  const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];

  let c = 0;
  const reversedAadhaar = aadhaar.split("").reverse();

  for (let i = 0; i < reversedAadhaar.length; i++) {
    c = d[c][p[i % 8][parseInt(reversedAadhaar[i], 10)]];
  }

  return c === 0;
};
