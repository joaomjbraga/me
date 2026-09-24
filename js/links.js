/**
 * links.js
 * Renderiza a lista de links principais.
 * Para adicionar ou remover itens, edite o array LINKS.
 */
(function () {
  /**
   * Links principais. Para usar um novo ícone, coloque o arquivo em `icons/`
   * e informe o nome (SVG sem extensão ou imagem com extensão, ex. "jogo.png").
   */
  const LINKS = [
    {
      label: "As Aventuras de Tuiu & Nany",
      url: "https://tuiunany.vercel.app/",
      icon: "tuiuenany.png",
    },
  ];

  /**
   * Monta o markup de um card de link.
   * @param {(typeof LINKS)[number]} link
   * @returns {Promise<string>} Markup HTML do item.
   */
  async function createLinkItem(link) {
    const [icon, arrow] = await Promise.all([
      window.Icons.markup(link.icon, "link-card__icon"),
      window.Icons.markup("external-link", "link-card__arrow"),
    ]);

    return `
      <li>
        <a
          class="link-card"
          href="${link.url}"
          target="_blank"
          rel="noopener noreferrer"
        >
          ${icon}
          <span class="link-card__label">${link.label}</span>
          ${arrow}
        </a>
      </li>
    `;
  }

  /**
   * Renderiza todos os links principais no container.
   */
  async function renderLinks() {
    const linksList = document.getElementById("links");
    linksList.innerHTML = (await Promise.all(LINKS.map(createLinkItem))).join("");
  }

  document.addEventListener("DOMContentLoaded", renderLinks);
})();