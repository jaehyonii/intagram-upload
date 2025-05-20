from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import base64
import os

# uvicorn 실행용
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 또는 ["http://localhost:3000"]처럼 명시적으로 설정 가능
    allow_credentials=True,
    allow_methods=["*"],  # OPTIONS, POST, GET 등 모두 허용
    allow_headers=["*"],
)

@app.post("/upload-multiple")
async def upload_multiple(request: Request):
    data = await request.json()
    images = data.get("images", [])
    
    UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    for img in images:
        filename = img["filename"]
        image_data = base64.b64decode(img["image_data"])

        with open(f"{UPLOAD_DIR}/{filename}", "wb") as f:
            f.write(image_data)

    return {"status": "success", "uploaded_count": len(images)}

# 🔽 여기서 직접 실행되도록 설정
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
