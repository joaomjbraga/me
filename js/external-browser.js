/**
 * external-browser.js
 * Detecta navegadores internos (in-app browser) — ex.: o WebView do Instagram
 * ou do Facebook — e oferece ao usuário abrir o link em um navegador externo.
 * Uma página estática não consegue forçar a abertura fora do WebView; o melhor
 * é interceptar o clique, tentar `window.open` e, se falhar, orientar o usuário.
 */
(function () {
  const IN_APP_PATTERN = /Instagram|FBAN|FBAV|FBIAB|FBBV|FB_IAB|MicroMessenger|Line\//i;

  let pendingUrl = "";

  /**
   * Indica se está rodando dentro de um navegador interno de aplicativo.
   * @returns {boolean}
   */
  function isInAppBrowser() {
    return IN_APP_PATTERN.test(navigator.userAgent) && !navigator.standalone;
  }

  /**
   * Indica se o dispositivo é iOS (inclusive iPad com detecção moderna).
   * @returns {boolean}
   */
  function isIOS() {
    const ua = navigator.userAgent;
    return (
      /iPhone|iPad|iPod/i.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  }

  /**
   * Monta as instruções manuais específicas da plataforma para abrir fora.
   * @param {string} url - Link que o usuário deseja abrir.
   * @returns {string}
   */
  function manualInstructions(url) {
    const steps = isIOS()
      ? "Para abrir no Safari, toque no ícone de compartilhar (quadrado com seta) e escolha “Abrir no Safari”."
      : "Para abrir no navegador, toque nos três pontinhos (⋮) na barra superior e escolha “Abrir no navegador”.";
    return steps;
  }

  /**
   * Exibe o aviso de abertura em navegador externo.
   * @param {{ label: string, url: string }} link
   */
  function showPrompt(link) {
    pendingUrl = link.url;

    const text = document.getElementById("externalPromptText");
    const manual = document.getElementById("externalPromptManual");

    text.textContent = `O Instagram abriu “${link.label}” dentro do próprio aplicativo.`;
    manual.textContent = manualInstructions(link.url);

    document.getElementById("externalPrompt").hidden = false;
  }

  /**
   * Tenta abrir o link fora do WebView. `window.open` com `_blank` funciona em
   * boa parte das versões; quando bloqueado, retorna `null` e orientamos o usuário.
   */
  function openExternally() {
    if (!pendingUrl) return;

    const externalWindow = window.open(pendingUrl, "_blank", "noopener");
    if (externalWindow) {
      externalWindow.opener = null;
      return;
    }

    // Se não abrir automaticamente, destaca as instruções manuais.
    const manual = document.getElementById("externalPromptManual");
    manual.textContent =
      "Não foi possível abrir automaticamente. " + manualInstructions(pendingUrl);
  }

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a.link-card");
    if (!anchor || !isInAppBrowser()) return;

    event.preventDefault();
    showPrompt({
      label: anchor.querySelector(".link-card__label")?.textContent ?? "o link",
      url: anchor.href,
    });
  });

  document.getElementById("externalOpenBtn").addEventListener("click", openExternally);
})();