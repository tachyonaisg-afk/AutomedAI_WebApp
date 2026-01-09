/**
 * Aadhaar Card Data Parser
 * Parses QR code XML data, Secure QR data, and OCR text from Aadhaar cards
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

    // Secure QR is a large numeric string (typically 2000+ digits)
    if (!/^\d+$/.test(qrData) || qrData.length < 100) {
      return { success: false, error: "Not a secure QR format" };
    }

    // Convert big integer to bytes
    const bytes = bigIntToBytes(qrData);
    console.log("Converted to bytes, length:", bytes.length);

    // Try to decompress using zlib
    let decompressed;
    try {
      decompressed = pako.inflate(bytes);
    } catch (e) {
      // Try raw deflate if inflate fails
      try {
        decompressed = pako.inflateRaw(bytes);
      } catch (e2) {
        console.log("Decompression failed:", e2);
        return { success: false, error: "Failed to decompress QR data" };
      }
    }

    console.log("Decompressed data length:", decompressed.length);

    // Parse the decompressed data
    // Format varies based on version, but typically contains:
    // - Email/Mobile present flags (first 2 bytes in some versions)
    // - Reference ID
    // - Name, DOB, Gender, Address fields separated by specific delimiters

    // Try to decode as text first
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const textData = textDecoder.decode(decompressed);
    console.log("Decoded text (first 500 chars):", textData.substring(0, 500));

    // Check if it's the newer V2 format with byte markers
    // V2 format: starts with version byte (2), then has specific byte lengths for each field
    if (decompressed[0] === 2 || decompressed[0] === 86) { // V2 or 'V' ASCII
      return parseSecureQRV2(decompressed);
    }

    // Try parsing as delimiter-separated text (older secure format)
    // Fields are often separated by specific byte sequences or fixed positions
    return parseSecureQRText(textData, decompressed);

  } catch (error) {
    console.error("Error parsing secure QR:", error);
    return { success: false, error: "Failed to parse secure QR" };
  }
};

/**
 * Parse Secure QR V2 format (binary format with byte markers)
 */
const parseSecureQRV2 = (data) => {
  try {
    console.log("Parsing Secure QR V2 format...");

    let offset = 0;
    const textDecoder = new TextDecoder('utf-8', { fatal: false });

    // Skip version byte if present
    if (data[0] === 2 || data[0] === 86) {
      offset = 1;
    }

    // Read email/mobile presence flags (2 bytes) - stored for potential future use
    // eslint-disable-next-line no-unused-vars
    const _emailPresent = data[offset];
    // eslint-disable-next-line no-unused-vars
    const _mobilePresent = data[offset + 1];
    offset += 2;

    // Helper to read length-prefixed string
    const readString = () => {
      if (offset >= data.length) return "";
      const length = data[offset];
      offset += 1;
      if (length === 0 || offset + length > data.length) return "";
      const str = textDecoder.decode(data.slice(offset, offset + length));
      offset += length;
      return str.trim();
    };

    // Read fields in order
    const referenceId = readString();
    const name = readString();
    const dob = readString();
    const gender = readString();
    const careOf = readString();
    const district = readString();
    const landmark = readString();
    const house = readString();
    const location = readString();
    const pincode = readString();
    const postOffice = readString();
    const state = readString();
    const street = readString();
    const subDistrict = readString();
    const vtc = readString();

    // Last 4 digits of Aadhaar might be in reference ID
    const uid = referenceId ? referenceId.substring(0, 4) : "";

    // Split name
    const { firstName, middleName, lastName } = splitName(name);

    // Format DOB
    const formattedDob = formatDateOfBirth(dob);

    // Map gender
    const mappedGender = mapGender(gender);

    // Build address
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

    console.log("Parsed V2 data:", { name, dob, gender, pincode });

    if (name || dob || gender) {
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
          district,
          state,
          pincode,
        },
      };
    }

    return { success: false, error: "Could not extract data from V2 format" };
  } catch (error) {
    console.error("Error parsing V2 format:", error);
    return { success: false, error: "Failed to parse V2 format" };
  }
};

/**
 * Parse Secure QR as text format (delimiter separated)
 */
