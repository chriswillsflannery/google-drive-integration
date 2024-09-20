import os
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # dev testing purposes only

from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    # secret key to sign session data
    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY') or 'dev-secret-key'
    CORS(app, supports_credentials=True)

    from app.routes import bp as main_bp
    app.register_blueprint(main_bp)

    return app