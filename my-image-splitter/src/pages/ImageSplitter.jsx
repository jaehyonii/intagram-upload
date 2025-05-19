import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ImageSplitter = () => {
  const [image, setImage] = useState(null);
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
    for (let i = 0; i < segments.length; i++) {
      const base64Image = segments[i].split(",")[1];

      await fetch("http://localhost:8000/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          filename: `segment_${i + 1}.png`,
          image_data: base64Image
        })
      });
    }
    alert("이미지를 서버로 전송했습니다.");
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Input type="file" accept="image/*" onChange={handleImageChange} />
      {segments.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {segments.map((src, index) => (
              <Card key={index}>
                <CardContent>
                  <img src={src} alt={`Segment ${index + 1}`} className="w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Button onClick={sendToServer}>
            서버로 전송
          </Button>
        </>
      )}
    </div>
  );
};

export default ImageSplitter;
