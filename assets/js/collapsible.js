// Adds "Expand all" / "Collapse all" controls for a group of <details class="unit">.
// Units are native <details>/<summary> elements, so they work even without JS —
// this file just adds the convenience buttons and deep-link support.
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var controls = document.querySelectorAll("[data-collapse-controls]");
    controls.forEach(function (box) {
      var groupSelector = box.getAttribute("data-collapse-controls") || ".unit";
      var expandBtn = box.querySelector("[data-expand-all]");
      var collapseBtn = box.querySelector("[data-collapse-all]");

      if (expandBtn) {
        expandBtn.addEventListener("click", function () {
          document.querySelectorAll(groupSelector).forEach(function (d) { d.open = true; });
        });
      }
      if (collapseBtn) {
        collapseBtn.addEventListener("click", function () {
          document.querySelectorAll(groupSelector).forEach(function (d) { d.open = false; });
        });
      }
    });

    // If the page loads with a #unit-id in the URL, open that unit automatically.
    if (window.location.hash) {
      var target = document.querySelector(window.location.hash);
      if (target && target.tagName === "DETAILS") {
        target.open = true;
        setTimeout(function () { target.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
      }
    }
  });
})();
