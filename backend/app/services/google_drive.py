from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
import io

class GoogleDriveService:
    def __init__(self, credentials):
        self.service - build('drive', 'v3', credentials=credentials)
    
    def list_files(self):
        results = self.service.files().list(
            pageSize=10,
            fields="nextPageToken, files(id, name, mimeType, modifiedTime)"
        ).execute()
        return results.get('files', [])

    def upload_file(self, file_path, file_name):
        pass

    def download_file(self, file_id):
        pass

    def delete_file(self, file_id):
        pass