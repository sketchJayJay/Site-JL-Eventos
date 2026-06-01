const config = window.JL_CONFIG;
const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const state = {
  quantities: {}
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const elements = {
  topWhatsapp: $("#topWhatsapp"),
  footerWhatsapp: $("#footerWhatsapp"),
  sendWhatsapp: $("#sendWhatsapp"),
  clearQuote: $("#clearQuote"),
  useLed: $("#useLed"),
  ledControls: $("#ledControls"),
  ledWidth: $("#ledWidth"),
  ledHeight: $("#ledHeight"),
  ledArea: $("#ledArea"),
  ledTotal: $("#ledTotal"),
  grandTotal: $("#grandTotal"),
  summaryLines: $("#summaryLines"),
  lightingItems: $("#lightingItems"),
  extraItems: $("#extraItems"),
  demoGrid: $("#demoGrid"),
  videoModal: $("#videoModal"),
  videoPlayer: $("#videoPlayer"),
  videoModalTitle: $("#videoModalTitle"),
  videoModalText: $("#videoModalText"),
  toast: $("#toast")
};

function money(value) {
  return formatter.format(value || 0);
}

function onlyPositiveNumber(value) {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return parsed;
}

function whatsappBase(text = "Olá! Quero fazer um orçamento com a JL Eventos.") {
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;
}

function updateWhatsappLinks() {
  elements.topWhatsapp.href = whatsappBase();
  elements.footerWhatsapp.href = whatsappBase();
}

function renderPriceLabels() {
  const ledLabel = document.querySelector("[data-led-price]");
  if (ledLabel) ledLabel.textContent = config.led.precoMetro;
}

function getAllItems() {
  return [...config.iluminacao, ...config.extras];
}

function getDemoItems() {
  return [
    {
      id: config.led.id,
      nome: config.led.nome,
      descricao: config.led.descricao,
      precoTexto: `${money(config.led.precoMetro)} / ${config.led.unidade}`,
      video: config.led.video
    },
    ...getAllItems().map((item) => ({
      id: item.id,
      nome: item.nome,
      descricao: item.descricao,
      precoTexto: item.preco > 0 ? `${money(item.preco)} / ${item.unidade}` : item.unidade,
      video: item.video
    }))
  ].filter((item) => item.video?.arquivo);
}

function findDemoById(id) {
  return getDemoItems().find((item) => item.id === id);
}

function openVideo(id) {
  const demo = findDemoById(id);
  if (!demo) return;

  elements.videoModalTitle.textContent = demo.video.titulo || demo.nome;
  elements.videoModalText.textContent = demo.descricao;
  elements.videoPlayer.poster = demo.video.poster || "";
  elements.videoPlayer.src = demo.video.arquivo;
  elements.videoModal.classList.add("show");
  elements.videoModal.setAttribute("aria-hidden", "false");
  elements.videoPlayer.play().catch(() => {});
}

function closeVideo() {
  elements.videoPlayer.pause();
  elements.videoPlayer.removeAttribute("src");
  elements.videoPlayer.load();
  elements.videoModal.classList.remove("show");
  elements.videoModal.setAttribute("aria-hidden", "true");
}

function createItemCard(item) {
  state.quantities[item.id] = 0;

  const card = document.createElement("article");
  card.className = "item-card";
  card.innerHTML = `
    <div>
      <h4>${item.nome}</h4>
      <p>${item.descricao}</p>
      <strong>${item.preco > 0 ? `${money(item.preco)} / ${item.unidade}` : item.unidade}</strong>
      ${item.video?.arquivo ? `<button class="demo-chip small" type="button" data-demo="${item.id}">▶ Ver vídeo</button>` : ""}
    </div>
    <div class="qty" aria-label="Quantidade de ${item.nome}">
      <button type="button" data-action="minus" data-id="${item.id}">−</button>
      <input type="number" min="0" step="1" value="0" data-id="${item.id}" aria-label="Quantidade" />
      <button type="button" data-action="plus" data-id="${item.id}">+</button>
    </div>
  `;

  card.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const current = state.quantities[id] || 0;
      const next = button.dataset.action === "plus" ? current + 1 : Math.max(0, current - 1);
      setQuantity(id, next);
    });
  });

  card.querySelector("input").addEventListener("input", (event) => {
    setQuantity(event.target.dataset.id, Math.floor(onlyPositiveNumber(event.target.value)));
  });

  return card;
}

