import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ImageCropSplit = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const imageRef = useRef(null);
  const [segments, setSegments] = useState([]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImage = async () => {
    const img = new Image();
    img.src = imageSrc;
    await img.decode();
    imageRef.current = img;
    splitCropAreaIntoThirds(img, croppedAreaPixels);
  };

  const splitCropAreaIntoThirds = (image, area) => {
    const { x, y, width, height } = area;
    const thirdWidth = width / 3;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const newSegments = [];

    canvas.width = thirdWidth;
    canvas.height = height;

    for (let i = 0; i < 3; i++) {
      ctx.clearRect(0, 0, thirdWidth, height);
      ctx.drawImage(
        image,
        x + i * thirdWidth,
        y,
        thirdWidth,
        height,
        0,
        0,
        thirdWidth,
        height
      );
      newSegments.push(canvas.toDataURL('image/png'));
    }

    setSegments(newSegments);
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    segments.forEach((segment, i) => {
      const base64 = segment.split(',')[1];
      zip.file(`segment_${i + 1}.png`, base64, { base64: true });
    });
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'segments.zip');
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {imageSrc && (
        <div style={{ position: 'relative', width: '100%', height: 400, marginTop: 20 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={12 / 5}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <div style={{ marginTop: 20 }}>
            <label>
              확대/축소: 
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </label>
          </div>
        </div>
      )}

      {imageSrc && (
        <button style={{ marginTop: 20 }} onClick={getCroppedImage}>
          3등분 미리보기
        </button>
      )}

      {segments.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
            {segments.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Segment ${index + 1}`}
                style={{ width: '100%', maxWidth: 200, border: '1px solid #ccc' }}
              />
            ))}
          </div>
          <button style={{ marginTop: 20 }} onClick={downloadZip}>
            ZIP 저장하기
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCropSplit;