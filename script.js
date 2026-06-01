(() => {
  const STORAGE_KEY = "jl_eventos_config_pro_v1";
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
  const brl = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const num = (value) => Number(String(value ?? "").replace(",", ".")) || 0;
  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

  let config = loadConfig();

  function loadConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.warn("Não foi possível carregar configuração salva", error);
    }
    return JSON.parse(JSON.stringify(window.JL_DEFAULT_CONFIG));
  }

  function saveConfig() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }

  function whatsappUrl(message) {
    const phone = (config.company.whatsapp || "").replace(/\D/g, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  function dateBR(value) {
    if (!value) return "Não informado";
    const [y, m, d] = value.split("-");
    return y && m && d ? `${d}/${m}/${y}` : value;
  }

  function todayBR() {
    return new Date().toLocaleDateString("pt-BR");
  }

  function activeItems() {
    return config.items.filter(item => item.active !== false);
  }

  function itemById(id) {
    return config.items.find(item => item.id === id);
  }

  function refreshCompanyLabels() {
    qsa("[data-company-name]").forEach(el => el.textContent = config.company.name);
    qsa("[data-company-slogan]").forEach(el => el.textContent = config.company.slogan);
    const hello = `Olá! Vim pelo site da ${config.company.name} e gostaria de fazer um orçamento.`;
    ["topWhatsapp", "bottomWhatsapp"].forEach(id => {
      const el = qs(`#${id}`);
      if (el) el.href = whatsappUrl(hello);
    });
  }

  function initMenu() {
    const btn = qs("#menuBtn");
    const nav = qs("#mainNav");
    if (!btn || !nav) return;
    btn.addEventListener("click", () => nav.classList.toggle("open"));
    qsa("#mainNav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }

  function renderItems() {
    const root = qs("#itemsContainer");
    const groups = activeItems().reduce((acc, item) => {
      acc[item.category] ||= [];
      acc[item.category].push(item);
      return acc;
    }, {});

    root.innerHTML = Object.entries(groups).map(([category, items]) => `
      <div class="category-block">
        <div class="category-title">${esc(category)}</div>
        ${items.map(item => `
          <div class="item-card" data-item-card="${esc(item.id)}">
            <img class="item-thumb" src="${esc(item.poster)}" alt="${esc(item.name)}" loading="lazy">
            <div class="item-info">
              <h4>${esc(item.name)}</h4>
              <p>${esc(item.description)}</p>
              <div class="item-meta">${item.price > 0 ? `${brl(item.price)} por ${esc(item.unit)}` : "Valor sob consulta"}</div>
              <button class="demo-mini" type="button" data-video-id="${esc(item.id)}">▶ Ver vídeo</button>
            </div>
            <div class="qty-control" aria-label="Quantidade de ${esc(item.name)}">
              <button type="button" data-minus="${esc(item.id)}">−</button>
              <input type="number" min="0" step="1" value="0" data-qty="${esc(item.id)}">
              <button type="button" data-plus="${esc(item.id)}">+</button>
            </div>
          </div>
        `).join("")}
      </div>
    `).join("");

    qsa("[data-plus]").forEach(btn => btn.addEventListener("click", () => {
      const input = qs(`[data-qty="${CSS.escape(btn.dataset.plus)}"]`);
      input.value = num(input.value) + 1;
      updateAll();
    }));
    qsa("[data-minus]").forEach(btn => btn.addEventListener("click", () => {
      const input = qs(`[data-qty="${CSS.escape(btn.dataset.minus)}"]`);
      input.value = Math.max(0, num(input.value) - 1);
      updateAll();
    }));
    qsa("[data-qty]").forEach(input => input.addEventListener("input", updateAll));
    qsa("[data-video-id]").forEach(btn => btn.addEventListener("click", () => openVideo(btn.dataset.videoId)));
  }

  function renderPackages() {
    const root = qs("#packagesContainer");
    root.innerHTML = config.packages.map(pkg => {
      const lines = [];
      if (pkg.led?.enabled) lines.push(`Painel de LED ${pkg.led.width}x${pkg.led.height}m`);
      Object.entries(pkg.items || {}).forEach(([id, qty]) => {
        const item = itemById(id);
        if (item && qty > 0) lines.push(`${qty}x ${item.name}`);
      });
      return `
        <article class="package-card reveal">
          <span class="chip hot">${esc(pkg.tag)}</span>
          <h3>${esc(pkg.name)}</h3>
          <p>${esc(pkg.description)}</p>
          <ul>${lines.map(line => `<li>${esc(line)}</li>`).join("")}</ul>
          <button class="btn btn-primary" type="button" data-apply-package="${esc(pkg.id)}">Aplicar pacote</button>
        </article>
      `;
    }).join("");
    qsa("[data-apply-package]").forEach(btn => btn.addEventListener("click", () => applyPackage(btn.dataset.applyPackage)));
  }

  function renderVideos() {
    const root = qs("#videosContainer");
    const allVideos = [
      { id: "painelLed", name: config.led.name, description: config.led.description, poster: config.led.poster },
      ...activeItems().map(item => ({ id: item.id, name: item.name, description: item.description, poster: item.poster }))
    ];
    root.innerHTML = allVideos.map(video => `
      <article class="video-card reveal">
        <img src="${esc(video.poster)}" alt="${esc(video.name)}" loading="lazy">
        <div class="video-card-body">
          <h3>${esc(video.name)}</h3>
          <p>${esc(video.description)}</p>
          <button class="btn btn-ghost" type="button" data-video-id="${esc(video.id)}">Assistir demonstração</button>
        </div>
      </article>
    `).join("");
    qsa("#videosContainer [data-video-id]").forEach(btn => btn.addEventListener("click", () => openVideo(btn.dataset.videoId)));
  }

  function renderGallery() {
    const root = qs("#galleryContainer");
    root.innerHTML = config.gallery.map(card => `
      <article class="gallery-card reveal">
        <img src="${esc(card.image)}" alt="${esc(card.title)}" loading="lazy">
        <div class="gallery-card-body">
          <h3>${esc(card.title)}</h3>
          <p>${esc(card.text)}</p>
        </div>
      </article>
    `).join("");
  }

  function renderTestimonials() {
    const root = qs("#testimonialsContainer");
    root.innerHTML = config.testimonials.map(item => `
      <article class="testimonial-card reveal">
        <p>“${esc(item.text)}”</p>
        <strong>${esc(item.name)}</strong>
      </article>
    `).join("");
  }

  function openVideo(id) {
    const source = id === "painelLed" ? config.led : itemById(id);
    if (!source) return;
    const modal = qs("#videoModal");
    const video = qs("#modalVideo");
    qs("#modalTitle").textContent = `Vídeo demonstrativo: ${source.name}`;
    video.pause();
    video.removeAttribute("src");
    video.poster = source.poster || "";
    video.src = source.video || "";
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeVideo() {
    const modal = qs("#videoModal");
    const video = qs("#modalVideo");
    video.pause();
    video.removeAttribute("src");
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  function setupVideoModal() {
    qsa("[data-close-modal]").forEach(el => el.addEventListener("click", closeVideo));
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeVideo(); });
  }

  function readQuote() {
    const ledEnabled = qs("#useLed").checked;
    const ledWidth = num(qs("#ledWidth").value);
    const ledHeight = num(qs("#ledHeight").value);
    const ledArea = ledEnabled ? ledWidth * ledHeight : 0;
    const ledTotal = ledArea * num(config.led.pricePerM2);
    const selectedItems = activeItems().map(item => {
      const qtyEl = qs(`[data-qty="${CSS.escape(item.id)}"]`);
      const qty = Math.max(0, Math.floor(num(qtyEl?.value)));
      return { ...item, qty, total: qty * num(item.price), consultation: qty > 0 && num(item.price) === 0 };
    }).filter(item => item.qty > 0);

    const itemsTotal = selectedItems.reduce((sum, item) => sum + item.total, 0);
    const travel = num(qs("#travelValue").value);
    const subtotal = ledTotal + itemsTotal;
    const total = subtotal + travel;
    const signalPercent = num(qs("#signalPercent").value) || num(config.financial.signalDefault);
    const signalValue = total * (signalPercent / 100);

    return {
      clientName: qs("#clientName").value.trim(),
      clientPhone: qs("#clientPhone").value.trim(),
      eventType: qs("#eventType").value,
      eventDate: qs("#eventDate").value,
      eventCity: qs("#eventCity").value.trim(),
      eventPlace: qs("#eventPlace").value.trim(),
      guests: qs("#guests").value.trim(),
      eventTime: qs("#eventTime").value.trim(),
      notes: qs("#notes").value.trim(),
      ledEnabled,
      ledWidth,
      ledHeight,
      ledArea,
      ledTotal,
      selectedItems,
      itemsTotal,
      travel,
      subtotal,
      total,
      signalPercent,
      signalValue,
      hasConsultation: selectedItems.some(item => item.consultation) || travel <= 0
    };
  }

  function quoteLines(q) {
    const lines = [];
    if (q.ledEnabled && q.ledArea > 0) {
      lines.push({ name: `${config.led.name} ${q.ledWidth}x${q.ledHeight}m (${q.ledArea.toFixed(2).replace(".", ",")} m²)`, value: q.ledTotal });
    }
    q.selectedItems.forEach(item => {
      lines.push({ name: `${item.qty}x ${item.name}`, value: item.price > 0 ? item.total : "Sob consulta" });
    });
    if (q.travel > 0) lines.push({ name: "Deslocamento", value: q.travel });
    return lines;
  }

  function messageBase(q, mode = "orcamento") {
    const title = mode === "reserva" ? "Quero reservar minha data com a JL Eventos" : mode === "pix" ? "Quero solicitar a chave Pix para sinal" : "Quero um orçamento com a JL Eventos";
    const lines = quoteLines(q);
    return [
      `Olá! ${title}.`,
      "",
      `*Cliente:* ${q.clientName || "Não informado"}`,
      `*Telefone:* ${q.clientPhone || "Não informado"}`,
      `*Evento:* ${q.eventType || "Não informado"}`,
      `*Data:* ${dateBR(q.eventDate)}`,
      `*Horário:* ${q.eventTime || "Não informado"}`,
      `*Cidade:* ${q.eventCity || "Não informado"}`,
      `*Local:* ${q.eventPlace || "Não informado"}`,
      `*Convidados:* ${q.guests || "Não informado"}`,
      "",
      "*Itens escolhidos:*",
      ...(lines.length ? lines.map(line => `• ${line.name}: ${typeof line.value === "number" ? brl(line.value) : line.value}`) : ["• Nenhum item selecionado"]),
      "",
      `*Subtotal:* ${brl(q.subtotal)}`,
      q.travel > 0 ? `*Deslocamento:* ${brl(q.travel)}` : "*Deslocamento:* a confirmar",
      `*Total estimado:* ${brl(q.total)}`,
      `*Sinal ${q.signalPercent}%:* ${brl(q.signalValue)}`,
      q.notes ? `*Observações:* ${q.notes}` : "",
      "",
      config.financial.reservationText
    ].filter(Boolean).join("\n");
  }

  function renderSummary(q) {
    qs("#ledPriceLabel").textContent = brl(config.led.pricePerM2);
    qs("#ledArea").textContent = `${q.ledArea.toFixed(2).replace(".", ",")} m²`;
    qs("#ledTotal").textContent = brl(q.ledTotal);
    qs("#grandTotal").textContent = brl(q.total);
    qs("[data-total-hero]").textContent = brl(q.total);
    qs("#signalValue").textContent = brl(q.signalValue);
    qs("#reservationNote").textContent = config.financial.reservationText;

    const lines = quoteLines(q);
    qs("#summaryList").innerHTML = lines.length ? lines.map(line => `
      <div class="summary-row"><span>${esc(line.name)}</span><strong>${typeof line.value === "number" ? brl(line.value) : esc(line.value)}</strong></div>
    `).join("") : `<div class="summary-row"><span>Nenhum item selecionado</span><strong>${brl(0)}</strong></div>`;

    qs("#sendWhatsapp").href = whatsappUrl(messageBase(q, "orcamento"));
    qs("#reserveWhatsapp").href = whatsappUrl(messageBase(q, "reserva"));
    qs("#pixWhatsapp").href = whatsappUrl(messageBase(q, "pix"));
  }

  function renderPrintQuote(q) {
    const lines = quoteLines(q);
    qs("#quotePrintArea").innerHTML = `
      <div class="print-doc">
        <h1>${esc(config.company.name)}</h1>
        <div><strong>${esc(config.company.slogan)}</strong> • Orçamento gerado em ${todayBR()}</div>
        <p>${esc(config.company.cityText)}</p>
        <h2>Dados do evento</h2>
        <table>
          <tr><th>Cliente</th><td>${esc(q.clientName || "Não informado")}</td><th>Telefone</th><td>${esc(q.clientPhone || "Não informado")}</td></tr>
          <tr><th>Evento</th><td>${esc(q.eventType || "Não informado")}</td><th>Data</th><td>${esc(dateBR(q.eventDate))}</td></tr>
          <tr><th>Cidade</th><td>${esc(q.eventCity || "Não informado")}</td><th>Local</th><td>${esc(q.eventPlace || "Não informado")}</td></tr>
          <tr><th>Convidados</th><td>${esc(q.guests || "Não informado")}</td><th>Horário</th><td>${esc(q.eventTime || "Não informado")}</td></tr>
        </table>
        <h2>Itens escolhidos</h2>
        <table>
          <thead><tr><th>Descrição</th><th>Valor</th></tr></thead>
          <tbody>${lines.length ? lines.map(line => `<tr><td>${esc(line.name)}</td><td>${typeof line.value === "number" ? brl(line.value) : esc(line.value)}</td></tr>`).join("") : `<tr><td>Nenhum item selecionado</td><td>${brl(0)}</td></tr>`}</tbody>
        </table>
        <p><strong>Observações:</strong> ${esc(q.notes || "Sem observações")}</p>
        <p><strong>Deslocamento:</strong> ${q.travel > 0 ? brl(q.travel) : "a confirmar"}</p>
        <p class="print-total">Total estimado: ${brl(q.total)}</p>
        <p class="print-total">Sinal ${q.signalPercent}%: ${brl(q.signalValue)}</p>
        <p>${esc(config.financial.reservationText)}</p>
        <div class="signature-grid"><div class="signature-line">${esc(config.company.name)}</div><div class="signature-line">Contratante</div></div>
      </div>
    `;
  }

  function renderContract(q) {
    const lines = quoteLines(q);
    qs("#contractPaper").innerHTML = `
      <h3>Contrato de Prestação de Serviços para Evento</h3>
      <p class="contract-muted">Modelo simples gerado automaticamente com base no orçamento. Revise todos os dados antes de enviar.</p>
      <p><strong>CONTRATADA:</strong> ${esc(config.company.name)}, responsável por serviços de som, painel de LED, iluminação, pista e estrutura para eventos.</p>
      <p><strong>CONTRATANTE:</strong> ${esc(q.clientName || "________________________________")}, telefone ${esc(q.clientPhone || "________________________________")}.</p>
      <p><strong>EVENTO:</strong> ${esc(q.eventType || "________________________________")}, a realizar-se em ${esc(dateBR(q.eventDate))}, às ${esc(q.eventTime || "____:____")}, na cidade de ${esc(q.eventCity || "________________________________")}, local ${esc(q.eventPlace || "________________________________")}.</p>
      <h3>Objeto contratado</h3>
      <table>
        <thead><tr><th>Item</th><th>Valor</th></tr></thead>
        <tbody>${lines.length ? lines.map(line => `<tr><td>${esc(line.name)}</td><td>${typeof line.value === "number" ? brl(line.value) : esc(line.value)}</td></tr>`).join("") : `<tr><td>Itens a definir</td><td>A confirmar</td></tr>`}</tbody>
      </table>
      <p><strong>Valor total estimado:</strong> ${brl(q.total)}.</p>
      <p><strong>Sinal para reserva:</strong> ${q.signalPercent}% no valor de ${brl(q.signalValue)}.</p>
      <p><strong>Deslocamento:</strong> ${q.travel > 0 ? brl(q.travel) : "a confirmar conforme local do evento"}.</p>
      <h3>Condições</h3>
      <ol>${config.contract.clauses.map(clause => `<li>${esc(clause)}</li>`).join("")}</ol>
      <p><strong>Observações:</strong> ${esc(q.notes || "Sem observações adicionais.")}</p>
      <p class="contract-muted">Documento gerado em ${todayBR()} pelo site da ${esc(config.company.name)}.</p>
      <div class="signature-grid"><div class="signature-line">${esc(config.company.name)}</div><div class="signature-line">Contratante</div></div>
    `;
  }

  function updateAll() {
    const q = readQuote();
    renderSummary(q);
    renderPrintQuote(q);
    renderContract(q);
  }

  function applyPackage(packageId) {
    const pkg = config.packages.find(item => item.id === packageId);
    if (!pkg) return;
    qsa("[data-qty]").forEach(input => input.value = 0);
    qs("#useLed").checked = !!pkg.led?.enabled;
    qs("#ledWidth").value = pkg.led?.width || config.led.defaultWidth;
    qs("#ledHeight").value = pkg.led?.height || config.led.defaultHeight;
    Object.entries(pkg.items || {}).forEach(([id, qty]) => {
      const input = qs(`[data-qty="${CSS.escape(id)}"]`);
      if (input) input.value = qty;
    });
    updateAll();
    qs("#montar").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearQuote() {
    ["clientName", "clientPhone", "eventCity", "eventPlace", "guests", "eventTime", "notes", "travelValue"].forEach(id => qs(`#${id}`).value = "");
    qs("#eventType").selectedIndex = 0;
    qs("#eventDate").value = "";
    qs("#signalPercent").value = String(config.financial.signalDefault || 50);
    qs("#useLed").checked = true;
    qs("#ledWidth").value = config.led.defaultWidth;
    qs("#ledHeight").value = config.led.defaultHeight;
    qsa("[data-qty]").forEach(input => input.value = 0);
    updateAll();
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copiado com sucesso!");
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      alert("Copiado com sucesso!");
    }
  }

  function setupCalculator() {
    qs("#ledWidth").value = config.led.defaultWidth;
    qs("#ledHeight").value = config.led.defaultHeight;
    qs("#signalPercent").value = String(config.financial.signalDefault || 50);
    ["quoteForm"].forEach(id => qs(`#${id}`).addEventListener("input", updateAll));
    qsa(".preset").forEach(btn => btn.addEventListener("click", () => {
      qs("#useLed").checked = true;
      qs("#ledWidth").value = btn.dataset.w;
      qs("#ledHeight").value = btn.dataset.h;
      updateAll();
    }));
    qs("#clearQuote").addEventListener("click", clearQuote);
    qs("#copyQuote").addEventListener("click", () => copyText(messageBase(readQuote(), "orcamento")));
    qs("#copyContract").addEventListener("click", () => copyText(qs("#contractPaper").innerText));
    qs("#refreshContract").addEventListener("click", updateAll);
    qs("#printQuote").addEventListener("click", () => printMode("print-quote"));
    qs("#printContract").addEventListener("click", () => printMode("print-contract"));
    updateAll();
  }

  function printMode(className) {
    document.body.classList.add(className);
    window.print();
    setTimeout(() => document.body.classList.remove(className), 700);
  }

  function renderAdminItems() {
    qs("#adminItems").innerHTML = config.items.map((item, index) => `
      <div class="admin-item-row" data-admin-index="${index}">
        <label>Nome<input data-admin-field="name" value="${esc(item.name)}"></label>
        <label>Categoria<input data-admin-field="category" value="${esc(item.category)}"></label>
        <label>Preço<input data-admin-field="price" type="number" min="0" step="10" value="${num(item.price)}"></label>
        <label>Unidade<input data-admin-field="unit" value="${esc(item.unit)}"></label>
        <label>ID<input data-admin-field="id" value="${esc(item.id)}"></label>
        <label>Vídeo MP4<input data-admin-field="video" value="${esc(item.video)}"></label>
        <label>Imagem poster<input data-admin-field="poster" value="${esc(item.poster)}"></label>
        <label class="admin-check"><input data-admin-field="active" type="checkbox" ${item.active !== false ? "checked" : ""}>Ativo</label>
        <label style="grid-column:1 / -2">Descrição<input data-admin-field="description" value="${esc(item.description)}"></label>
        <button class="delete-admin-item" type="button" data-delete-admin-item="${index}">Excluir</button>
      </div>
    `).join("");
    qsa("[data-delete-admin-item]").forEach(btn => btn.addEventListener("click", () => {
      config.items.splice(Number(btn.dataset.deleteAdminItem), 1);
      renderAdminItems();
    }));
  }

  function openAdminPanel() {
    qs("#adminLoginBox").classList.add("hidden");
    qs("#adminPanel").classList.remove("hidden");
    qs("#adminCompanyName").value = config.company.name;
    qs("#adminSlogan").value = config.company.slogan;
    qs("#adminWhatsapp").value = config.company.whatsapp;
    qs("#adminNewPassword").value = config.admin.password;
    qs("#adminLedPrice").value = config.led.pricePerM2;
    qs("#adminSignal").value = config.financial.signalDefault;
    renderAdminItems();
  }

  function collectAdminConfig() {
    config.company.name = qs("#adminCompanyName").value.trim() || "JL Eventos";
    config.company.slogan = qs("#adminSlogan").value.trim() || "SOUND QUALITY";
    config.company.whatsapp = qs("#adminWhatsapp").value.replace(/\D/g, "") || config.company.whatsapp;
    config.admin.password = qs("#adminNewPassword").value.trim() || "JL2026";
    config.led.pricePerM2 = num(qs("#adminLedPrice").value);
    config.financial.signalDefault = num(qs("#adminSignal").value) || 50;

    config.items = qsa("[data-admin-index]").map(row => {
      const field = name => qs(`[data-admin-field="${name}"]`, row);
      return {
        id: field("id").value.trim().replace(/\s+/g, "") || `item${Date.now()}`,
        category: field("category").value.trim() || "Outros",
        name: field("name").value.trim() || "Novo item",
        description: field("description").value.trim() || "Descrição do item.",
        unit: field("unit").value.trim() || "unidade",
        price: num(field("price").value),
        active: field("active").checked,
        video: field("video").value.trim() || "assets/videos/painel-led.mp4",
        poster: field("poster").value.trim() || "assets/videos/painel-led.jpg"
      };
    });
  }

  function setupAdmin() {
    qs("#adminLogin").addEventListener("click", () => {
      if (qs("#adminPassword").value === config.admin.password) openAdminPanel();
      else alert("Senha incorreta.");
    });
    qs("#adminPassword").addEventListener("keydown", e => { if (e.key === "Enter") qs("#adminLogin").click(); });
    qs("#addAdminItem").addEventListener("click", () => {
      config.items.push({
        id: `novoItem${Date.now()}`,
        category: "Outros",
        name: "Novo item",
        description: "Descrição do novo item.",
        unit: "unidade",
        price: 0,
        active: true,
        video: "assets/videos/painel-led.mp4",
        poster: "assets/videos/painel-led.jpg"
      });
      renderAdminItems();
    });
    qs("#saveAdmin").addEventListener("click", () => {
      collectAdminConfig();
      saveConfig();
      bootstrap(false);
      openAdminPanel();
      alert("Alterações salvas neste navegador.");
    });
    qs("#resetConfig").addEventListener("click", () => {
      if (!confirm("Restaurar todos os dados padrão?")) return;
      localStorage.removeItem(STORAGE_KEY);
      config = JSON.parse(JSON.stringify(window.JL_DEFAULT_CONFIG));
      bootstrap(false);
      openAdminPanel();
    });
  }

  function setupInputs() {
    qsa("input, select, textarea").forEach(el => el.addEventListener("change", updateAll));
  }

  function bootstrap(first = true) {
    refreshCompanyLabels();
    renderItems();
    renderPackages();
    renderVideos();
    renderGallery();
    renderTestimonials();
    if (first) {
      initMenu();
      setupVideoModal();
      setupCalculator();
      setupAdmin();
      setupInputs();
    } else {
      qs("#ledWidth").value ||= config.led.defaultWidth;
      qs("#ledHeight").value ||= config.led.defaultHeight;
      qsa("[data-video-id]").forEach(btn => btn.addEventListener("click", () => openVideo(btn.dataset.videoId)));
      updateAll();
    }
  }

  document.addEventListener("DOMContentLoaded", () => bootstrap(true));
})();
