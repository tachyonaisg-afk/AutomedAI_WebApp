import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Html5Qrcode } from "html5-qrcode";
import { X, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { parseAadhaarQR } from "../../utils/aadhaarParser";

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

const ScannerContainer = styled.div`
  width: 100%;
  min-height: 300px;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ScanHint = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 10;
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

const DataSectionTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #4a90e2;
  text-transform: uppercase;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
`;

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;

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
  display: flex;
  align-items: center;
  gap: 6px;

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
  const [status, setStatus] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [html5QrCode, setHtml5QrCode] = useState(null);

  const qrReaderRef = useRef(null);

  // Start QR scanner when modal opens
  useEffect(() => {
    if (isOpen) {
      startQRScanner();
    }

    return () => {
      stopQRScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopQRScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startQRScanner = async () => {
    try {
      setStatus({ type: "loading", message: "Starting QR scanner..." });

      // Create scanner instance
      const scanner = new Html5Qrcode("qr-reader", { verbose: false });
      setHtml5QrCode(scanner);

      // Start scanning
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          console.log("QR Code detected:", decodedText);
          processQRCode(decodedText);
        },
        (errorMessage) => {
          // Ignore scan errors (happens when no QR in view)
        }
      );

      setStatus({ type: "loading", message: "Position QR code within frame" });
    } catch (error) {
      console.error("Error starting QR scanner:", error);
      setStatus({ type: "error", message: "Camera access denied or not available" });
    }
  };

  const stopQRScanner = async () => {
    if (html5QrCode && html5QrCode.isScanning) {
      try {
        await html5QrCode.stop();
        await html5QrCode.clear();
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
  };

  const processQRCode = (qrData) => {
    setStatus({ type: "loading", message: "Processing QR code..." });

    // Parse the QR data
    const result = parseAadhaarQR(qrData);

    if (result.success) {
      setExtractedData(result.data);
      setStatus({ type: "success", message: "Aadhaar data extracted successfully!" });

      // Stop scanning
      stopQRScanner();
    } else {
      console.error("Failed to parse QR:", result.error);
      setStatus({ type: "error", message: result.error || "Failed to parse QR code" });
    }
  };

  const handleConfirm = () => {
    if (extractedData) {
      onDataExtracted(extractedData);
      handleClose();
    }
  };

  const handleClose = async () => {
    await stopQRScanner();
    setStatus(null);
    setExtractedData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Scan Aadhaar QR Code</ModalTitle>
          <CloseButton onClick={handleClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ScannerContainer>
            <div id="qr-reader" ref={qrReaderRef} style={{ width: "100%" }}></div>
            <ScanHint>Position Aadhaar QR code within frame</ScanHint>
          </ScannerContainer>

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
              <DataSectionTitle>Extracted Aadhaar Data</DataSectionTitle>
              {(extractedData.firstName || extractedData.middleName || extractedData.lastName) && (
                <DataRow>
                  <DataLabel>Name</DataLabel>
                  <DataValue>
                    {[extractedData.firstName, extractedData.middleName, extractedData.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </DataValue>
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
              {extractedData.pincode && (
                <DataRow>
                  <DataLabel>Pincode</DataLabel>
                  <DataValue>{extractedData.pincode}</DataValue>
                </DataRow>
              )}
            </ExtractedData>
          )}
        </ModalBody>

        <ModalFooter>
          {extractedData ? (
            <Button variant="primary" onClick={handleConfirm}>
              Use This Data
            </Button>
          ) : (
            <Button onClick={handleClose}>Cancel</Button>
          )}
        </ModalFooter>
      </Modal>
    </Overlay>
  );
};

export default AadhaarScanner;
