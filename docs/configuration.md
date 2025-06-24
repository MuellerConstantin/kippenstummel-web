# Configuration

In order to operate the service successfully, a number of configurations are required.
Even if the web client is written as SSR (Server Side Rendering) application, the
required configuration is almost zero. Basically, we differ between two diffent types
of configurations: Build time configuration, intended to be used by the actual web client,
and runtime configuration, intended to be used by the frontend's web server responsible
for serving the web client using SSR.

Both types of configurations are defined using environment variables or as alternative
using so called environment files. If you decide to configure the service using a
config file, the service expects a file called `.env` in the project's root directory.

---

**NOTE**

The configuration of the web client is based on the technical possibilities of
[Next.js](https://nextjs.org/), see
[Next.js Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables).
In order to keep the configuration of the service as simple and straightforward as possible,
Kippenstummel Web abstracts the configuration process and only uses a part of what is technically
possible. Nevertheless, the technical principles of the Next.js still apply and are mentioned
here for the sake of completeness.

---

## Configuration Options

### Build time configuration

Build time configuration variables are in general prefixed with `NEXT_PUBLIC_`. Changing these variables
requires a rebuild of the web client. These variables are loaded and hardcoded at build time.

_None variables to configure._

### Runtime configuration

Runtime configuration variables are used by the frontend's web server responsible for serving the web client. Changing these variables
requires a restart of the web server.

| Environment Variable  | Description                                                                                                                                                           | Required |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| KIPPENSTUMMEL_API_URL | Url of the Kippenstummel API. Including the api prefix and version. (e.g. `http://<HOST>:<PORT>/api/v1`)                                                              | Yes      |
| TILE_BASE_URL         | Base Url of the tile server. The used server should support the [XYZ](https://en.wikipedia.org/wiki/Tiled_web_map) protocol in the format <BASE_URL>/{Z}/{X}/{Y}.png. | Yes      |
| TILE_USER_AGENT       | User-Agent header sent to the tile server. Default is the user agent of the web client.                                                                               | No       |
| TILE_LRU_CACHE_MAX    | Maximum number of entries in the instance specific in-memory LRU cache. Default is 500.                                                                               | No       |
| TILE_LRU_CACHE_TTL    | Time to live of cache entries in milliseconds. Default is 5 minutes.                                                                                                  | No       |
| TILE_REDIS_CACHE_URL  | Url of the Redis cache server.                                                                                                                                        | Yes      |
| TILE_REDIS_CACHE_TTL  | Time to live of cache entries in milliseconds. Default is 7 days.                                                                                                     | No       |
