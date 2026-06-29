from fastapi import APIRouter

from app.api.v1 import auth, upload, convert, files

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(upload.router)
api_router.include_router(convert.router)
api_router.include_router(files.router)
