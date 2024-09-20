import io
import sys
import os

# add parent dir of tests
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from flask import session
from app import create_app
from unittest.mock import patch, MagicMock

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_auth(client):
    res = client.get('/auth')
    assert res.status_code == 200
    assert 'auth_url' in res.json

@patch('app.routes.GoogleDriveService')
def test_list_files_authenticated(mock_drive_service, client):
    mock_drive_service.return_value.list_files.return_value = [{'id':'1', 'name':'test.txt'}]
    with client.session_transaction() as sess:
        sess['credentials'] = {'token':'fake_token'}
    res = client.get('/list_files')
    assert res.status_code == 200
    assert res.json == [{'id':'1','name':'test.txt'}]

def test_list_files_unauthenticated(client):
    res = client.get('/list_files')
    assert res.status_code == 401
    assert 'error' in res.json

@patch('app.routes.GoogleDriveService')
def test_upload_file(mock_drive_service, client):
    mock_drive_service.return_value.upload_file.return_value = {'id': '1', 'name': 'test.txt'}
    with client.session_transaction() as sess:
        sess['credentials'] = {'token': 'fake_token'}
    
    # Create an in-memory file-like object
    file_content = io.BytesIO(b"This is a test file")
    data = {'file': (file_content, 'test.txt')}
    
    res = client.post('/upload_file', data=data, content_type='multipart/form-data')
    assert res.status_code == 200
    assert res.json == {'id': '1', 'name': 'test.txt'}

@patch('app.routes.GoogleDriveService')
def test_delete_file(mock_drive_service, client):
    with client.session_transaction() as sess:
        sess['credentials'] = {'token': 'fake_token'}
    
    res = client.delete('/delete_file/1')
    assert res.status_code == 200
    assert res.json == {'success':True}
