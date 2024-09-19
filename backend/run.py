
# note that this is a development-only override so that 
# oauth respects HTTP connection for local testing
import os
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True) # dev only