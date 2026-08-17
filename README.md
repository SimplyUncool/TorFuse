# TorFuse

A TorBox-powered Stremio addon focused on fast, intelligent torrent discovery and stream selection.

## Features

* TorBox integration
* Movie support
* TV series and episode support
* Cached torrent detection
* Resolution filtering
* Codec filtering
* HDR and Dolby Vision detection
* Release ranking
* Stremio-compatible stream results
* Configurable TorBox API key
* Stremio manifest generation

## Requirements

* A TorBox account with API access
* A Stremio installation
* Node.js 20+

## Development

```bash
npm install
npm run dev
```

TorFuse starts as a local web service. A reverse proxy or tunnel such as Cloudflare Tunnel can be used when testing the addon with Stremio.

## Configuration

TorFuse uses a configuration page to generate a unique configuration for each installation.

The TorBox API key is stored separately from the Stremio manifest URL and is not included directly in the manifest configuration.

## Project Status

TorFuse is currently under active development.

The Stremio addon, configuration system, manifest generation, and TorBox API client are in place. Live TorBox API testing and the torrent discovery pipeline are still being developed.

## Production

TorFuse is designed to run as a Node.js web service and can be deployed to platforms such as Render or other Node.js hosting providers.

## Attribution

TorFuse is developed by **Mohamed Ali**.

If you fork, modify, or redistribute TorFuse, please retain the original copyright notice and credit the original project:

**TorFuse — A fast TorBox-powered Stremio addon.**

Official repository: [TorFuse](https://github.com/simplyuncool/torfuse)

## License

TorFuse is licensed under the MIT License.

See [LICENSE](LICENSE) for the full license text.
