import React, { useState } from "react";

const ImageSplitter = () => {
  const [segments, setSegments] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => splitImage(img);
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const splitImage = (img) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const width = img.width / 3;
    const height = img.height;
    let newSegments = [];

    for (let i = 0; i < 3; i++) {
      canvas.width = width;
      canvas.height = height;
      context.clearRect(0, 0, width, height);
      context.drawImage(img, i * width, 0, width, height, 0, 0, width, height);
      newSegments.push(canvas.toDataURL("image/png"));
    }

    setSegments(newSegments);
  };

  const sendToServer = async () => {
    // base64 문자열만 추출
    const imagesPayload = segments.map((segment, i) => ({
      filename: `segment_${i + 1}.png`,
      image_data: segment.split(",")[1], // base64 부분만 추출
    }));

    // 한 번의 POST 요청으로 모두 전송
    var response = await fetch("http://localhost:8000/upload-multiple", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        images: imagesPayload,
      }),
    });
    response = await response.json()
    alert(`status:${response.status}, uploaded_count: ${response.uploaded_count}`);
  };


  // ---------- 스타일 ----------
  const containerStyle = {
    padding: '16px',
    fontFamily: 'sans-serif',
  };

  const imageRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    marginTop: '16px',
    overflowX: 'auto',
    paddingBottom: '8px',
  };

  const imageCardStyle = {
    minWidth: '200px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '8px',
    backgroundColor: '#fff',
    boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1)',
    flexShrink: 0,
  };

  const imageStyle = {
    width: '100%',
    height: 'auto',
    display: 'block',
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  return (
    <div style={containerStyle}>
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {segments.length > 0 && (
        <>
          <div style={imageRowStyle}>
            {segments.map((src, index) => (
              <div key={index} style={imageCardStyle}>
                <img src={src} alt={`Segment ${index + 1}`} style={imageStyle} />
              </div>
            ))}
          </div>
          <button style={buttonStyle} onClick={sendToServer}>
            서버로 전송
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSplitter;
