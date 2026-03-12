# Jackettio

Selfhosted Stremio addon that provides torrent streams from selected torrent providers via Jackett

## Features

- Resolve streams using Jackett and Debrid (debrid-link, alldebrid, real-debrid)
- Public / Private trackers
- TV packs priority
- Sorting
- Qualities filter
- Excludes keywords
- Good performances (caching of requests / search, prepare next episode ...)

## Manual installation

```sh
# Create env file
touch .env

# Add settings to env file, change these settings with yours
# See configuration below
echo "JACKETT_URL=http://localhost:9117" >> .env
echo "JACKETT_API_KEY=key" >> .env

# Create data volume
docker volume create jackettio_data

# Run the container
docker run --env-file .env \
    -v jackettio_data:/data \
    -e DATA_FOLDER=/data \
    --name jackettio \
    -p 4000:4000 \
    -d demydiuk/jackettio:latest
```

## Configuration

Jackettio is designed for selfhosted, whether for personal or public use. As a server owner, effortlessly configure many settings with environement variables.

- **Addon ID** `ADDON_ID` Change the `id` field in stremio manifest
- **Default user settings:** `DEFAULT_*` All default settings available for user configuration on the /configure page are fully customizable
- **Immulatable user settings:** `IMMULATABLE_USER_CONFIG_KEYS` List of user settings that will no longer be accessible for modification or viewing on the /configure page. Example: `maxTorrents,priotizePackTorrents`
- And mores ..., see all configurations in [config.js file](https://github.com/Telkaoss/jackettio/blob/master/src/lib/config.js).
