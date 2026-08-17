function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderConfigPage(
  title: string,
  subtitle: string,
  content: string
): string {
  return renderPage(title, subtitle, content);
}

export function renderPage(
  title: string,
  subtitle: string,
  content: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <meta
    name="theme-color"
    content="#09090b"
  >

  <title>${escapeHtml(title)}</title>

  <link
    rel="icon"
    href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23ffffff'/%3E%3Cpath d='M18 18h28v8H27v8h15v8H27v12h-9V18z' fill='%2309090b'/%3E%3C/svg%3E"
  />

  <style>
    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      min-height: 100%;
    }

    body {
      min-height: 100vh;

      display: flex;
      align-items: center;
      justify-content: center;

      overflow: hidden;
      position: relative;

      background: #09090b;
      color: #f4f4f5;

      font-family:
        Inter,
        ui-sans-serif,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    }

    .grid {
      position: fixed;

      width: 220vw;
      height: 220vh;

      left: -60vw;
      top: -60vh;

      transform:
        perspective(700px)
        rotateX(58deg)
        rotateZ(-12deg)
        translate3d(0, 0, 0);

      transform-origin: center center;

      background-image:
        linear-gradient(
          rgba(255, 255, 255, 0.055) 1px,
          transparent 1px
        ),
        linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.055) 1px,
          transparent 1px
        );

      background-size: 48px 48px;
      background-position: 0 0;

      animation:
        gridMove 2.8s linear infinite;

      pointer-events: none;
      will-change: background-position;
    }

    @keyframes gridMove {
      from {
        background-position: 0 0;
      }

      to {
        background-position: 48px 48px;
      }
    }

    .gridFade {
      position: fixed;
      inset: 0;

      background:
        radial-gradient(
          ellipse at center,
          rgba(9, 9, 11, 0.08) 0%,
          rgba(9, 9, 11, 0.42) 52%,
          rgba(9, 9, 11, 0.92) 100%
        );

      pointer-events: none;
    }

    .ambient {
      position: fixed;

      width: 700px;
      height: 700px;

      left: 50%;
      top: 50%;

      transform: translate(-50%, -50%);

      border-radius: 50%;

      background:
        radial-gradient(
          circle,
          rgba(255, 255, 255, 0.045) 0%,
          transparent 65%
        );

      filter: blur(20px);

      pointer-events: none;
    }

    .card {
      position: relative;
      z-index: 10;

      width: min(540px, calc(100% - 32px));

      padding: 42px;

      border:
        1px solid rgba(255, 255, 255, 0.11);

      border-radius: 22px;

      background:
        rgba(18, 18, 20, 0.64);

      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);

      box-shadow:
        0 24px 80px rgba(0, 0, 0, 0.55),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .logo {
      width: 58px;
      height: 58px;

      display: grid;
      place-items: center;

      margin-bottom: 24px;

      border-radius: 16px;

      background: #ffffff;
      color: #09090b;

      font-size: 29px;
      font-weight: 900;

      box-shadow:
        0 8px 30px rgba(0, 0, 0, 0.25);
    }

    h1 {
      margin: 0;

      font-size: 42px;
      line-height: 1;

      letter-spacing: -1.5px;
    }

    .subtitle {
      margin: 12px 0 28px;

      color: #a1a1aa;

      line-height: 1.6;
      font-size: 15px;
    }

    label {
      display: block;

      margin-bottom: 8px;

      color: #d4d4d8;

      font-size: 13px;
      font-weight: 600;
    }

    input {
      width: 100%;

      padding: 13px 14px;

      border:
        1px solid #27272a;

      border-radius: 10px;

      outline: none;

      background: #0f0f11;
      color: #ffffff;

      font-size: 14px;

      transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
    }

    input:focus {
      border-color: #71717a;

      box-shadow:
        0 0 0 3px rgba(255, 255, 255, 0.04);
    }

    input::placeholder {
      color: #52525b;
    }

    button,
    .button {
      width: 100%;

      min-height: 46px;

      display: flex;
      align-items: center;
      justify-content: center;

      margin-top: 16px;
      padding: 13px 16px;

      border: 0;
      border-radius: 10px;

      background: #ffffff;
      color: #09090b;

      cursor: pointer;

      font-size: 14px;
      font-weight: 700;

      text-decoration: none;

      transition:
        transform 0.15s ease,
        background 0.15s ease;
    }

    button:hover,
    .button:hover {
      background: #e4e4e7;
      transform: translateY(-1px);
    }

    .success {
      margin-bottom: 22px;

      padding: 13px 15px;

      border:
        1px solid rgba(74, 222, 128, 0.2);

      border-radius: 10px;

      background:
        rgba(34, 197, 94, 0.08);

      color: #86efac;

      font-size: 14px;
    }

    .url {
      width: 100%;

      padding: 13px 14px;

      border:
        1px solid #27272a;

      border-radius: 10px;

      background: #0f0f11;

      color: #a1a1aa;

      font-size: 12px;

      word-break: break-all;
      line-height: 1.5;
    }

    .buttons {
      display: grid;

      grid-template-columns: 1fr 1fr;

      gap: 10px;

      margin-top: 18px;
    }

    .buttons .button {
      margin-top: 0;
    }

    .secondary {
      border:
        1px solid #27272a;

      background: #18181b;
      color: #ffffff;
    }

    .secondary:hover {
      background: #27272a;
    }

    .footer,
    .hint {
      margin-top: 18px;

      color: #71717a;

      font-size: 12px;
      line-height: 1.5;
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;

      margin-bottom: 24px;
      padding: 7px 11px;

      border:
        1px solid rgba(74, 222, 128, 0.18);

      border-radius: 999px;

      background:
        rgba(34, 197, 94, 0.07);

      color: #86efac;

      font-size: 12px;
      font-weight: 600;
    }

    .statusDot {
      width: 6px;
      height: 6px;

      border-radius: 50%;

      background: #4ade80;

      box-shadow:
        0 0 10px rgba(74, 222, 128, 0.7);
    }

    @media (max-width: 520px) {
      .card {
        padding: 28px;
      }

      h1 {
        font-size: 36px;
      }

      .buttons {
        grid-template-columns: 1fr;
      }

      .grid {
        width: 300vw;
        height: 300vh;

        left: -100vw;
        top: -100vh;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .grid {
        animation: none;
      }
    }
  </style>
</head>

<body>

  <div class="grid"></div>
  <div class="gridFade"></div>
  <div class="ambient"></div>

  <main class="card">

    <div class="logo">
      T
    </div>

    <h1>
      TorFuse
    </h1>

    <p class="subtitle">
      ${escapeHtml(subtitle)}
    </p>

    ${content}

  </main>

</body>
</html>
`;
}