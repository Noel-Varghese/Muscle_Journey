import cloudinary
import cloudinary.uploader
import cloudinary.api

cloud_name="name of cloud"
api_key="api key"
api_secret="api secret"

cloudinary.config(
    cloud_name=cloud_name,
    api_key=api_key,
    api_secret=api_secret,
    secure=True
)
