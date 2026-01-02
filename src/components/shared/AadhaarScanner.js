import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Html5Qrcode } from "html5-qrcode";
import { createWorker } from "tesseract.js";
import { X, Camera, Upload, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { parseAadhaarQR, parseAadhaarOCR, validateAadhaarNumber } from "../../utils/aadhaarParser";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${(props) => (props.active ? "#4a90e2" : "#e0e0e0")};
  background-color: ${(props) => (props.active ? "#e3f2fd" : "#fff")};
  color: ${(props) => (props.active ? "#4a90e2" : "#666")};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    border-color: #4a90e2;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ScannerContainer = styled.div`
  width: 100%;
  min-height: 280px;
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const QRReader = styled.div`
  width: 100%;
  height: 280px;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadArea = styled.div`
  width: 100%;
  min-height: 280px;
  border: 2px dashed ${(props) => (props.isDragging ? "#4a90e2" : "#e0e0e0")};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  background-color: ${(props) => (props.isDragging ? "#e3f2fd" : "#f8f9fa")};
  transition: all 0.2s;

  &:hover {
    border-color: #4a90e2;
    background-color: #e3f2fd;
  }
`;

const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: #e3f2fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a90e2;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const UploadText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
  text-align: center;
`;

const UploadHint = styled.span`
  font-size: 12px;
  color: #999;
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 280px;
  object-fit: contain;
  border-radius: 8px;
`;

const StatusMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 14px;

  ${(props) =>
    props.type === "loading" &&
    `
    background-color: #e3f2fd;
    color: #1976d2;
  `}

  ${(props) =>
    props.type === "success" &&
    `
    background-color: #e8f5e9;
    color: #2e7d32;
  `}

  ${(props) =>
    props.type === "error" &&
    `
    background-color: #ffebee;
    color: #c62828;
  `}

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const LoadingSpinner = styled(Loader)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ExtractedData = styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const DataLabel = styled.span`
  font-size: 13px;
  color: #666;
`;

const DataValue = styled.span`
  font-size: 13px;
  color: #333;
  font-weight: 500;
  text-align: right;
  max-width: 60%;
  word-break: break-word;
`;

const ModalFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.variant === "primary"
      ? `
    background-color: #4a90e2;
    color: white;
    border: none;

    &:hover {
      background-color: #357abd;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `
      : `
    background-color: white;
    color: #666;
    border: 1px solid #e0e0e0;

    &:hover {
      background-color: #f5f5f5;
    }
  `}
