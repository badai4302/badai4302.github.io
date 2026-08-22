// Projectile motion visualizer. No air resistance (idealized model — a good
// extension exercise for students is adding a drag term). Pure canvas + JS,
// no libraries.
(function () {
  var GRAVITY = { earth: 9.81, moon: 1.62, mars: 3.72 };

  function initSim(root) {
    var canvas = root.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    var velocityInput = root.querySelector("[data-sim-velocity]");
    var angleInput = root.querySelector("[data-sim-angle]");
    var gravitySelect = root.querySelector("[data-sim-gravity]");
    var velocityOut = root.querySelector("[data-sim-velocity-out]");
    var angleOut = root.querySelector("[data-sim-angle-out]");
    var launchBtn = root.querySelector("[data-sim-launch]");
    var resetBtn = root.querySelector("[data-sim-reset]");
    var rangeOut = root.querySelector("[data-sim-range]");
    var heightOut = root.querySelector("[data-sim-height]");
    var timeOut = root.querySelector("[data-sim-time]");

    var W, H, scale;
    var animId = null;
    var trail = [];

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.width * 0.55 * ratio;
      canvas.style.height = (rect.width * 0.55) + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      W = rect.width;
      H = rect.width * 0.55;
    }

    function computeTrajectory(v0, angleDeg, g) {
      var angle = (angleDeg * Math.PI) / 180;
      var vx = v0 * Math.cos(angle);
      var vy = v0 * Math.sin(angle);
      var flightTime = (2 * vy) / g;
      var range = vx * flightTime;
      var maxHeight = (vy * vy) / (2 * g);
      return { vx: vx, vy: vy, flightTime: flightTime, range: range, maxHeight: maxHeight };
    }

    function drawStatic(v0, angleDeg, g) {
      var traj = computeTrajectory(v0, angleDeg, g);
      var margin = 30;
      scale = Math.max(4, (W - margin * 2) / Math.max(traj.range, 1));
      var maxScaleH = (H - margin * 2) / Math.max(traj.maxHeight, 1);
      scale = Math.min(scale, maxScaleH);

      ctx.clearRect(0, 0, W, H);

      // ground line
      ctx.strokeStyle = "#c7cede";
      ctx.beginPath();
      ctx.moveTo(0, H - margin);
      ctx.lineTo(W, H - margin);
      ctx.stroke();

      // full idealized path, faint
      ctx.strokeStyle = "#c3d6f2";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      var steps = 60;
      for (var i = 0; i <= steps; i++) {
        var t = (traj.flightTime * i) / steps;
        var x = margin + traj.vx * t * scale;
        var y = H - margin - (traj.vy * t - 0.5 * g * t * t) * scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      return traj;
    }

    function drawFrame(v0, angleDeg, g, traj, elapsed) {
      var margin = 30;
      drawStatic(v0, angleDeg, g);

      var t = Math.min(elapsed, traj.flightTime);
      var x = margin + traj.vx * t * scale;
      var y = H - margin - (traj.vy * t - 0.5 * g * t * t) * scale;

      trail.push([x, y]);

      // drawn trail so far
      ctx.strokeStyle = "#2f5d9f";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      trail.forEach(function (p, i) {
        if (i === 0) ctx.moveTo(p[0], p[1]);
        else ctx.lineTo(p[0], p[1]);
      });
      ctx.stroke();

      // projectile
      ctx.fillStyle = "#2f5d9f";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    function updateReadout(traj) {
      rangeOut.textContent = traj.range.toFixed(1) + " m";
      heightOut.textContent = traj.maxHeight.toFixed(1) + " m";
      timeOut.textContent = traj.flightTime.toFixed(2) + " s";
    }

    function stopAnimation() {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }

    function launch() {
      stopAnimation();
      trail = [];
      var v0 = parseFloat(velocityInput.value);
      var angleDeg = parseFloat(angleInput.value);
      var g = GRAVITY[gravitySelect.value];
      var traj = computeTrajectory(v0, angleDeg, g);
      updateReadout(traj);

      var start = null;
      var speedFactor = 1; // real-time seconds; flightTime is usually a few seconds

      function frame(ts) {
        if (!start) start = ts;
        var elapsed = ((ts - start) / 1000) * speedFactor;
        drawFrame(v0, angleDeg, g, traj, elapsed);
        if (elapsed < traj.flightTime) {
          animId = requestAnimationFrame(frame);
        } else {
          animId = null;
        }
      }
      animId = requestAnimationFrame(frame);
    }

    function previewOnly() {
      stopAnimation();
      trail = [];
      var v0 = parseFloat(velocityInput.value);
      var angleDeg = parseFloat(angleInput.value);
      var g = GRAVITY[gravitySelect.value];
      var traj = drawStatic(v0, angleDeg, g);
      updateReadout(traj);
    }

    velocityInput.addEventListener("input", function () {
      velocityOut.textContent = velocityInput.value + " m/s";
      previewOnly();
    });
    angleInput.addEventListener("input", function () {
      angleOut.textContent = angleInput.value + "°";
      previewOnly();
    });
    gravitySelect.addEventListener("change", previewOnly);
    launchBtn.addEventListener("click", launch);
    resetBtn.addEventListener("click", function () {
      velocityInput.value = 25;
      angleInput.value = 45;
      gravitySelect.value = "earth";
      velocityOut.textContent = "25 m/s";
      angleOut.textContent = "45°";
      previewOnly();
    });

    window.addEventListener("resize", function () {
      resize();
      previewOnly();
    });

    resize();
    velocityOut.textContent = velocityInput.value + " m/s";
    angleOut.textContent = angleInput.value + "°";
    previewOnly();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-projectile-sim]").forEach(initSim);
  });
})();
