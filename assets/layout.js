(function () {
  const headerTarget = document.getElementById("site-header");
  const footerTarget = document.getElementById("site-footer");
  const currentPage = document.body.dataset.page || "";

  function navLink(href, label) {
    const isActive = currentPage === href ? ' style="background:#eef4fb;"' : "";
    return `<a href="${href}"${isActive}>${label}</a>`;
  }

  if (headerTarget) {
    headerTarget.innerHTML = `
      <header class="site-header">
        <div class="container">
          <div class="topbar">
            <a href="index.html" class="brand-wrap">
              <div class="brand">Kobara Apps</div>
              <div class="brand-sub">音楽団体・アンサンブル向けWebアプリの入口ページ</div>
            </a>
            <nav class="site-nav">
              ${navLink("index.html", "Home")}
              ${navLink("schedule.html", "Kobara Schedule")}
              ${navLink("portal.html", "Ensemble Portal")}
              ${navLink("contact.html", "お問い合わせ")}
            </nav>
          </div>
        </div>
      </header>
    `;
  }

  if (footerTarget) {
    footerTarget.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-links">
            <a href="index.html">Home</a>
            <a href="schedule.html">Kobara Schedule</a>
            <a href="portal.html">Ensemble Portal</a>
            <a href="contact.html">お問い合わせ</a>
          </div>
          <div>© Kobara Apps</div>
        </div>
      </footer>
    `;
  }
})();