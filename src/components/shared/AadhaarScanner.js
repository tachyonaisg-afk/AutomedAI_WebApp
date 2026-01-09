import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Html5Qrcode } from "html5-qrcode";
import { createWorker } from "tesseract.js";
import { X, Camera, Upload, Loader, CheckCircle, AlertCircle, RotateCcw } from "lucide-react";
import { parseAadhaarQR, parseAadhaarOCR } from "../../utils/aadhaarParser";

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

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${(props) => (props.active ? "#4a90e2" : props.completed ? "#2e7d32" : "#999")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
`;

const StepNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => (props.active ? "#4a90e2" : props.completed ? "#2e7d32" : "#e0e0e0")};
  color: ${(props) => (props.active || props.completed ? "white" : "#666")};
`;

const StepDivider = styled.div`
  width: 30px;
  height: 2px;
  background-color: ${(props) => (props.completed ? "#2e7d32" : "#e0e0e0")};
`;

const ScannerContainer = styled.div`
  width: 100%;
  min-height: 280px;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const VideoPreview = styled.video`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
`;

const CaptureButton = styled.button`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: white;
  border: 4px solid #4a90e2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #e3f2fd;
    transform: translateX(-50%) scale(1.05);
  }

  &:active {
    transform: translateX(-50%) scale(0.95);
  }

  svg {
    width: 28px;
    height: 28px;
    color: #4a90e2;
  }