`;

const AadhaarScanner = ({ isOpen, onClose, onDataExtracted }) => {
  const [activeTab, setActiveTab] = useState("scan"); // "scan" or "upload"
  const [status, setStatus] = useState(null); // { type: "loading" | "success" | "error", message: string }
  const [extractedData, setExtractedData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);
  const workerRef = useRef(null);
  const isScanningRef = useRef(false);

  // Initialize QR scanner when scan tab is active
  useEffect(() => {
    if (isOpen && activeTab === "scan" && !isScanningRef.current) {
      startScannerFn();
    }

    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeTab]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const startScannerFn = async () => {
    if (html5QrCodeRef.current) {
      await stopScanner();
    }

    try {
      isScanningRef.current = true;
      setStatus({ type: "loading", message: "Starting camera..." });

      html5QrCodeRef.current = new Html5Qrcode("qr-reader");

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onQRCodeScanned,
        (errorMessage) => {
          // Ignore continuous scan errors
        }
      );

      setStatus({ type: "loading", message: "Point camera at Aadhaar QR code" });
    } catch (error) {
      console.error("Error starting scanner:", error);
      setStatus({ type: "error", message: "Camera access denied or not available" });
      isScanningRef.current = false;
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
      html5QrCodeRef.current = null;
    }
    isScanningRef.current = false;
  };

  const onQRCodeScanned = async (decodedText) => {
    await stopScanner();
    setStatus({ type: "loading", message: "Processing QR code..." });

    const result = parseAadhaarQR(decodedText);

    if (result.success) {
      const isValidAadhaar = validateAadhaarNumber(result.data.uid);
      setExtractedData(result.data);
      setStatus({
        type: "success",
        message: isValidAadhaar
          ? "Aadhaar data extracted successfully!"
          : "Data extracted (UID validation pending)",
      });
    } else {
      setStatus({ type: "error", message: result.error });
      // Restart scanner after error
      setTimeout(() => startScannerFn(), 2000);
    }
  };

  const handleTabChange = async (tab) => {
    if (tab === activeTab) return;

    await stopScanner();
    setActiveTab(tab);
    setStatus(null);
    setExtractedData(null);
    setPreviewImage(null);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processImageFile(file);
    }
  };

  const processImageFile = async (file) => {
    setStatus({ type: "loading", message: "Reading image..." });

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    try {
      // First try to detect QR code in the image
      setStatus({ type: "loading", message: "Scanning for QR code..." });

      const html5QrCode = new Html5Qrcode("qr-reader-upload", { verbose: false });

      try {
        const qrResult = await html5QrCode.scanFile(file, true);
        html5QrCode.clear();

        // QR code found, parse it
        const result = parseAadhaarQR(qrResult);
        if (result.success) {
          setExtractedData(result.data);
          setStatus({ type: "success", message: "Aadhaar QR code detected and parsed!" });
          return;
        }
      } catch (qrError) {
        // No QR code found, proceed with OCR
        console.log("No QR code found, trying OCR...");
        html5QrCode.clear();
      }

      // Fall back to OCR
      setStatus({ type: "loading", message: "Extracting text with OCR (this may take a moment)..." });

      if (!workerRef.current) {
        // Use English + Hindi for better Aadhaar card recognition
        workerRef.current = await createWorker("eng+hin");
      }

      const {
        data: { text },
      } = await workerRef.current.recognize(file);

      console.log("OCR Text:", text);

      const result = parseAadhaarOCR(text);

      if (result.success && (result.data.uid || result.data.firstName || result.data.gender)) {
        setExtractedData(result.data);
        setStatus({
          type: "success",
          message: result.confidence === "medium"
            ? "Data extracted via OCR. Please verify the details."
            : "Data extracted. Please verify all fields.",
        });
      } else {
        setStatus({
          type: "error",
          message: "Could not extract Aadhaar data. Please try a clearer image or use QR scan.",
        });
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setStatus({ type: "error", message: "Failed to process image. Please try again." });
    }
  };

  const handleConfirm = () => {
    if (extractedData) {
      onDataExtracted(extractedData);
      handleClose();
    }
  };

  const handleClose = async () => {
    await stopScanner();
    setStatus(null);
    setExtractedData(null);
    setPreviewImage(null);
    setActiveTab("scan");
    onClose();
  };

  const handleRetry = async () => {
    setStatus(null);
    setExtractedData(null);
    setPreviewImage(null);

    if (activeTab === "scan") {
      startScannerFn();
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Scan Aadhaar Card</ModalTitle>
          <CloseButton onClick={handleClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <TabContainer>
            <Tab active={activeTab === "scan"} onClick={() => handleTabChange("scan")}>
              <Camera />
              Scan QR
            </Tab>
            <Tab active={activeTab === "upload"} onClick={() => handleTabChange("upload")}>
              <Upload />
              Upload Image
            </Tab>
          </TabContainer>

          {activeTab === "scan" && (
            <ScannerContainer>
              <QRReader id="qr-reader" ref={scannerRef} />
            </ScannerContainer>
          )}

          {activeTab === "upload" && (
            <>
              <div id="qr-reader-upload" style={{ display: "none" }} />
              {previewImage ? (
                <ScannerContainer>
                  <PreviewImage src={previewImage} alt="Aadhaar preview" />
                </ScannerContainer>
              ) : (
                <UploadArea
                  isDragging={isDragging}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <UploadIcon>
                    <Upload />
                  </UploadIcon>
                  <UploadText>
                    Click to upload or drag and drop
                    <br />
                    <UploadHint>Supports JPG, PNG, PDF (max 5MB)</UploadHint>
                  </UploadText>
                </UploadArea>
              )}
              <HiddenInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </>
          )}

          {status && (
            <StatusMessage type={status.type}>
              {status.type === "loading" && <LoadingSpinner />}
              {status.type === "success" && <CheckCircle />}
              {status.type === "error" && <AlertCircle />}
              {status.message}
            </StatusMessage>
          )}

          {extractedData && (
            <ExtractedData>
              {extractedData.firstName && (
                <DataRow>
                  <DataLabel>First Name</DataLabel>
                  <DataValue>{extractedData.firstName}</DataValue>
                </DataRow>
              )}
              {extractedData.middleName && (
                <DataRow>
                  <DataLabel>Middle Name</DataLabel>
                  <DataValue>{extractedData.middleName}</DataValue>
                </DataRow>
              )}
              {extractedData.lastName && (
                <DataRow>
                  <DataLabel>Last Name</DataLabel>
                  <DataValue>{extractedData.lastName}</DataValue>
                </DataRow>
              )}
              {extractedData.uid && (
                <DataRow>
                  <DataLabel>Aadhaar Number</DataLabel>
                  <DataValue>{extractedData.uid}</DataValue>
                </DataRow>
              )}
              {extractedData.dateOfBirth && (
                <DataRow>
                  <DataLabel>Date of Birth</DataLabel>
                  <DataValue>{extractedData.dateOfBirth}</DataValue>
                </DataRow>
              )}
              {extractedData.gender && (
                <DataRow>
                  <DataLabel>Gender</DataLabel>
                  <DataValue>{extractedData.gender}</DataValue>
                </DataRow>
              )}
              {extractedData.address && (
                <DataRow>
                  <DataLabel>Address</DataLabel>
                  <DataValue>{extractedData.address}</DataValue>
                </DataRow>
              )}
            </ExtractedData>
          )}
        </ModalBody>

        <ModalFooter>
          {extractedData ? (
            <>
              <Button onClick={handleRetry}>Scan Again</Button>
              <Button variant="primary" onClick={handleConfirm}>
                Use This Data
              </Button>
            </>
          ) : (
            <Button onClick={handleClose}>Cancel</Button>
          )}
        </ModalFooter>
      </Modal>
    </Overlay>
  );
};

export default AadhaarScanner;