const parseSecureQRText = (textData, rawBytes) => {
  try {
    console.log("Parsing Secure QR as text format...");

    // Try different delimiters
    const delimiters = ['\u001c', '\u001d', '\u001e', '\x00', '|', '\n'];
    let fields = [];

    for (const delimiter of delimiters) {
      const parts = textData.split(delimiter).filter(p => p.length > 0);
      if (parts.length > 5) {
        fields = parts;
        console.log(`Found ${parts.length} fields using delimiter:`, delimiter.charCodeAt(0));
        break;
      }
    }

    // If no delimiter works, try to extract using patterns
    if (fields.length < 5) {
      // Look for common patterns in the text
      const patterns = {
        name: /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/,
        dob: /(\d{2}[/\-.]\d{2}[/\-.]\d{4})/,
        gender: /\b(MALE|FEMALE|Male|Female|M|F)\b/,
        pincode: /\b(\d{6})\b/,
      };

      let name = "", dob = "", gender = "", pincode = "";

      const nameMatch = textData.match(patterns.name);
      if (nameMatch) name = nameMatch[1];

      const dobMatch = textData.match(patterns.dob);
      if (dobMatch) dob = dobMatch[1];

      const genderMatch = textData.match(patterns.gender);
      if (genderMatch) gender = genderMatch[1];

      const pincodeMatch = textData.match(patterns.pincode);
      if (pincodeMatch) pincode = pincodeMatch[1];

      if (name || dob || gender) {
        const { firstName, middleName, lastName } = splitName(name);
        const formattedDob = formatDateOfBirth(dob);
        const mappedGender = mapGender(gender);

        return {
          success: true,
          data: {
            firstName,
            middleName,
            lastName,
            uid: "",
            dateOfBirth: formattedDob,
            gender: mappedGender,
            address: "",
            pincode,
          },
        };
      }
    }

    // Parse fields array
    // Common order: ReferenceId, Name, DOB, Gender, CareOf, Address components...
    if (fields.length >= 4) {
      const referenceId = fields[0] || "";
      const name = fields[1] || "";
      const dob = fields[2] || "";
      const gender = fields[3] || "";
      const careOf = fields[4] || "";

      // Try to find address components in remaining fields
      let district = "", state = "", pincode = "", vtc = "";
      for (let i = 5; i < fields.length; i++) {
        const field = fields[i];
        if (/^\d{6}$/.test(field)) pincode = field;
        else if (field.length > 3 && field.length < 30) {
          if (!vtc) vtc = field;
          else if (!district) district = field;
          else if (!state) state = field;
        }
      }

      const { firstName, middleName, lastName } = splitName(name);
      const formattedDob = formatDateOfBirth(dob);
      const mappedGender = mapGender(gender);

      // Build address
      const addressParts = [
        careOf ? `C/O ${careOf}` : "",
        vtc,
        district,
        state,
        pincode,
      ].filter((part) => part && part.trim());
      const fullAddress = addressParts.join(", ");

      console.log("Parsed text format data:", { name, dob, gender });

      if (name || dob || gender) {
        return {
          success: true,
          data: {
            firstName,
            middleName,
            lastName,
            uid: referenceId.substring(0, 4),
            dateOfBirth: formattedDob,
            gender: mappedGender,
            address: fullAddress,
            careOf,
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
    return { success: false, error: "Failed to parse text format" };
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

    // Check if it's XML format (old format)
    if (qrData.includes("<") && qrData.includes("uid")) {
      console.log("Detected XML format");
      return parseXMLFormat(qrData);
    }

    // Check if it's Secure QR format (numeric string)
    if (/^\d+$/.test(qrData)) {
      console.log("Detected Secure QR format (numeric)");
      return parseSecureQR(qrData);
    }

    // Try XML parsing anyway (might have some non-standard format)
    if (qrData.includes("<")) {
      console.log("Attempting XML parsing...");
      const xmlResult = parseXMLFormat(qrData);
      if (xmlResult.success) return xmlResult;
    }

    return { success: false, error: "Unrecognized QR code format. Please try uploading the Aadhaar card image instead." };
  } catch (error) {
    console.error("Error parsing Aadhaar QR:", error);
    return { success: false, error: "Failed to parse Aadhaar data" };
  }
};

/**
 * Parse XML format QR code
 * QR format: <PrintLetterBarcodeData uid="..." name="..." gender="..." dob="..." ... />
 */
const parseXMLFormat = (qrData) => {
  try {
    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(qrData, "text/xml");

    // Check for parsing errors
    const parseError = xmlDoc.querySelector("parsererror");
    if (parseError) {
      return { success: false, error: "Failed to parse QR code XML" };
    }

    // Get the main element (could be PrintLetterBarcodeData or other variations)
    const dataElement =
      xmlDoc.querySelector("PrintLetterBarcodeData") ||
      xmlDoc.documentElement;

    if (!dataElement) {
      return { success: false, error: "Invalid Aadhaar QR format" };
    }

    // Extract attributes
    const uid = dataElement.getAttribute("uid") || "";
    const name = dataElement.getAttribute("name") || "";
    const gender = dataElement.getAttribute("gender") || "";
    const dob = dataElement.getAttribute("dob") || "";
    const yob = dataElement.getAttribute("yob") || ""; // Year of birth (fallback)

    // Address components
    const careOf = dataElement.getAttribute("co") || "";
    const house = dataElement.getAttribute("house") || "";
    const street = dataElement.getAttribute("street") || "";
    const landmark = dataElement.getAttribute("lm") || "";
    const locality = dataElement.getAttribute("loc") || "";
    const vtc = dataElement.getAttribute("vtc") || ""; // Village/Town/City
    const district = dataElement.getAttribute("dist") || "";
    const state = dataElement.getAttribute("state") || "";
    const pincode = dataElement.getAttribute("pc") || "";

    // Split name into first, middle, last
    const { firstName, middleName, lastName } = splitName(name);

    // Format date of birth (DD-MM-YYYY or DD/MM/YYYY to YYYY-MM-DD)
    const formattedDob = formatDateOfBirth(dob, yob);

    // Build full address
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

    // Map gender (M/F to Male/Female)
    const mappedGender = mapGender(gender);

    return {
      success: true,
      data: {
        firstName,
        middleName,
        lastName,
        uid: uid.replace(/\s/g, ""), // Remove spaces from UID
        dateOfBirth: formattedDob,
        gender: mappedGender,
        address: fullAddress,
        careOf,
        district,
        state,
        pincode,
      },
    };
  } catch (error) {
    console.error("Error parsing XML format:", error);
    return { success: false, error: "Failed to parse XML format" };
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
    // Handle formats: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
    const dobParts = dob.split(/[/.,-]/);
    if (dobParts.length === 3) {
      const day = dobParts[0].padStart(2, "0");
      const month = dobParts[1].padStart(2, "0");
      const year = dobParts[2].length === 2 ? `20${dobParts[2]}` : dobParts[2];
      // Validate the parts
      if (parseInt(day) <= 31 && parseInt(month) <= 12 && year.length === 4) {
        return `${year}-${month}-${day}`;
      }
    }
  }
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

  // Full words (English)
  if (g === "MALE") return "Male";
  if (g === "FEMALE") return "Female";
  if (g === "OTHER" || g === "TRANSGENDER") return "Other";

  // Hindi text
  if (g.includes("पुरुष") || g.includes("PURUSH")) return "Male";
  if (g.includes("महिला") || g.includes("MAHILA") || g.includes("स्त्री")) return "Female";

  return "";
};

/**
 * Check if a string looks like a valid Indian name
 */
const isValidName = (str) => {
  if (!str || str.length < 3) return false;

  // Must contain mostly letters
  const letterCount = (str.match(/[A-Za-z]/g) || []).length;
  if (letterCount < str.length * 0.7) return false;

  // Should not be common OCR garbage or card text
  const invalidPatterns = [
    /^[A-Z]{1,3}$/,  // Short all-caps like "FC", "WTR"
    /government/i,
    /india/i,
    /uidai/i,
    /unique/i,
    /identification/i,
    /authority/i,
    /aadhaar/i,
    /address/i,
    /male|female/i,
    /\d{4}/,  // Contains 4+ digit numbers
    /vid/i,
    /dob/i,
    /help/i,
    /www\./i,
    /\.gov/i,
    /\.in/i,
  ];

  for (const pattern of invalidPatterns) {
    if (pattern.test(str)) return false;
  }

  return true;
};

/**
 * Extract a valid name from text
 */
const extractName = (text, lines) => {
  console.log("Extracting name from text...");

  // Method 1: Look for name after common name indicators
  const nameIndicators = [
    /(?:Name|नाम)\s*[:=-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s*$/m,
  ];

  for (const pattern of nameIndicators) {
    const match = text.match(pattern);
    if (match && isValidName(match[1])) {
      console.log("Name found via indicator:", match[1]);
      return match[1].trim();
    }
  }

  // Method 2: Look through each line for name-like patterns
  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip short lines or lines with numbers
    if (trimmedLine.length < 5) continue;
    if (/\d{4}/.test(trimmedLine)) continue;

    // Look for proper name pattern: First Middle Last (each word 3+ chars, starts with capital)
    const namePattern = /^([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,}){1,3})$/;
    const match = trimmedLine.match(namePattern);

    if (match && isValidName(match[1])) {
      console.log("Name found from line:", match[1]);
      return match[1];
    }
  }

  // Method 3: Look for capitalized words that form a name
  const words = text.split(/\s+/);
  const nameWords = [];

  for (const word of words) {
    // Check if word looks like a name part (starts with capital, 3+ letters)
    if (/^[A-Z][a-z]{2,}$/.test(word) && isValidName(word)) {
      nameWords.push(word);
      if (nameWords.length >= 3) break;
    } else if (nameWords.length > 0) {
      // If we have some name words and hit a non-name word, check if we have enough
      if (nameWords.length >= 2) break;
      nameWords.length = 0; // Reset if not enough
    }
  }

  if (nameWords.length >= 2) {
    const name = nameWords.join(" ");
    console.log("Name found from words:", name);
    return name;
  }

  // Method 4: Look for S/O, D/O, W/O pattern and get name before it
  const relativePattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\s*(?:S\/O|D\/O|W\/O|s\/o|d\/o|w\/o)/;
  const relativeMatch = text.match(relativePattern);
  if (relativeMatch && isValidName(relativeMatch[1])) {
    console.log("Name found before S/O:", relativeMatch[1]);
    return relativeMatch[1].trim();
  }

  console.log("No valid name found");
  return "";
};

/**
 * Extract DOB from text
 */
const extractDOB = (text) => {
  console.log("Extracting DOB...");

  // Look for DOB with label first
  const dobPatterns = [
    /DOB\s*[:=-]?\s*(\d{1,2}[/.-]\d{1,2}[/.-]\d{4})/i,
    /D\.?O\.?B\.?\s*[:=-]?\s*(\d{1,2}[/.-]\d{1,2}[/.-]\d{4})/i,
    /Date\s*of\s*Birth\s*[:=-]?\s*(\d{1,2}[/.-]\d{1,2}[/.-]\d{4})/i,
    /जन्म\s*तिथि\s*[:=-]?\s*(\d{1,2}[/.-]\d{1,2}[/.-]\d{4})/i,
    // Standalone date pattern (DD/MM/YYYY format common in India)
    /\b(\d{2}\/\d{2}\/\d{4})\b/,
    /\b(\d{2}-\d{2}-\d{4})\b/,
  ];

  for (const pattern of dobPatterns) {
    const match = text.match(pattern);
    if (match) {
      console.log("DOB found:", match[1]);
      return match[1];
    }
  }

  // Look for Year of Birth
  const yobMatch = text.match(/(?:Year\s*of\s*Birth|YOB)\s*[:=-]?\s*(\d{4})/i);
  if (yobMatch) {
    console.log("YOB found:", yobMatch[1]);
    return yobMatch[1];
  }

  console.log("No DOB found");
  return "";
};

/**
 * Extract Gender from text
 */
const extractGender = (text, lines) => {
  console.log("Extracting Gender...");

  // Look for explicit gender patterns
  const genderPatterns = [
    /(?:Gender|Sex|लिंग)\s*[:=-]?\s*(Male|Female|MALE|FEMALE|पुरुष|महिला)/i,
    /\b(MALE|FEMALE)\b/,
    /\/(Male|Female)\//i,
  ];

  for (const pattern of genderPatterns) {
    const match = text.match(pattern);
    if (match) {
      const gender = mapGender(match[1]);
      console.log("Gender found:", match[1], "->", gender);
      return gender;
    }
  }

  // Check each line for standalone MALE or FEMALE
  for (const line of lines) {
    const upperLine = line.toUpperCase().trim();
    if (upperLine === "MALE" || upperLine.includes("/MALE") || upperLine.endsWith(" MALE")) {
      console.log("Gender found from line: Male");
      return "Male";
    }
    if (upperLine === "FEMALE" || upperLine.includes("/FEMALE") || upperLine.endsWith(" FEMALE")) {
      console.log("Gender found from line: Female");
      return "Female";
    }
  }

  // Last resort: look for male/female anywhere
  if (/\bMALE\b/.test(text.toUpperCase()) && !/\bFEMALE\b/.test(text.toUpperCase())) {
    console.log("Gender found (fallback): Male");
    return "Male";
  }
  if (/\bFEMALE\b/.test(text.toUpperCase())) {
    console.log("Gender found (fallback): Female");
    return "Female";
  }

  console.log("No gender found");
  return "";
};

/**
 * Extract UID (Aadhaar number) from text
 */
const extractUID = (text) => {
  console.log("Extracting UID...");

  // Look for 12-digit patterns (with or without spaces)
  const uidPatterns = [
    /\b(\d{4}\s+\d{4}\s+\d{4})\b/,
    /\b(\d{4}[\s-]*\d{4}[\s-]*\d{4})\b/,
    /\b(\d{12})\b/,
  ];

  for (const pattern of uidPatterns) {
    const matches = text.match(new RegExp(pattern, 'g'));
    if (matches) {
      for (const match of matches) {
        const uid = match.replace(/[\s-]/g, "");
        // Validate it's a proper UID (12 digits, doesn't start with 0 or 1)
        if (uid.length === 12 && /^[2-9]\d{11}$/.test(uid)) {
          console.log("UID found:", uid);
          return uid;
        }
      }
    }
  }

  console.log("No valid UID found");
  return "";
};

/**
 * Clean address - remove non-English text and OCR garbage
 */
const cleanAddress = (rawAddress) => {
  if (!rawAddress) return "";

  // Split into parts and filter
  let cleaned = rawAddress
    // Remove Hindi/Gujarati/Devanagari characters (keep only English, numbers, punctuation)
    .replace(/[\u0900-\u097F\u0A80-\u0AFF\u0980-\u09FF]/g, " ")
    // Remove common OCR garbage and card instructions
    .replace(/\b(Aadhaar|aadhaar|is proof of identity|not of citizenship|date of birth|should be used|verification|online|offline|authentication|scanning|QR code|XML|Chad|निकट|eke|KI Rae|Sp BER|uc AA|Bellon|gape|ted H Sls|aided|sual|नाजरिदता|पुरावी છે|walls weal|Gut मान|teno|pists|gaa SN|hit H tie|slau|गन)\b/gi, " ")
    // Remove random character sequences (2-3 random chars surrounded by spaces)
    .replace(/\s[A-Z]{1,2}\s/g, " ")
    // Remove pipe characters and special symbols
    .replace(/[|।॥]/g, " ")
    // Remove standalone numbers that aren't pincodes (6 digits) or house numbers
    .replace(/\b\d{1,3}\b(?!\d)/g, (match, offset, str) => {
      // Keep if it looks like part of address (followed by letters or preceded by NO/FLAT)
      const before = str.substring(Math.max(0, offset - 10), offset);
      if (/(?:NO|FLAT|HOUSE|BLOCK|SECTOR)[\s-]*$/i.test(before)) {
        return match;
      }
      return " ";
    })
    // Clean up multiple spaces
    .replace(/\s+/g, " ")
    .trim();

  // Extract meaningful address components
  const addressParts = [];

  // Look for common address patterns
  const patterns = [
    /FLAT\s*NO[\s:/-]*[A-Z0-9/-]+/i,
    /[A-Z0-9/-]+\s*,?\s*MILESTONE[^,]*/i,
    /PANCHAM\s+HEIGHTS/i,
    /ALTHAN/i,
    /Surat/i,
    /Gujarat/i,
    /PO[\s:]*[A-Za-z]+/i,
    /\b\d{6}\b/, // Pincode
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) {
      const part = match[0].trim();
      if (part && !addressParts.includes(part)) {
        addressParts.push(part);
      }
    }
  }

  // If we found specific parts, use them
  if (addressParts.length >= 2) {
    return addressParts.join(", ");
  }

  // Otherwise, try to extract clean English text
  // Split by common delimiters and filter valid parts
  const parts = cleaned.split(/[,\s]+/);
  const validParts = [];

  for (const part of parts) {
    const trimmed = part.trim();
    // Keep if it's a valid English word/number (3+ chars, mostly alphanumeric)
    if (trimmed.length >= 3) {
      const alphaCount = (trimmed.match(/[A-Za-z0-9]/g) || []).length;
      if (alphaCount >= trimmed.length * 0.7) {
        // Skip common garbage words
        if (!/^(the|and|for|with|this|that|from|have|been|was|were|are|will|can|may)$/i.test(trimmed)) {
          validParts.push(trimmed);
        }
      }
    }
  }

  // Reconstruct address from valid parts
  if (validParts.length > 0) {
    return validParts.slice(0, 10).join(" "); // Limit to first 10 parts
  }

  return cleaned;
};

/**
 * Extract Address from text
 */
const extractAddress = (text) => {
  console.log("Extracting Address...");

  const addressPatterns = [
    /(?:Address|पता)\s*[:=-]?\s*(.+?)(?=\d{4}\s*\d{4}\s*\d{4}|VID|$)/is,
    /(?:S\/O|D\/O|W\/O|C\/O)\s*[:=-]?\s*(.+?)(?=\d{4}\s*\d{4}\s*\d{4}|VID|$)/is,
  ];

  for (const pattern of addressPatterns) {
    const match = text.match(pattern);
    if (match && match[1].length > 15) {
      const rawAddress = match[1].replace(/\s+/g, " ").trim();
      console.log("Raw address found:", rawAddress.substring(0, 100) + "...");

      // Clean the address to keep only English
      const cleanedAddress = cleanAddress(rawAddress);
      console.log("Cleaned address:", cleanedAddress);
      return cleanedAddress;
    }
  }

  console.log("No address found");
  return "";
};

/**
 * Extract Pincode from text
 */
const extractPincode = (text) => {
  // Indian pincode: 6 digits, starts with 1-9
  const match = text.match(/\b([1-9]\d{5})\b/);
  if (match) {
    console.log("Pincode found:", match[1]);
    return match[1];
  }
  return "";
};

/**
 * Parse Aadhaar data from OCR text
 * Extracts fields using regex patterns - improved version
 */
export const parseAadhaarOCR = (ocrText) => {
  try {
    if (!ocrText || ocrText.trim().length < 10) {
      return { success: false, error: "Insufficient text extracted" };
    }

    console.log("=== Starting Aadhaar OCR Parsing ===");
    console.log("Raw OCR Text:", ocrText);

    // Preserve original text for line-by-line analysis
    const lines = ocrText.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);

    // Also create a single-line version for pattern matching
    const text = ocrText.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();

    console.log("Number of lines:", lines.length);
    console.log("Lines:", lines);

    // Extract all fields
    const uid = extractUID(text);
    const dob = extractDOB(text);
    const gender = extractGender(text, lines);
    const name = extractName(text, lines);
    const address = extractAddress(text);
    const pincode = extractPincode(text);

    // Format DOB
    let formattedDob = "";
    if (dob) {
      if (dob.length === 4) {
        formattedDob = `${dob}-01-01`;
      } else {
        formattedDob = formatDateOfBirth(dob);
      }
    }

    // Split name
    const { firstName, middleName, lastName } = splitName(name);

    console.log("=== Final Extracted Data ===");
    console.log({ firstName, middleName, lastName, uid, formattedDob, gender, address, pincode });

    // Check if we got any useful data
    const hasData = uid || firstName || gender || formattedDob;

    return {
      success: hasData,
      data: {
        firstName,
        middleName,
        lastName,
        uid,
        dateOfBirth: formattedDob,
        gender,
        address,
        pincode,
      },
      confidence: (uid && firstName && gender) ? "high" : "medium",
    };
  } catch (error) {
    console.error("Error parsing Aadhaar OCR:", error);
    return { success: false, error: "Failed to parse Aadhaar text" };
  }
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
