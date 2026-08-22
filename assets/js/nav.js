// Shared header nav: mobile toggle + active-link highlighting + unit-nav scroll spy.
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    // Highlight the current page in the header nav based on data-nav-id on <body>.
    var currentId = document.body.getAttribute("data-nav-id");
    if (currentId) {
      var link = document.querySelector('.site-nav a[data-nav-id="' + currentId + '"]');
      if (link) link.setAttribute("aria-current", "page");
    }

    // Scroll-spy for the in-course unit sidebar: highlight the unit link
    // that matches whichever <details class="unit"> is currently in view.
    var unitLinks = document.querySelectorAll(".unit-nav a[href^='#']");
    var units = document.querySelectorAll(".unit[id]");
    if (unitLinks.length && units.length && "IntersectionObserver" in window) {
      var byId = {};
      unitLinks.forEach(function (a) {
        byId[a.getAttribute("href").slice(1)] = a;
      });

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var link = byId[entry.target.id];
            if (!link) return;
            if (entry.isIntersecting) {
              unitLinks.forEach(function (a) { a.classList.remove("active"); });
              link.classList.add("active");
            }
          });
        },
        { rootMargin: "-20% 0px -70% 0px" }
      );

      units.forEach(function (u) { observer.observe(u); });
    }

    // Clicking a unit-nav link should also open that unit if it's collapsed.
    unitLinks.forEach(function (a) {
      a.addEventListener("click", function () {
        var id = a.getAttribute("href").slice(1);
        var target = document.getElementById(id);
        if (target && target.tagName === "DETAILS") {
          target.open = true;
        }
      });
    });
  });
})();
