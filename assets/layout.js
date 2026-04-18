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

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildHeroBanner(ad) {
    const title = escapeHtml(ad.title || "おすすめサービス");
    const body = escapeHtml(ad.body || "");
    const imageHtml = ad.image_url
      ? `<img src="${escapeHtml(ad.image_url)}" alt="${title}">`
      : "広告";

    const linkUrl = escapeHtml(ad.click_url || ad.link_url || "#");

    return `
      <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="ad-wide-inner" style="text-decoration:none;color:inherit;">
        <div class="ad-wide-media">${imageHtml}</div>
        <div class="ad-wide-copy">
          <h3>${title}</h3>
          <p>${body}</p>
        </div>
        <div>
          <span class="ad-link-btn">詳しく見る</span>
        </div>
      </a>
    `;
  }

  function buildMiniCard(ad) {
    const title = escapeHtml(ad.title || "おすすめサービス");
    const body = escapeHtml(ad.body || "");
    const shortBody = body.length > 60 ? `${body.slice(0, 60)}…` : body;
    const imageHtml = ad.image_url
      ? `<img src="${escapeHtml(ad.image_url)}" alt="${title}">`
      : "広告";

    const linkUrl = escapeHtml(ad.click_url || ad.link_url || "#");

    return `
      <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="display:block;text-decoration:none;color:inherit;">
        <span class="ad-slot-label">${escapeHtml(ad.slot || "")}</span>
        <div class="ad-mini-media">${imageHtml}</div>
        <h4>${title}</h4>
        <p>${shortBody}</p>
      </a>
    `;
  }

  function renderAdsBySlot(adsBySlot) {
    const heroTarget = document.getElementById("site-hero-banner");
    const card1 = document.getElementById("site-card-1");
    const card2 = document.getElementById("site-card-2");
    const card3 = document.getElementById("site-card-3");

    const heroAds = adsBySlot["SITE_TOP_HERO_BANNER"] || [];
    const card1Ads = adsBySlot["SITE_TOP_FEATURE_CARDS_1"] || [];
    const card2Ads = adsBySlot["SITE_TOP_FEATURE_CARDS_2"] || [];
    const card3Ads = adsBySlot["SITE_TOP_FEATURE_CARDS_3"] || [];

    if (heroTarget && heroAds.length > 0) {
      heroTarget.innerHTML = buildHeroBanner(heroAds[0]);
    }

    if (card1 && card1Ads.length > 0) {
      card1.innerHTML = buildMiniCard(card1Ads[0]);
    }

    if (card2 && card2Ads.length > 0) {
      card2.innerHTML = buildMiniCard(card2Ads[0]);
    }

    if (card3 && card3Ads.length > 0) {
      card3.innerHTML = buildMiniCard(card3Ads[0]);
    }
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

      renderAdsBySlot(data.ads_by_slot);
    } catch (error) {
      console.error("site ads load failed", error);
    }
  }

  loadSiteAds();
})();