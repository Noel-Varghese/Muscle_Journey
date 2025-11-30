import cloudinary
import cloudinary.uploader
import cloudinary.api

cloud_name="YOUR-CLOUDINARY-NAME"
api_key="YOUR-API-KEY"
api_secret="YOUR-API-SECRET"

cloudinary.config(
    cloud_name=cloud_name,
    api_key=api_key,
    api_secret=api_secret,
    secure=True
)
