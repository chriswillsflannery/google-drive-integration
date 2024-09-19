from flask import Blueprint, jsonify, request, session
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from app.services.google_drive import GoogleDriveService
import os

bp = Blueprint('main', __name__)
current_dir = os.path.dirname(os.path.abspath(__file__))

client_secrets_file = os.path.join(current_dir, '..', 'client_secrets.json')

#oath 2.0
flow = Flow.from_client_secrets_file(
    'client_secrets.json',
    scopes=['https://www.googleapis.com/auth/drive.file']
)
flow.redirect_uri = 'http://localhost:5000/oauth2callback'

@bp.route('/auth')
def auth():
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    session['state'] = state
    return jsonify({'auth_url': authorization_url})

@bp.route('/oauth2callback')
def oauth2callback():
    flow.fetch_token(authorization_response=request.url)
    credentials= flow.credentials
    session['credentials'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }
    return 'Auth success - you can close the window'

@bp.route('/list_files')
def list_files():
    if 'credentials' not in session:
        return jsonify({ 'error': 'Err: not authenticated' }), 401
    credentials = Credentials(**session['credentials'])
    drive_service = GoogleDriveService(credentials)
    files = drive_service.list_files()
    return jsonify(files)

@bp.route('/upload_file', methods=['POST'])
def upload_file():
    if 'credentials' not in session:
        return jsonify({ 'error': 'Err: not authenticated' }), 401
    if 'file' not in request.files:
        return jsonify({ 'error': 'Err: no file' }), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({ 'error': 'Err: no selected file' }), 400
    
@bp.route('/download_file/<file_id>')
def download_file(file_id):
    if 'credentials' not in session:
        return jsonify({ 'error': 'Err: not authenticated' }), 401
    credentials = Credentials(**session['credentials'])
    drive_service = GoogleDriveService(credentials)
    file_content = drive_service.download_file(file_id)
    return file_content

@bp.route('/delete_file/<file_id>')
def delete_file(file_id):
    if 'credentials' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    credentials = Credentials(**session['credentials'])
    drive_service = GoogleDriveService(credentials)
    drive_service.delete_file(file_id)
    return jsonify({'success': True})