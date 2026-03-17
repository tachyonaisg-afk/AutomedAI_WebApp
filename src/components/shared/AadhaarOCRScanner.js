import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import {
    Camera,
    Upload,
    X,
    CheckCircle,
    RotateCcw
} from "lucide-react";

const Overlay = styled.div`
position:fixed;
inset:0;
// background:rgba(0,0,0,0.75);
display:flex;
align-items:center;
justify-content:center;
z-index:3000;
backdrop-filter:blur(8px);
`;

const Modal = styled.div`
width:560px;
background:linear-gradient(145deg,#ffff,#f5f5f5);
border-radius:14px;
padding:25px;
color:white;
display:flex;
flex-direction:column;
gap:18px;
box-shadow:0 10px 40px rgba(0,0,0,0.6);
`;

const Title = styled.h2`
margin:0;
font-size:20px;
text-align:center;
color:#3c81c7;
`;

const Video = styled.video`
width:100%;
border-radius:10px;
`;

const Preview = styled.img`
width:100%;
border-radius:10px;
`;

const ButtonRow = styled.div`
display:flex;
gap:10px;
justify-content:center;
flex-wrap:wrap;
`;

const Button = styled.button`
padding:10px 16px;
border:none;
border-radius:8px;
background:#3c81c7;
color:white;
cursor:pointer;
font-weight:600;
transition:0.2s;
display:flex;
align-items:center;
gap:6px;

:hover{
transform:translateY(-1px);
background:#3c81c7;
}

:disabled{
opacity:0.6;
cursor:not-allowed;
}
`;

const UploadInput = styled.input`
display:none;
`;

const Loader = styled.div`
border:4px solid rgba(255,255,255,0.1);
border-top:4px solid #3c81c7;
border-radius:50%;
width:40px;
height:40px;
animation:spin 1s linear infinite;
margin:auto;

@keyframes spin{
0%{transform:rotate(0deg)}
100%{transform:rotate(360deg)}
}
`;

const Frame = styled.div`
position:absolute;
width:80%;
height:60%;
border:3px dashed rgba(255,255,255,0.8);
top:50%;
left:50%;
transform:translate(-50%,-50%);
border-radius:10px;
pointer-events:none;
`;

const AadhaarOCRScanner = ({ isOpen, onClose, onDataExtracted }) => {

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const streamRef = useRef(null);
    const [step, setStep] = useState("front");
    const [frontData, setFrontData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [captured, setCaptured] = useState(null);

    useEffect(() => {

        if (!isOpen) return;

        setStep("front");
        setFrontData(null);
        setCaptured(null);

        navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        }).then(s => {

            streamRef.current = s;

            if (videoRef.current) {
                videoRef.current.srcObject = s;
                videoRef.current.play();
            }

        });

        return () => {

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

        };

    }, [isOpen]);


    const captureImage = () => {

        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        canvas.getContext("2d").drawImage(video, 0, 0);

        const dataUrl = canvas.toDataURL("image/jpeg");

        setCaptured(dataUrl);

        video.pause();   // freeze camera
    };

    const retake = () => {

        setCaptured(null);

        const video = videoRef.current;

        if (video && streamRef.current) {
            video.srcObject = streamRef.current;
            video.play();
        }

    };

    useEffect(() => {

        if (streamRef.current && videoRef.current) {

            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play();

        }

    }, [step]);

    const formatDOB = (dob, year) => {
        // ✅ Case 1: Full DOB exists (like 12/05/1998)
        if (dob) {
            const parts = dob.includes("/") ? dob.split("/") : dob.split("-");
            if (parts.length === 3) {
                const [dd, mm, yyyy] = parts;
                return `${yyyy}-${mm}-${dd}`; // ISO format
            }
        }

        // ✅ Case 2: Only year_of_birth exists
        if (year) {
            const cleanYear = year.toString().slice(0, 4);
            return `${cleanYear}-01-01`; // fallback DOB
        }

        return "";
    };

    const sendToOCR = async (imageBlob) => {

        setLoading(true);

        const formData = new FormData();
        formData.append("file", imageBlob);

        const res = await fetch(
            "https://aadhar-ocr-api-631049492115.asia-south1.run.app/ocr/aadhar",
            { method: "POST", body: formData }
        );

        const data = await res.json();

        if (!data.success) {
            alert("OCR failed");
            setLoading(false);
            return;
        }

        if (step === "front") {

            setFrontData(data);
            setStep("back");
            setCaptured(null);
            setLoading(false);
            return;

        }

        const merged = {
            ...frontData.data,
            ...data.data
        };

        const nameParts = merged.name?.split(" ") || [];
        const isDOBEstimated = !merged.dob && merged.year_of_birth;
        const mapped = {
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            uid: merged.aadhar_number?.replace(/\s/g, ""),
            gender: merged.gender,
            dateOfBirth: formatDOB(merged.dob, merged.year_of_birth),
            isDOBEstimated,
            address: merged.address,
            district: merged.district,
            state: merged.state,
            pincode: merged.pincode,
            photo: frontData.face_base64
        };

        onDataExtracted(mapped);

        setLoading(false);

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }

        onClose();

    };

    const confirmCapture = async () => {

        const blob = await fetch(captured).then(r => r.blob());

        sendToOCR(blob);

    };

    const handleUpload = async (e) => {

        const file = e.target.files[0];
        if (!file) return;

        sendToOCR(file);

    };
    useEffect(() => {

        if (!captured && videoRef.current && streamRef.current) {

            const video = videoRef.current;

            video.srcObject = streamRef.current;

            video.play().catch(err => {
                console.warn("Video play prevented:", err);
            });

        }

    }, [captured]);

    if (!isOpen) return null;

    return (

        <Overlay>

            <Modal>

                <Title>
                    {step === "front"
                        ? "Step 1 of 2 — Scan Aadhaar Front"
                        : "Step 2 of 2 — Scan Aadhaar Back"}
                </Title>

                {loading ? (

                    <>
                        <Loader />
                        <p style={{ textAlign: "center", color: "#3c81c7", fontWeight: 600 }}>
                            Processing OCR...
                        </p>
                    </>

                ) : captured ? (

                    <>
                        <Preview src={captured} />
                        <ButtonRow>

                            <Button onClick={confirmCapture}>
                                <CheckCircle size={18} />
                                Confirm
                            </Button>

                            <Button onClick={retake}>
                                <RotateCcw size={18} />
                                Retake
                            </Button>

                        </ButtonRow>
                    </>

                ) : (

                    <>
                        <div style={{ position: "relative" }}>

                            <Video ref={videoRef} autoPlay playsInline />

                            <Frame />

                        </div>
                    </>

                )}

                <canvas ref={canvasRef} style={{ display: "none" }} />

                <ButtonRow>

                    <Button onClick={captureImage} disabled={loading || captured}>
                        <Camera size={18} />
                        Capture
                    </Button>

                    <Button onClick={() => fileInputRef.current.click()}>
                        <Upload size={18} />
                        Upload Image
                    </Button>

                    <Button onClick={onClose}>
                        <X size={18} />
                        Cancel
                    </Button>

                </ButtonRow>

                <UploadInput
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleUpload}
                />

            </Modal>

        </Overlay>

    );

};

export default AadhaarOCRScanner;