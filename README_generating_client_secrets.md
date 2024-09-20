How to Obtain Your client_secrets.json for Google Drive Integration
To run this project locally, you'll need to set up your own Google Cloud project and obtain a client_secrets.json file. Follow these steps:

Create a Google Cloud Project

Go to the Google Cloud Console.
Click on the project drop-down and select "New Project".
Give your project a name and click "Create".

Enable the Google Drive API

In the Google Cloud Console, go to "APIs & Services" > "Library".
Search for "Google Drive API" and select it.
Click "Enable".

Create OAuth 2.0 Client ID

Go to "APIs & Services" > "Credentials".
Click "Create Credentials" and select "OAuth client ID".
If prompted, configure the OAuth consent screen:

Choose "External" as the user type.
Fill in the required fields (App name, User support email, Developer contact information).
For scopes, add the Google Drive API scope you need (e.g., .../auth/drive.file).
Add your email and any test users' emails under "Test users".

Back in the "Create OAuth client ID" screen:

Choose "Web application" as the application type.
Name your OAuth 2.0 client.
Under "Authorized redirect URIs", add http://localhost:5000/oauth2callback.
Click "Create".

Download the Client Configuration

After creating the client ID, you'll see a pop-up with your client ID and client secret.
Click "Download JSON".
Rename the downloaded file to client_secrets.json.

Add client_secrets.json to Your Project

Move the client_secrets.json file to the root directory of this project.
Important: Make sure client_secrets.json is listed in your .gitignore file to prevent accidentally committing it.

Update Your Application

If necessary, update the CLIENT_SECRETS_FILE path in your application code to point to your new client_secrets.json.

Security Notes

Never share your client_secrets.json file or commit it to version control.
If you suspect your client secret has been compromised, return to the Google Cloud Console, delete the compromised client ID, and create a new one.
For production deployments, consider using environment variables or a secure secret management system instead of a JSON file.

By following these steps, you'll have your own client_secrets.json file that you can use to run the application in your local development environment.