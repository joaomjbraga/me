/**
 * icons.js
 * Carrega ícones da pasta `icons/`. Injeção inline (SVG) preserva a cor via
 * `currentColor`. Em ambientes sem a permissão de fetch (ex.: protocolo
 * file://), usa <img> como fallback — o tema escuro ajusta a cor via CSS.
 */
(function () {
  const ICONS_PATH = "icons";
  const RASTER_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "gif"]);

  /**
   * Indica se o arquivo é uma imagem raster (não SVG).
   * @param {string} name - Nome do arquivo, com ou sem extensão.
   * @returns {boolean}
   */
  function isRaster(name) {
    const extension = name.split(".").pop().toLowerCase();
    return RASTER_EXTENSIONS.has(extension);
  }

  /**
   * Busca o conteúdo bruto de um arquivo SVG.
   * @param {string} name - Nome do arquivo (sem extensão).
   * @returns {Promise<string>} Markup SVG ou string vazia em caso de falha.
   */
  async function fetchSvg(name) {
    try {
      const response = await fetch(`${ICONS_PATH}/${name}.svg`);
      return response.ok ? await response.text() : "";
    } catch {
      return "";
    }
  }

  /**
   * Cria o wrapper de um ícone pronto para inserção no DOM.
   * Aceita tanto SVG (nome sem extensão) quanto imagem raster (com extensão).
   * @param {string} name - Nome do arquivo do ícone.
   * @param {string} [className] - Classe aplicada no wrapper.
   * @returns {Promise<string>} Markup HTML contendo o ícone.
   */
  async function markup(name, className = "") {
    const wrapperClass = className ? ` class="${className}"` : "";

    if (isRaster(name)) {
      return `<span${wrapperClass}><img src="${ICONS_PATH}/${name}" alt="" /></span>`;
    }

    const svg = await fetchSvg(name);
    if (svg) {
      return `<span${wrapperClass}>${svg}</span>`;
    }

    // Fallback para ambientes sem fetch (protocolo file://).
    // O tema escuro ajusta a cor por meio do CSS (.icon--image img).
    const fallbackClass = className ? `${className} icon--image` : "icon--image";
    return `<span class="${fallbackClass}"><img src="${ICONS_PATH}/${name}.svg" alt="" /></span>`;
  }

  window.Icons = { markup };
})();