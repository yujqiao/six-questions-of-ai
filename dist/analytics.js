if (location.hostname === 'pages.yqiao.me') {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-C2EQYZ88CJ', {
    page_location: location.origin + location.pathname,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-C2EQYZ88CJ';
  document.head.append(script);
}