function renderItems() {
  elements.lightingItems.innerHTML = "";
  elements.extraItems.innerHTML = "";

  config.iluminacao.forEach((item) => elements.lightingItems.appendChild(createItemCard(item)));
  config.extras.forEach((item) => elements.extraItems.appendChild(createItemCard(item)));
}

function createDemoCard(item, index) {
  const card = document.createElement("article");
  card.className = `video-card reveal delay-${Math.min(index, 3)}`;
  card.innerHTML = `
    <button class="video-preview" type="button" data-demo="${item.id}" aria-label="Abrir ${item.nome}">
      <video muted loop playsinline preload="metadata" poster="${item.video.poster || ""}">
        <source src="${item.video.arquivo}" type="video/mp4" />
      </video>
      <span class="play-badge">▶</span>
    </button>
    <div class="video-info">
      <span>${item.precoTexto}</span>
      <h3>${item.nome}</h3>
      <p>${item.descricao}</p>
      <button class="demo-chip small" type="button" data-demo="${item.id}">Ver demonstração</button>
    </div>
  `;

  const previewVideo = card.querySelector("video");
  previewVideo.addEventListener("mouseenter", () => previewVideo.play().catch(() => {}));
  previewVideo.addEventListener("mouseleave", () => previewVideo.pause());

  return card;
}

function renderDemos() {
  if (!elements.demoGrid) return;
  elements.demoGrid.innerHTML = "";
  getDemoItems().forEach((item, index) => elements.demoGrid.appendChild(createDemoCard(item, index)));
}

function setQuantity(id, quantity) {
  state.quantities[id] = quantity;
  const input = document.querySelector(`input[data-id="${id}"]`);
  if (input) input.value = quantity;
  calculate();
}

function getLedCalculation() {
  if (!elements.useLed.checked) {
    return { active: false, width: 0, height: 0, area: 0, total: 0 };
  }

  const width = onlyPositiveNumber(elements.ledWidth.value);
  const height = onlyPositiveNumber(elements.ledHeight.value);
  const area = width * height;
  const total = area * config.led.precoMetro;

  return { active: true, width, height, area, total };
}

function createSummaryLine(name, detail, total) {
  const row = document.createElement("div");
  row.className = "summary-line";
  row.innerHTML = `
    <span><strong>${name}</strong><small>${detail}</small></span>
    <b>${money(total)}</b>
  `;
  return row;
}

function calculate() {
  const led = getLedCalculation();
  let total = 0;
  elements.summaryLines.innerHTML = "";

  elements.ledControls.classList.toggle("disabled", !elements.useLed.checked);
  elements.ledArea.textContent = `${led.area.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} m²`;
  elements.ledTotal.textContent = money(led.total);

  if (led.active && led.area > 0) {
    total += led.total;
    elements.summaryLines.appendChild(
      createSummaryLine(
        config.led.nome,
        `${led.width}m x ${led.height}m = ${led.area.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} m²`,
        led.total
      )
    );
  }

  getAllItems().forEach((item) => {
    const quantity = state.quantities[item.id] || 0;
    if (quantity <= 0) return;

    const itemTotal = quantity * item.preco;
    total += itemTotal;
    const detail = item.preco > 0 ? `${quantity} ${item.unidade}${quantity > 1 ? "s" : ""} x ${money(item.preco)}` : `${quantity} item(ns) para confirmar valor`;
    elements.summaryLines.appendChild(createSummaryLine(item.nome, detail, itemTotal));
  });

  if (!elements.summaryLines.children.length) {
    const empty = document.createElement("p");
    empty.className = "empty-summary";
    empty.textContent = "Selecione algum item para ver o resumo aqui.";
    elements.summaryLines.appendChild(empty);
  }

  elements.grandTotal.textContent = money(total);
  return total;
}

