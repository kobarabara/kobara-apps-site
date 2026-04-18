(function () {
  const headerTarget = document.getElementById("site-header");
  const footerTarget = document.getElementById("site-footer");
  const currentPage = document.body.dataset.page || "";

  const ADS_API_URL = "https://platform-control-kobara-fe1c9e302fdc.herokuapp.com/public/site-ads/";

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
              <div class="brand-sub">日常でちょっと便利なWebアプリの入口サイト</div>
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
          <a href="terms.html">利用規約</a>
          <a href="privacy.html">プライバシーポリシー</a>
        </div>
        <div>© Kobara Apps</div>
      </div>
    </footer>
  `;
}

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildAdCard(ad, sizeClass) {
    const title = escapeHtml(ad.title || "おすすめサービス");
    const body = escapeHtml(ad.body || "");
    const linkUrl = escapeHtml(ad.click_url || ad.link_url || "#");
    const imageHtml = ad.image_url
      ? `<img src="${escapeHtml(ad.image_url)}" alt="${title}">`
      : `<div class="site-ad-placeholder">広告</div>`;

    return `
      <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="site-ad-card ${sizeClass}">
        <div class="site-ad-card__media">
          ${imageHtml}
        </div>
        <div class="site-ad-card__body">
          <div class="site-ad-card__title">${title}</div>
          ${body ? `<div class="site-ad-card__text">${body}</div>` : ""}
        </div>
      </a>
    `;
  }

  function renderSideAds(ads) {
    const target = document.getElementById("site-side-ads");
    if (!target) return;
    if (!ads.length) return;

    target.innerHTML = ads.map((ad) => buildAdCard(ad, "is-side")).join("");
  }

  function renderFooter100(ads) {
    const target = document.getElementById("site-footer-100");
    if (!target) return;
    if (!ads.length) return;

    target.innerHTML = ads.map((ad) => buildAdCard(ad, "is-footer-100")).join("");
  }

  function renderFooter50(ads) {
    const target = document.getElementById("site-footer-50");
    if (!target) return;
    if (!ads.length) return;

    target.innerHTML = ads.map((ad) => buildAdCard(ad, "is-footer-50")).join("");
  }

  async function loadSiteAds() {
    if (currentPage !== "index.html") {
      return;
    }

    try {
      const response = await fetch(ADS_API_URL, {
        method: "GET",
        cache: "no-store"
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      if (!data || !data.ok || !data.ads_by_slot) {
        return;
      }

      const sideAds = data.ads_by_slot["SITE_DESKTOP_SIDE_30"] || [];
      const footer50Ads = data.ads_by_slot["SITE_FOOTER_50"] || [];
      const footer100Ads = data.ads_by_slot["SITE_FOOTER_100"] || [];

      renderSideAds(sideAds);
      renderFooter50(footer50Ads);
      renderFooter100(footer100Ads);
    } catch (error) {
      console.error("site ads load failed", error);
    }
  }

  loadSiteAds();
})();