`;

const CaptureHint = styled.div`
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

  ${(props) =>
    props.type === "info" &&
    `
    background-color: #fff3e0;
    color: #e65100;
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

const DataSection = styled.div`
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
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

const HiddenCanvas = styled.canvas`
  display: none;
`;

const SkipButton = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 8px;

  &:hover {
    color: #357abd;
  }
`;

const AadhaarScanner = ({ isOpen, onClose, onDataExtracted }) => {
  const [activeTab, setActiveTab] = useState("scan");
  const [status, setStatus] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  // Two-step capture state
  const [captureStep, setCaptureStep] = useState(1); // 1 = front, 2 = back
  const [frontData, setFrontData] = useState(null);
  const [backData, setBackData] = useState(null);
  const [combinedData, setCombinedData] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const workerRef = useRef(null);

  // Start camera when scan tab is active
  useEffect(() => {
    if (isOpen && activeTab === "scan" && !previewImage) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeTab, captureStep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraReady(false);
      setStatus({ type: "loading", message: "Starting camera..." });

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraReady(true);
          const hint = captureStep === 1
            ? "Position FRONT side of Aadhaar card"
            : "Position BACK side of Aadhaar card";
          setStatus({ type: "loading", message: hint });
        };
      }
    } catch (error) {
      console.error("Error starting camera:", error);
      setStatus({ type: "error", message: "Camera access denied or not available" });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setStatus({ type: "loading", message: "Capturing image..." });

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setPreviewImage(imageUrl);
        stopCamera();
        await processImageFile(blob, captureStep === 1 ? "front" : "back");
      }
    }, "image/jpeg", 0.9);
  };

  const processImageFile = async (file, side = "front") => {
    setStatus({ type: "loading", message: `Processing ${side} side...` });

    try {
      // First try QR code (only on front side)
      if (side === "front") {
        setStatus({ type: "loading", message: "Scanning for QR code..." });

        let tempDiv = document.getElementById("qr-reader-temp");
        if (!tempDiv) {
          tempDiv = document.createElement("div");
          tempDiv.id = "qr-reader-temp";
          tempDiv.style.display = "none";
          document.body.appendChild(tempDiv);
        }

        const html5QrCode = new Html5Qrcode("qr-reader-temp", { verbose: false });

        try {
          const qrResult = await html5QrCode.scanFile(file, true);
          html5QrCode.clear();

          console.log("QR Code found:", qrResult);

          const result = parseAadhaarQR(qrResult);
          if (result.success) {
            // QR has all data, no need for back side
            await new Promise((resolve) => setTimeout(resolve, 50));
            onDataExtracted(result.data);
            await handleClose();
            return;
          }
        } catch (qrError) {
          console.log("No QR code found, trying OCR...");
          try {
            html5QrCode.clear();
          } catch (e) {}
        }
      }

      // OCR processing
      setStatus({ type: "loading", message: "Extracting text with OCR..." });

      if (!workerRef.current) {
        setStatus({ type: "loading", message: "Loading OCR engine..." });
        workerRef.current = await createWorker("eng+hin");
      }

      const { data: { text } } = await workerRef.current.recognize(file);
      console.log(`OCR Text (${side}):`, text);

      const result = parseAadhaarOCR(text);

      if (side === "front") {
        // Store front side data
        const frontExtracted = {
          firstName: result.data?.firstName || "",
          middleName: result.data?.middleName || "",
          lastName: result.data?.lastName || "",
          dateOfBirth: result.data?.dateOfBirth || "",
          gender: result.data?.gender || "",
          uid: result.data?.uid || "",
        };
        setFrontData(frontExtracted);

        // Check if we got essential data
        if (frontExtracted.firstName || frontExtracted.uid || frontExtracted.gender) {
          setStatus({
            type: "success",
            message: "Front side captured! Now capture the back side for address."
          });
          // Move to step 2
          setCaptureStep(2);
          setPreviewImage(null);
          // Restart camera for back side
          setTimeout(() => startCamera(), 500);
        } else {
          setStatus({
            type: "error",
            message: "Could not read front side. Please try again.",
          });
        }
      } else {
        // Store back side data (address)
        const backExtracted = {
          address: result.data?.address || "",
          pincode: result.data?.pincode || "",
          district: result.data?.district || "",
          state: result.data?.state || "",
        };
        setBackData(backExtracted);

        // Combine front and back data
        const combined = {
          ...frontData,
          ...backExtracted,
        };
        setCombinedData(combined);

        if (backExtracted.address || backExtracted.pincode) {
          setStatus({ type: "success", message: "Both sides captured successfully!" });
        } else {
          setStatus({
            type: "info",
            message: "Back side captured. Address may be incomplete."
          });
        }
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setStatus({ type: "error", message: "Failed to process image. Please try again." });
    }
  };

  const handleTabChange = async (tab) => {
    if (tab === activeTab) return;

    stopCamera();
    setActiveTab(tab);
    setStatus(null);
    setPreviewImage(null);
    // Reset capture state when changing tabs
    setCaptureStep(1);
    setFrontData(null);
    setBackData(null);
    setCombinedData(null);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      const side = captureStep === 1 ? "front" : "back";
      processImageFile(file, side);
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
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      const side = captureStep === 1 ? "front" : "back";
      processImageFile(file, side);
    }
  };

  const handleConfirm = () => {
    if (combinedData) {
      onDataExtracted(combinedData);
      handleClose();
    } else if (frontData) {
      // If only front data available
      onDataExtracted(frontData);
      handleClose();
    }
  };

  const handleSkipBackSide = () => {
    // Use only front data
    if (frontData) {
      onDataExtracted(frontData);
      handleClose();
    }
  };

  const handleClose = async () => {
    stopCamera();
    setStatus(null);
    setPreviewImage(null);
    setActiveTab("scan");
    setCaptureStep(1);
    setFrontData(null);
    setBackData(null);
    setCombinedData(null);
    onClose();
  };

  const handleRetry = async () => {
    setStatus(null);
    setPreviewImage(null);

    if (activeTab === "scan") {
      startCamera();
    }
  };

  const handleStartOver = () => {
    setCaptureStep(1);
    setFrontData(null);
    setBackData(null);
    setCombinedData(null);
    setPreviewImage(null);
    setStatus(null);
    startCamera();
  };

  if (!isOpen) return null;

  const dataToShow = combinedData || (frontData && backData ? { ...frontData, ...backData } : null);

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
              Capture Card
            </Tab>
            <Tab active={activeTab === "upload"} onClick={() => handleTabChange("upload")}>
              <Upload />
              Upload Image
            </Tab>
          </TabContainer>

          {/* Step Indicator */}
          <StepIndicator>
            <Step active={captureStep === 1} completed={captureStep > 1}>
              <StepNumber active={captureStep === 1} completed={captureStep > 1}>
                {captureStep > 1 ? "✓" : "1"}
              </StepNumber>
              Front Side
            </Step>
            <StepDivider completed={captureStep > 1} />
            <Step active={captureStep === 2} completed={!!backData}>
              <StepNumber active={captureStep === 2} completed={!!backData}>
                {backData ? "✓" : "2"}
              </StepNumber>
              Back Side
            </Step>
          </StepIndicator>

          {activeTab === "scan" && (
            <ScannerContainer>
              {previewImage ? (
                <PreviewImage src={previewImage} alt="Captured Aadhaar" />
              ) : (
                <>
                  <VideoPreview ref={videoRef} autoPlay playsInline muted />
                  {cameraReady && (
                    <>
                      <CaptureHint>
                        {captureStep === 1 ? "Capture FRONT side" : "Capture BACK side (Address)"}
                      </CaptureHint>
                      <CaptureButton onClick={captureImage}>
                        <Camera />
                      </CaptureButton>
                    </>
                  )}
                </>
              )}
              <HiddenCanvas ref={canvasRef} />
            </ScannerContainer>
          )}

          {activeTab === "upload" && (
            <>
              {previewImage ? (
                <ScannerContainer style={{ backgroundColor: "#f8f9fa" }}>
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
                    {captureStep === 1
                      ? "Upload FRONT side of Aadhaar"
                      : "Upload BACK side of Aadhaar"}
                    <br />
                    <UploadHint>Supports JPG, PNG (max 5MB)</UploadHint>
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
              {status.type === "info" && <AlertCircle />}
              {status.message}
            </StatusMessage>
          )}

          {/* Skip back side option */}
          {captureStep === 2 && !backData && frontData && (
            <div style={{ textAlign: "center" }}>
              <SkipButton onClick={handleSkipBackSide}>
                Skip back side (continue without address)
              </SkipButton>
            </div>
          )}

          {/* Show extracted data */}
          {(dataToShow || frontData) && (
            <ExtractedData>
              {frontData && (
                <DataSection>
                  <DataSectionTitle>Front Side Data</DataSectionTitle>
                  {frontData.firstName && (
                    <DataRow>
                      <DataLabel>Name</DataLabel>
                      <DataValue>
                        {[frontData.firstName, frontData.middleName, frontData.lastName]
                          .filter(Boolean)
                          .join(" ")}
                      </DataValue>
                    </DataRow>
                  )}
                  {frontData.uid && (
                    <DataRow>
                      <DataLabel>Aadhaar Number</DataLabel>
                      <DataValue>{frontData.uid}</DataValue>
                    </DataRow>
                  )}
                  {frontData.dateOfBirth && (
                    <DataRow>
                      <DataLabel>Date of Birth</DataLabel>
                      <DataValue>{frontData.dateOfBirth}</DataValue>
                    </DataRow>
                  )}
                  {frontData.gender && (
                    <DataRow>
                      <DataLabel>Gender</DataLabel>
                      <DataValue>{frontData.gender}</DataValue>
                    </DataRow>
                  )}
                </DataSection>
              )}

              {backData && (
                <DataSection>
                  <DataSectionTitle>Back Side Data (Address)</DataSectionTitle>
                  {backData.address && (
                    <DataRow>
                      <DataLabel>Address</DataLabel>
                      <DataValue>{backData.address}</DataValue>
                    </DataRow>
                  )}
                  {backData.pincode && (
                    <DataRow>
                      <DataLabel>Pincode</DataLabel>
                      <DataValue>{backData.pincode}</DataValue>
                    </DataRow>
                  )}
                  {backData.district && (
                    <DataRow>
                      <DataLabel>District</DataLabel>
                      <DataValue>{backData.district}</DataValue>
                    </DataRow>
                  )}
                  {backData.state && (
                    <DataRow>
                      <DataLabel>State</DataLabel>
                      <DataValue>{backData.state}</DataValue>
                    </DataRow>
                  )}
                </DataSection>
              )}
            </ExtractedData>
          )}
        </ModalBody>

        <ModalFooter>
          {(combinedData || backData) ? (
            <>
              <Button onClick={handleStartOver}>
                <RotateCcw size={16} />
                Start Over
              </Button>
              <Button variant="primary" onClick={handleConfirm}>
                Use This Data
              </Button>
            </>
          ) : status?.type === "error" ? (
            <>
              <Button onClick={handleRetry}>Try Again</Button>
              <Button onClick={handleClose}>Cancel</Button>
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
