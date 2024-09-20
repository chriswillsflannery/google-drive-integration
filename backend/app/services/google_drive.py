from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
import io

class GoogleDriveService:
    def __init__(self, credentials):
        self.service = build('drive', 'v3', credentials=credentials)
    
    def list_files(self):
        try:
            results = self.service.files().list(
                pageSize=10,
                fields="nextPageToken, files(id, name, mimeType, modifiedTime)"
            ).execute()
            files = results.get('files', [])
            print(f"files got from Google drive: {files}")
            return files
        except Exception as e:
            print(f"Error fetcing files from Google drive: {str(e)}")
            raise

    def upload_file(self, file, file_name):
        file_metadata = {'name': file_name}
        media = MediaIoBaseUpload(file, mimetype=file.content_type, resumable=True)
        file = self.service.files().create(body=file_metadata, media_body=media, fields='id,name,mimeType,modifiedTime').execute()
        return file

    def download_file(self, file_id):
        pass

    def delete_file(self, file_id):
        pass