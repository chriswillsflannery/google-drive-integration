## notes:

<ul>
    <li>
        Oauth 2.0 seems to really only want to deal with https. This is fine, we can generate SSL certs for production.
        This application is for demo purposes only, so to make things simple, I've just overridden the oAuth settings.
        Now, we've forced oAuth to work with http. This is technically unsafe, but this code is local only, so, no risk.
    </li>
</ul>

### Generating client secrets (/backend/client_secrets.json):
- see README_generating_client_secrets.md