// Two jobs, sharing the same filter logic:
//  1. Sitewide search (search.html) — filters assets/data/search-index.json.
//  2. In-page filter (course pages, courses listing) — filters visible
//     .unit / .card elements using their data-title / data-tags attributes,
//     no network request needed.

(function () {
  function normalize(s) {
    return (s || "").toLowerCase();
  }

  // ---- In-page filter (course units, course cards) ----
  function initInPageFilter(box) {
    var input = box.querySelector("input[type='search']");
    var itemSelector = box.getAttribute("data-filter-target");
    var countEl = box.querySelector("[data-filter-count]");
    var items = Array.prototype.slice.call(document.querySelectorAll(itemSelector));
    var emptyState = document.querySelector(box.getAttribute("data-filter-empty") || "");

    function apply() {
      var q = normalize(input.value).trim();
      var shown = 0;
      items.forEach(function (item) {
        var haystack = normalize(item.getAttribute("data-title")) + " " + normalize(item.getAttribute("data-tags"));
        var match = q === "" || haystack.indexOf(q) !== -1;
        item.style.display = match ? "" : "none";
        if (match) shown += 1;
      });
      if (countEl) {
        countEl.textContent = q === "" ? "Showing all " + items.length : "Showing " + shown + " of " + items.length;
      }
      if (emptyState) emptyState.style.display = shown === 0 ? "block" : "none";
    }

    input.addEventListener("input", apply);
    apply();
  }

  // ---- Sitewide search page ----
  function initSitewideSearch(root) {
    var input = root.querySelector("input[type='search']");
    var list = root.querySelector("[data-results]");
    var countEl = root.querySelector("[data-result-count]");
    var indexUrl = root.getAttribute("data-index-url") || "/assets/data/search-index.json";

    fetch(indexUrl)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        function render(items) {
          list.innerHTML = "";
          if (items.length === 0) {
            list.innerHTML = "<li class='no-results'>No materials matched. Try a different word.</li>";
          }
          items.forEach(function (entry) {
            var li = document.createElement("li");
            li.className = "result-item";
            var a = document.createElement("a");
            a.href = entry.url;
            a.textContent = entry.title;
            var meta = document.createElement("div");
            meta.className = "result-meta";
            meta.textContent = [entry.course, entry.type].filter(Boolean).join(" · ");
            li.appendChild(a);
            li.appendChild(meta);
            list.appendChild(li);
          });
          if (countEl) countEl.textContent = items.length + " result" + (items.length === 1 ? "" : "s");
        }

        function apply() {
          var q = normalize(input.value).trim();
          if (q === "") { render(data); return; }
          var filtered = data.filter(function (entry) {
            var haystack = normalize(entry.title) + " " + normalize(entry.course) + " " + normalize((entry.tags || []).join(" "));
            return haystack.indexOf(q) !== -1;
          });
          render(filtered);
        }

        input.addEventListener("input", apply);
        render(data);

        // Support ?q=... deep links from other pages' search boxes.
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q");
        if (initial) {
          input.value = initial;
          apply();
        }
      })
      .catch(function () {
        list.innerHTML = "<li class='no-results'>Search index could not be loaded. Run scripts/build_search_index.py.</li>";
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-filter-target]").forEach(initInPageFilter);
    var sitewide = document.querySelector("[data-sitewide-search]");
    if (sitewide) initSitewideSearch(sitewide);
  });
})();
