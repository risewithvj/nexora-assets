/*
 * Nexora Theme - Main JavaScript v2.0 - Orange Edition
 * CDN: https://cdn.jsdelivr.net/gh/YOUR_USERNAME/nexora-assets@main/js/nexora-main.js
 * JS by Vijaya Kumar L
 *
 * FEATURES:
 *   1. Reading Progress Bar
 *   2. Auto Table of Contents (auto-adds heading IDs + builds TOC)
 *   3. Copy Code Button on all code blocks
 *   4. Scroll Reveal fade-up animation
 *   5. Active heading highlight while reading
 *
 * HOW TO USE IN BLOGGER:
 *   Add before </body> in theme:
 *   <script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/nexora-assets@main/js/nexora-main.js"></script>
 */

(function () {
  'use strict';

  /* ======================================================
     1. READING PROGRESS BAR
     ====================================================== */
  function initProgressBar() {
    var bar = document.getElementById('nexora-progress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var st = window.scrollY || document.documentElement.scrollTop;
      var dh = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (dh > 0 ? Math.min(st / dh * 100, 100) : 0) + '%';
    }, { passive: true });
  }

  /* ======================================================
     2. AUTO TABLE OF CONTENTS
     Scans h2/h3/h4 in #postBody, auto-assigns IDs,
     then builds a numbered list inside #autoToc
     ====================================================== */
  function initAutoTOC() {
    var postBody = document.getElementById('postBody');
    var tocEl = document.getElementById('autoToc');
    if (!postBody || !tocEl) return;

    var headings = postBody.querySelectorAll('h2, h3, h4');
    if (headings.length < 2) {
      tocEl.style.display = 'none';
      return;
    }

    // Auto-assign IDs from heading text
    var seen = {};
    headings.forEach(function (h) {
      if (!h.id) {
        var base = h.textContent.trim().toLowerCase()
          .replace(/[^a-z0-9\s]/g, '').trim()
          .replace(/\s+/g, '-').substring(0, 55) || 'section';
        var id = base, n = 1;
        while (seen[id]) { id = base + '-' + (n++); }
        seen[id] = 1;
        h.id = id;
      } else {
        seen[h.id] = 1;
      }
    });

    // Build the TOC list
    var html = '<div class="nx-toc-title">Table of Contents</div><ol>';
    headings.forEach(function (h) {
      var isNested = parseInt(h.tagName[1]) > 2;
      html += '<li' + (isNested ? ' class="nx-toc-nested"' : '') + '>';
      html += '<a href="#' + h.id + '">' + h.textContent.trim() + '</a></li>';
    });
    html += '</ol>';
    tocEl.innerHTML = html;

    // Highlight active section while scrolling
    window.addEventListener('scroll', function () {
      var pos = window.scrollY + 90;
      var allLinks = tocEl.querySelectorAll('a');
      allLinks.forEach(function (a) {
        a.style.color = '#2d1a00';
        a.style.fontWeight = '400';
      });
      var active = null;
      headings.forEach(function (h) {
        if (h.getBoundingClientRect().top + window.scrollY <= pos) {
          active = tocEl.querySelector('a[href="#' + h.id + '"]');
        }
      });
      if (active) {
        active.style.color = '#F4511E';
        active.style.fontWeight = '600';
      }
    }, { passive: true });
  }

  /* ======================================================
     3. COPY CODE BUTTON
     Adds "Copy" button to all .pre / pre blocks
     ====================================================== */
  function initCopyCode() {
    document.querySelectorAll('.pre, pre').forEach(function (pre) {
      if (pre.querySelector('.nxCopyBtn')) return;
      var btn = document.createElement('button');
      btn.className = 'nxCopyBtn';
      btn.textContent = 'Copy';
      pre.style.position = 'relative';
      pre.appendChild(btn);
      btn.addEventListener('click', function () {
        var code = pre.querySelector('code') || pre;
        var text = code.textContent || '';
        var done = function () {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        };
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(done);
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.cssText = 'position:fixed;opacity:0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          done();
        }
      });
    });
  }

  /* ======================================================
     4. SCROLL REVEAL
     Adds .nxVisible to .nxReveal elements when in view
     ====================================================== */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('nxVisible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.nxReveal').forEach(function (el) {
      obs.observe(el);
    });
  }

  /* ======================================================
     INIT — runs on DOMContentLoaded
     ====================================================== */
  function init() {
    initProgressBar();
    initCopyCode();
    initScrollReveal();
    // TOC only on single post pages
    // Blogger sets window.isPost = 'true' on post pages
    if (typeof isPost !== 'undefined' && isPost === 'true') {
      initAutoTOC();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
