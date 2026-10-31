/* ==========================================================
   Dijalma Bacelar Mudanças - script.js
   ========================================================== */
(function () {
  "use strict";

  /* ---------- CONFIGURAÇÃO (edite aqui) ----------
     Para o formulário enviar o pedido direto para você, preencha UM campo:
     WHATSAPP: só números, com 55 + DDD. Ex.: "5533999999999"
     EMAIL:    e-mail que receberá os pedidos. Ex.: "contato@seusite.com.br"
     Com os dois vazios, o formulário monta o resumo e orienta o cliente a ligar. */
  var CONFIG = {
    WHATSAPP: "",
    EMAIL: "",
    TELEFONE: "(33) 3221-9003",
    ABERTURA: "2017-11-21"
  };

  var $ = function (id) { return document.getElementById(id); };
  var icon = function (name) {
    return '<svg class="ico" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  };

  /* ---------- Menu mobile ---------- */
  var burger = $("burger");
  var menu = $("menu");

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    burger.innerHTML = icon(open ? "xmark" : "bars");
  }
  if (burger && menu) {
    burger.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- Sombra do cabeçalho ao rolar ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-stuck", (window.scrollY || 0) > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Anos de empresa e ano do rodapé ---------- */
  var now = new Date();
  var ab = new Date(CONFIG.ABERTURA + "T00:00:00");
  var anos = now.getFullYear() - ab.getFullYear();
  if (now.getMonth() < ab.getMonth() || (now.getMonth() === ab.getMonth() && now.getDate() < ab.getDate())) anos--;
  if ($("anos")) $("anos").textContent = anos;
  if ($("ano")) $("ano").textContent = now.getFullYear();

  /* ---------- Cookies ---------- */
  var cookie = $("cookie");
  var KEY = "dbm_cookies";
  function lerConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function salvarConsent(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* ignora */ }
    if (cookie) cookie.hidden = true;
    if (v === "accepted") carregarTags();
  }

  /* Cole aqui os códigos do Google Analytics / Google Ads.
     Só rodam se o visitante aceitar os cookies. */
  function carregarTags() {
    /* Exemplo (troque G-XXXXXXXXXX pelo seu ID):
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX";
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", "G-XXXXXXXXXX");
    */
  }

  if (cookie) {
    var c = lerConsent();
    if (c === "accepted") carregarTags();
    else if (!c) cookie.hidden = false;
    if ($("cookieOk")) $("cookieOk").addEventListener("click", function () { salvarConsent("accepted"); });
    if ($("cookieNo")) $("cookieNo").addEventListener("click", function () { salvarConsent("declined"); });
  }

  /* ---------- Formulário de orçamento ---------- */
  var form = $("quoteForm");
  var msg = $("formMsg");

  if (form) {
    var tel = $("telefone");
    var dataEl = $("data");

    if (dataEl) {
      var mm = String(now.getMonth() + 1).padStart(2, "0");
      var dd = String(now.getDate()).padStart(2, "0");
      dataEl.min = now.getFullYear() + "-" + mm + "-" + dd;
    }

    // Máscara: (00) 00000-0000
    tel.addEventListener("input", function () {
      var d = tel.value.replace(/\D/g, "").slice(0, 11), out = d;
      if (d.length > 6) {
        var corte = d.length > 10 ? 7 : 6;
        out = "(" + d.slice(0, 2) + ") " + d.slice(2, corte) + "-" + d.slice(corte);
      } else if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
      else if (d.length) out = "(" + d;
      tel.value = out;
    });

    function aviso(texto, tipo) {
      msg.textContent = texto;
      msg.className = "form__msg field--full " + (tipo || "");
    }

    function validar() {
      var primeiro = null;
      ["nome", "telefone", "tipo", "origem", "destino"].forEach(function (id) {
        var el = $(id);
        if (!el) return;
        var v = el.value.trim();
        var ruim = !v || (id === "telefone" && v.replace(/\D/g, "").length < 10);
        el.classList.toggle("is-invalid", ruim);
        if (ruim && !primeiro) primeiro = el;
      });
      if (primeiro) {
        aviso("Confira os campos destacados: nome, telefone com DDD, tipo de mudança, origem e destino.", "is-error");
        primeiro.focus();
        return false;
      }
      if (!$("consent").checked) {
        aviso("Para enviar, aceite a Política de Privacidade.", "is-error");
        $("consent").focus();
        return false;
      }
      return true;
    }

    form.addEventListener("input", function (e) {
      if (e.target.classList) e.target.classList.remove("is-invalid");
    });

    function br(iso) {
      if (!iso) return "A combinar";
      var p = iso.split("-");
      return p[2] + "/" + p[1] + "/" + p[0];
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validar()) return;

      var texto =
        "Olá! Gostaria de um orçamento de mudança.\n\n" +
        "Nome: " + $("nome").value.trim() + "\n" +
        "Telefone: " + tel.value.trim() + "\n" +
        "Tipo: " + $("tipo").value + "\n" +
        "Origem: " + $("origem").value.trim() + "\n" +
        "Destino: " + $("destino").value.trim() + "\n" +
        "Data desejada: " + br(dataEl.value) + "\n" +
        "Itens: " + ($("mensagem").value.trim() || "Não informado");

      // Evento de conversão (só dispara se o Google Ads/Analytics estiver carregado)
      if (typeof window.gtag === "function") window.gtag("event", "generate_lead");

      if (CONFIG.WHATSAPP) {
        window.open("https://wa.me/" + CONFIG.WHATSAPP + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
        aviso("Abrimos o WhatsApp com a sua solicitação. É só enviar a mensagem.", "is-ok");
      } else if (CONFIG.EMAIL) {
        window.location.href = "mailto:" + CONFIG.EMAIL +
          "?subject=" + encodeURIComponent("Pedido de orçamento - " + $("nome").value.trim()) +
          "&body=" + encodeURIComponent(texto);
        aviso("Abrimos o seu e-mail com a solicitação. É só enviar.", "is-ok");
      } else {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).catch(function () {});
        aviso("Dados prontos! Ligue para " + CONFIG.TELEFONE + " e informe sua solicitação para receber o orçamento.", "is-ok");
      }
      form.reset();
    });
  }

  /* ---------- FAQ: abre uma pergunta por vez ---------- */
  var faqs = document.querySelectorAll(".faq");
  faqs.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) faqs.forEach(function (o) { if (o !== item) o.open = false; });
    });
  });
})();