function getFormValue(id) {
  return $(id).value?.trim() || "Não informado";
}

function buildWhatsappMessage() {
  const led = getLedCalculation();
  const total = calculate();
  const lines = [];

  lines.push("Olá! Vim pelo site da JL Eventos e quero confirmar um orçamento.");
  lines.push("");
  lines.push("*Dados do evento*");
  lines.push(`Nome: ${getFormValue("#clientName")}`);
  lines.push(`Tipo: ${getFormValue("#eventType")}`);
  lines.push(`Data: ${getFormValue("#eventDate")}`);
  lines.push(`Cidade/local: ${getFormValue("#eventCity")}`);
  lines.push(`Convidados: ${getFormValue("#guests")}`);
  lines.push(`Observação: ${getFormValue("#notes")}`);
  lines.push("");
  lines.push("*Itens selecionados*");

  let hasItem = false;

  if (led.active && led.area > 0) {
    hasItem = true;
    lines.push(`- Painel de LED: ${led.width}m x ${led.height}m = ${led.area.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} m² | ${money(led.total)}`);
  }

  getAllItems().forEach((item) => {
    const quantity = state.quantities[item.id] || 0;
    if (quantity <= 0) return;
    hasItem = true;
    const itemTotal = quantity * item.preco;
    const priceText = item.preco > 0 ? money(itemTotal) : "valor a confirmar";
    lines.push(`- ${item.nome}: ${quantity} ${item.unidade}${quantity > 1 ? "s" : ""} | ${priceText}`);
  });

  if (!hasItem) {
    lines.push("Ainda não selecionei itens, quero conversar sobre opções.");
  }

  lines.push("");
  lines.push(`*Total estimado pelo site:* ${money(total)}`);
  lines.push("*Obs.:* Sei que o valor pode mudar conforme frete, montagem, estrutura e disponibilidade.");

  return lines.join("\n");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

function bindEvents() {
  [elements.useLed, elements.ledWidth, elements.ledHeight].forEach((input) => input.addEventListener("input", calculate));

  $$(".preset").forEach((button) => {
    button.addEventListener("click", () => {
      elements.ledWidth.value = button.dataset.w;
      elements.ledHeight.value = button.dataset.h;
      elements.useLed.checked = true;
      calculate();
      showToast(`Painel ${button.dataset.w}x${button.dataset.h} selecionado.`);
    });
  });

  document.addEventListener("click", (event) => {
    const demoButton = event.target.closest("[data-demo]");
    if (demoButton) {
      openVideo(demoButton.dataset.demo);
    }

    if (event.target.closest("[data-close-video]")) {
      closeVideo();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.videoModal.classList.contains("show")) {
      closeVideo();
    }
  });

  elements.sendWhatsapp.addEventListener("click", () => {
    const message = buildWhatsappMessage();
    window.open(whatsappBase(message), "_blank", "noopener");
  });

  elements.clearQuote.addEventListener("click", () => {
    elements.useLed.checked = false;
    elements.ledWidth.value = 0;
    elements.ledHeight.value = 0;
    Object.keys(state.quantities).forEach((id) => setQuantity(id, 0));
    calculate();
    showToast("Orçamento limpo.");
  });
}

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach((element) => observer.observe(element));
}

function init() {
  updateWhatsappLinks();
  renderPriceLabels();
  renderItems();
  renderDemos();
  bindEvents();
  revealOnScroll();
  calculate();
}

init();
