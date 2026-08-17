import { renderPage } from "./config-page.js";

export function renderLandingPage(): string {
  return renderPage(
    "TorFuse",
    "A TorBox-powered Stremio addon built for fast torrent discovery and intelligent stream selection.",
    `
      <div class="status">
        <span class="statusDot"></span>
        Currently in development
      </div>

      <div class="buttons">
        <a
          class="button"
          href="/configure"
        >
          Configure addon
        </a>

        <a
          class="button secondary"
          href="https://github.com/simplyuncool/torfuse"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>

      <div class="footer">
        Built by Mohamed Ali · TorFuse
      </div>
    `
  );
}