# Google Drive API integration
Application with React/Vite, Python/Flask

## How to / local development

### install dependencies

### run tests

```bash
backend unit tests:
cd backend
pytest tests/test_routes.py
```

```bash
frontend unit tests:
cd frontend
npm run test
```

```bash
playwright e2e tests:
(from project root):
npm run test:e2e
```

## notes:

<ul>
    <li>
        Oauth 2.0 seems to really only want to deal with https. This is fine, we can generate SSL certs for production.
        This application is for demo purposes only, so to make things simple, I've just overridden the oAuth settings.
        Now, we've forced oAuth to work with http. This is technically unsafe, but this code is local only, so, no risk.
    </li>
    <li>
        I've chosen to forego allowing user to specify a folder for upload. For the purposes of this application, we're
        just simply showing the 10 most recent (specified in gdrive service) files by modified data, in reverse
        chronological order, and these could be either files which are created by me or shared with me. On upload, we
        simply add the uploaded file to the root of the file storage, of files created by me.
    </li>
    <li>
        On first UI render, we check whether the user is authenticated by sending a request for files. If the user is not authenticated,
        the request fails, and nothing happens (we show button). If the user is authenticated, we show list of files. However, there is a
        brief flash where the "authenticate" button is shown before the file list is shown. An improvement here would be to show
        a loading indicator like a skeleton loader.
    </li>
    <li>
        To the best of my knowledge, file upload size is restricted to google drive API's max file size (5TB. holy crap, big if true).
        I haven't tested upload/download functionality with any massive files, but in theory, the API provides automatic chunking, reconciliation,
        fingerprinting etc. out of the box, so it should all *just work*.
        One obvious and massive improvement here would be to show file upload progress in the UI. I haven't dug deeply enough into Google drive
        API to know whether it provides an API for pause/resume upload (it probably does). Same goes for large downloads.
    </li>
    <li>
        I've included some minimal styling on UI elements, my preferred styling is with Tailwind - using raw
        style tags feels closest to that workflow without having to actually set up tailwind configs
        (time tradeoff here = focusing on most important things)
    </li>
    <li>
        Obviously, there is no typesafety anywhere in the application. If this was a need, we could use OpenAPI (swagger docs) to define all the
        API routes and then use a library to generate the Typescript types based on that schema, then use those types to type the incoming API data.
    </li>
</ul>

### Generating client secrets (/backend/client_secrets.json):
- see README_generating_client_secrets.md