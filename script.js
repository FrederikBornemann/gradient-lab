class ModernGradientLab {
  constructor() {
    this.currentGradient = {
      type: "linear",
      colors: ["#3b82f6", "#8b5cf6", "#ec4899"],
      angle: 45,
      blendMode: "normal",
    };

    this.gradientHistory = [];
    this.maxHistoryItems = 9;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupThemeToggle();
    this.setupCustomSlider();
    this.updateGradient();
    this.updateCSSOutput();
    this.updateColorLabels();
  }

  setupEventListeners() {
    // Color inputs
    document.getElementById("color1").addEventListener("input", (e) => {
      this.currentGradient.colors[0] = e.target.value;
      this.updateGradient();
      this.updateCSSOutput();
      this.updateColorLabels();
    });

    document.getElementById("color2").addEventListener("input", (e) => {
      this.currentGradient.colors[1] = e.target.value;
      this.updateGradient();
      this.updateCSSOutput();
      this.updateColorLabels();
    });

    document.getElementById("color3").addEventListener("input", (e) => {
      this.currentGradient.colors[2] = e.target.value;
      this.updateGradient();
      this.updateCSSOutput();
      this.updateColorLabels();
    });

    // Gradient type buttons
    document.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document
          .querySelectorAll(".tab")
          .forEach((b) => b.setAttribute("data-state", "inactive"));
        e.target.setAttribute("data-state", "active");
        this.currentGradient.type = e.target.dataset.type;
        this.updateGradient();
        this.updateCSSOutput();
      });
    });

    // Angle slider
    const angleSlider = document.getElementById("angle");
    angleSlider.addEventListener("input", (e) => {
      this.currentGradient.angle = parseInt(e.target.value);
      this.updateSliderUI(e.target.value);
      this.updateGradient();
      this.updateCSSOutput();
    });

    // Blend mode
    document.getElementById("blend").addEventListener("change", (e) => {
      this.currentGradient.blendMode = e.target.value;
      this.updateGradient();
      this.updateCSSOutput();
    });

    // Generate button
    document.getElementById("generate-btn").addEventListener("click", () => {
      this.generateRandomGradient();
    });

    // Randomize all button
    document.getElementById("randomize-btn").addEventListener("click", () => {
      this.randomizeAll();
    });

    // Download button
    document.getElementById("download-btn").addEventListener("click", () => {
      this.downloadGradient();
    });

    // Copy CSS button
    document.getElementById("copy-css").addEventListener("click", () => {
      this.copyCSSToClipboard();
    });

    // Resolution selector
    document.getElementById("resolution").addEventListener("change", (e) => {
      const customResolution = document.getElementById("custom-resolution");
      if (e.target.value === "custom") {
        customResolution.style.display = "grid";
      } else {
        customResolution.style.display = "none";
      }
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "g":
            e.preventDefault();
            this.generateRandomGradient();
            break;
          case "r":
            e.preventDefault();
            this.randomizeAll();
            break;
          case "d":
            e.preventDefault();
            this.downloadGradient();
            break;
          case "c":
            e.preventDefault();
            this.copyCSSToClipboard();
            break;
        }
      }
    });
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const html = document.documentElement;

    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem("theme") || "dark";
    html.className = savedTheme;
    themeToggle.setAttribute("aria-checked", savedTheme === "dark");

    themeToggle.addEventListener("click", () => {
      const currentTheme = html.className;
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      html.className = newTheme;
      themeToggle.setAttribute("aria-checked", newTheme === "dark");
      localStorage.setItem("theme", newTheme);

      // Update Lucide icons for theme change
      lucide.createIcons();
    });
  }

  setupCustomSlider() {
    const slider = document.querySelector(".slider");
    const track = slider.querySelector(".slider-track");
    const range = slider.querySelector(".slider-range");
    const thumb = slider.querySelector(".slider-thumb");
    const input = slider.querySelector("input[type='range']");

    const updateSlider = (value) => {
      const percent = ((value - input.min) / (input.max - input.min)) * 100;
      range.style.width = `${percent}%`;
      thumb.style.left = `${percent}%`;
    };

    // Initialize slider
    updateSlider(input.value);

    // Handle click on track
    track.addEventListener("click", (e) => {
      const rect = track.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const value = Math.round(
        percent * (input.max - input.min) + parseInt(input.min)
      );
      input.value = value;
      updateSlider(value);
      this.currentGradient.angle = value;
      this.updateSliderUI(value);
      this.updateGradient();
      this.updateCSSOutput();
    });

    // Handle drag on thumb
    let isDragging = false;

    thumb.addEventListener("mousedown", () => {
      isDragging = true;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const rect = track.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      const value = Math.round(
        percent * (input.max - input.min) + parseInt(input.min)
      );
      input.value = value;
      updateSlider(value);
      this.currentGradient.angle = value;
      this.updateSliderUI(value);
      this.updateGradient();
      this.updateCSSOutput();
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  updateSliderUI(value) {
    document.getElementById("angle-value").textContent = `${value}°`;
  }

  updateColorLabels() {
    const colorInputs = document.querySelectorAll("input[type='color']");
    const colorLabels = document.querySelectorAll(".text-muted-foreground");

    colorInputs.forEach((input, index) => {
      if (colorLabels[index]) {
        colorLabels[index].textContent = input.value.toUpperCase();
      }
    });
  }

  updateGradient() {
    const gradientDisplay = document.getElementById("gradient-display");
    const gradientType = document.getElementById("gradient-type");
    const gradientAngle = document.getElementById("gradient-angle");

    let gradientCSS = "";
    const colors = this.currentGradient.colors.filter((color) => color);

    switch (this.currentGradient.type) {
      case "linear":
        gradientCSS = `linear-gradient(${
          this.currentGradient.angle
        }deg, ${colors.join(", ")})`;
        gradientType.textContent = "Linear Gradient";
        gradientAngle.textContent = `${this.currentGradient.angle}deg`;
        break;
      case "radial":
        gradientCSS = `radial-gradient(circle, ${colors.join(", ")})`;
        gradientType.textContent = "Radial Gradient";
        gradientAngle.textContent = "Circle";
        break;
      case "conic":
        gradientCSS = `conic-gradient(from ${
          this.currentGradient.angle
        }deg, ${colors.join(", ")})`;
        gradientType.textContent = "Conic Gradient";
        gradientAngle.textContent = `${this.currentGradient.angle}deg`;
        break;
    }

    gradientDisplay.style.background = gradientCSS;
    gradientDisplay.style.mixBlendMode = this.currentGradient.blendMode;

    // Add to history
    this.addToHistory();
  }

  updateCSSOutput() {
    const cssCode = document.getElementById("css-code");
    const colors = this.currentGradient.colors.filter((color) => color);

    let css = "";
    switch (this.currentGradient.type) {
      case "linear":
        css = `background: linear-gradient(${
          this.currentGradient.angle
        }deg, ${colors.join(", ")});`;
        break;
      case "radial":
        css = `background: radial-gradient(circle, ${colors.join(", ")});`;
        break;
      case "conic":
        css = `background: conic-gradient(from ${
          this.currentGradient.angle
        }deg, ${colors.join(", ")});`;
        break;
    }

    if (this.currentGradient.blendMode !== "normal") {
      css += `\nmix-blend-mode: ${this.currentGradient.blendMode};`;
    }

    cssCode.textContent = css;
  }

  addToHistory() {
    const gradientString = JSON.stringify(this.currentGradient);

    // Remove if already exists
    this.gradientHistory = this.gradientHistory.filter(
      (g) => JSON.stringify(g) !== gradientString
    );

    // Add to beginning
    this.gradientHistory.unshift({ ...this.currentGradient });

    // Keep only max items
    if (this.gradientHistory.length > this.maxHistoryItems) {
      this.gradientHistory = this.gradientHistory.slice(
        0,
        this.maxHistoryItems
      );
    }

    this.updateHistoryUI();
  }

  updateHistoryUI() {
    const historyContainer = document.getElementById("gradient-history");
    historyContainer.innerHTML = "";

    this.gradientHistory.forEach((gradient, index) => {
      const historyItem = document.createElement("div");
      historyItem.className = "relative group cursor-pointer";

      const colors = gradient.colors.filter((color) => color);
      let gradientCSS = "";

      switch (gradient.type) {
        case "linear":
          gradientCSS = `linear-gradient(${gradient.angle}deg, ${colors.join(
            ", "
          )});`;
          break;
        case "radial":
          gradientCSS = `radial-gradient(circle, ${colors.join(", ")});`;
          break;
        case "conic":
          gradientCSS = `conic-gradient(from ${
            gradient.angle
          }deg, ${colors.join(", ")});`;
          break;
      }

      historyItem.innerHTML = `
        <div class="w-full h-16 rounded-lg border-2 border-border transition-all duration-200 group-hover:border-primary/50 group-hover:scale-105" 
             style="background: ${gradientCSS}">
        </div>
        <button class="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20 rounded-lg flex items-center justify-center">
          <i data-lucide="refresh-cw" class="w-4 h-4 text-white"></i>
        </button>
      `;

      historyItem.addEventListener("click", () => {
        this.loadGradient(gradient);
      });

      historyContainer.appendChild(historyItem);
    });

    // Reinitialize Lucide icons
    lucide.createIcons();
  }

  loadGradient(gradient) {
    this.currentGradient = { ...gradient };

    // Update UI
    document.getElementById("color1").value = gradient.colors[0];
    document.getElementById("color2").value = gradient.colors[1];
    document.getElementById("color3").value = gradient.colors[2];

    // Update gradient type tabs
    document.querySelectorAll(".tab").forEach((btn) => {
      btn.setAttribute(
        "data-state",
        btn.dataset.type === gradient.type ? "active" : "inactive"
      );
    });

    // Update angle slider
    document.getElementById("angle").value = gradient.angle;
    this.updateSliderUI(gradient.angle);

    // Update blend mode
    document.getElementById("blend").value = gradient.blendMode;

    // Update displays
    this.updateGradient();
    this.updateCSSOutput();
    this.updateColorLabels();
  }

  generateRandomGradient() {
    // Generate random colors
    this.currentGradient.colors = [
      this.generateRandomColor(),
      this.generateRandomColor(),
      this.generateRandomColor(),
    ];

    // Update color inputs
    document.getElementById("color1").value = this.currentGradient.colors[0];
    document.getElementById("color2").value = this.currentGradient.colors[1];
    document.getElementById("color3").value = this.currentGradient.colors[2];

    this.updateGradient();
    this.updateCSSOutput();
    this.updateColorLabels();
  }

  randomizeAll() {
    // Random gradient type
    const types = ["linear", "radial", "conic"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    document
      .querySelectorAll(".tab")
      .forEach((btn) =>
        btn.setAttribute(
          "data-state",
          btn.dataset.type === randomType ? "active" : "inactive"
        )
      );
    this.currentGradient.type = randomType;

    // Random angle
    const randomAngle = Math.floor(Math.random() * 360);
    document.getElementById("angle").value = randomAngle;
    this.updateSliderUI(randomAngle);
    this.currentGradient.angle = randomAngle;

    // Random blend mode
    const blendModes = [
      "normal",
      "multiply",
      "screen",
      "overlay",
      "soft-light",
      "hard-light",
    ];
    const randomBlend =
      blendModes[Math.floor(Math.random() * blendModes.length)];
    document.getElementById("blend").value = randomBlend;
    this.currentGradient.blendMode = randomBlend;

    // Generate random colors
    this.generateRandomGradient();
  }

  generateRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
    const lightness = Math.floor(Math.random() * 30) + 40; // 40-70%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  async downloadGradient() {
    const format = document.getElementById("format").value;
    const resolution = document.getElementById("resolution").value;

    let width, height;
    if (resolution === "custom") {
      width = parseInt(document.getElementById("custom-width").value) || 1920;
      height = parseInt(document.getElementById("custom-height").value) || 1080;
    } else {
      [width, height] = resolution.split("x").map(Number);
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    // Create gradient
    let gradient;
    const colors = this.currentGradient.colors.filter((color) => color);

    switch (this.currentGradient.type) {
      case "linear":
        const angleRad = (this.currentGradient.angle * Math.PI) / 180;
        const x1 = width / 2 - (Math.cos(angleRad) * width) / 2;
        const y1 = height / 2 - (Math.sin(angleRad) * height) / 2;
        const x2 = width / 2 + (Math.cos(angleRad) * width) / 2;
        const y2 = height / 2 + (Math.sin(angleRad) * height) / 2;
        gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        break;
      case "radial":
        gradient = ctx.createRadialGradient(
          width / 2,
          height / 2,
          0,
          width / 2,
          height / 2,
          Math.max(width, height) / 2
        );
        break;
      case "conic":
        // For conic gradients, we'll use a radial gradient as approximation
        gradient = ctx.createRadialGradient(
          width / 2,
          height / 2,
          0,
          width / 2,
          height / 2,
          Math.max(width, height) / 2
        );
        break;
    }

    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Download
    const link = document.createElement("a");
    link.download = `gradient-${Date.now()}.${format}`;

    if (format === "svg") {
      // Create SVG
      const svgContent = this.createSVG(width, height);
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      link.href = URL.createObjectURL(blob);
    } else {
      canvas.toBlob((blob) => {
        link.href = URL.createObjectURL(blob);
        link.click();
      }, `image/${format}`);
    }

    link.click();
  }

  createSVG(width, height) {
    const colors = this.currentGradient.colors.filter((color) => color);
    let gradientDef = "";

    switch (this.currentGradient.type) {
      case "linear":
        const angleRad = (this.currentGradient.angle * Math.PI) / 180;
        const x1 = 0.5 - Math.cos(angleRad) * 0.5;
        const y1 = 0.5 - Math.sin(angleRad) * 0.5;
        const x2 = 0.5 + Math.cos(angleRad) * 0.5;
        const y2 = 0.5 + Math.sin(angleRad) * 0.5;
        gradientDef = `
                    <defs>
                        <linearGradient id="grad" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
                            ${colors
                              .map(
                                (color, index) =>
                                  `<stop offset="${
                                    (index / (colors.length - 1)) * 100
                                  }%" style="stop-color:${color};stop-opacity:1" />`
                              )
                              .join("")}
                        </linearGradient>
                    </defs>
                `;
        break;
      case "radial":
        gradientDef = `
                    <defs>
                        <radialGradient id="grad" cx="50%" cy="50%" r="50%">
                            ${colors
                              .map(
                                (color, index) =>
                                  `<stop offset="${
                                    (index / (colors.length - 1)) * 100
                                  }%" style="stop-color:${color};stop-opacity:1" />`
                              )
                              .join("")}
                        </radialGradient>
                    </defs>
                `;
        break;
      case "conic":
        gradientDef = `
                    <defs>
                        <conicGradient id="grad" cx="50%" cy="50%" angle="${
                          this.currentGradient.angle
                        }">
                            ${colors
                              .map(
                                (color, index) =>
                                  `<stop offset="${
                                    (index / (colors.length - 1)) * 100
                                  }%" style="stop-color:${color};stop-opacity:1" />`
                              )
                              .join("")}
                        </conicGradient>
                    </defs>
                `;
        break;
    }

    return `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                ${gradientDef}
                <rect width="100%" height="100%" fill="url(#grad)" />
            </svg>
        `;
  }

  async copyCSSToClipboard() {
    const cssCode = document.getElementById("css-code").textContent;
    try {
      await navigator.clipboard.writeText(cssCode);

      // Show feedback
      const copyBtn = document.getElementById("copy-css");
      const originalIcon = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
      copyBtn.classList.add("text-green-500");

      // Reinitialize icon
      lucide.createIcons();

      setTimeout(() => {
        copyBtn.innerHTML = originalIcon;
        copyBtn.classList.remove("text-green-500");
        lucide.createIcons();
      }, 2000);
    } catch (err) {
      console.error("Failed to copy CSS:", err);
      alert("Failed to copy CSS to clipboard");
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ModernGradientLab();
});
