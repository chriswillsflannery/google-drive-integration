from flask import Blueprint, jsonify, request, session, redirect
from flask_cors import CORS
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from app.services.google_drive import GoogleDriveService
import os

# file and readonly scopes to allow all CRUD actions
SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.readonly'
]

bp = Blueprint('main', __name__)
CORS(bp, supports_credentials=True) # allow all 
current_dir = os.path.dirname(os.path.abspath(__file__))
client_secrets_file = os.path.join(current_dir, '..', 'client_secrets.json')

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1' # oauth https override

def create_flow():
    return Flow.from_client_secrets_file(
        client_secrets_file,
        scopes=SCOPES,
        redirect_uri="http://localhost:5000/oauth2callback"
    )

@bp.route('/auth')
def auth():
    flow = create_flow()
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent' # force user to choose which CRUD actions can use
    )
    session['state'] = state
    return jsonify({'auth_url': authorization_url})

@bp.route('/oauth2callback')
def oauth2callback():
    flow = create_flow()
    flow.fetch_token(authorization_response=request.url)
    credentials = flow.credentials
    session['credentials'] = { # store dict in flask session
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }
    return redirect('http://localhost:5173') # redirect to vite client


@bp.route('/list_files')
def list_files():
    if 'credentials' not in session:
        print('No credentials in session')
        return jsonify({ 'error': 'Err: not authenticated' }), 401
    credentials = Credentials(**session['credentials']) # unpack dict
    drive_service = GoogleDriveService(credentials)
    try:
        files = drive_service.list_files()
        print(f"files retrieved: {files}")
        return jsonify(files)
    except Exception as e:
        print(f"Error listing files: {str(e)}")
        return jsonify({ 'error': str(e)}), 500

@bp.route('/upload_file', methods=['POST', 'OPTIONS'])
def upload_file():
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200

    if 'credentials' not in session:
        return jsonify({ 'error': 'Not authenticated' }), 401
    if 'file' not in request.files:
        return jsonify({ 'error': 'No file part' }), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({ 'error': 'No selected file' }), 400
    
    credentials = Credentials(**session['credentials'])
    drive_service = GoogleDriveService(credentials)
    
    try:
        uploaded_file = drive_service.upload_file(file, file.filename)
        return jsonify(uploaded_file), 200
    except Exception as e:
        print(f"Error uploading file: {str(e)}")
        return jsonify({ 'error': str(e)}), 500

@bp.route('/download_file/<file_id>')
def download_file(file_id):
    if 'credentials' not in session:
        return jsonify({ 'error': 'Err: not authenticated' }), 401
    credentials = Credentials(**session['credentials'])
    drive_service = GoogleDriveService(credentials)
    file_content = drive_service.download_file(file_id)
    return file_content

@bp.route('/delete_file/<file_id>', methods=['DELETE'])
def delete_file(file_id):
    if 'credentials' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    credentials = Credentials(**session['credentials'])
    drive_service = GoogleDriveService(credentials)
    try:
        drive_service.delete_file(file_id)
        return jsonify({'success': True})
    except Exception as e:
        print(f"Error deleting file: {str(e)}")
        return jsonify({'error': str(e)}), 500