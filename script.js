class GradientLab {
  constructor() {
    this.currentGradient = {
      type: "linear",
      colors: ["#ff6b6b", "#4ecdc4", "#45b7d1"],
      angle: 45,
      blendMode: "normal",
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateGradient();
    this.updateCSSOutput();
  }

  setupEventListeners() {
    // Color inputs
    document.getElementById("color1").addEventListener("input", (e) => {
      this.currentGradient.colors[0] = e.target.value;
      this.updateGradient();
      this.updateCSSOutput();
    });

    document.getElementById("color2").addEventListener("input", (e) => {
      this.currentGradient.colors[1] = e.target.value;
      this.updateGradient();
      this.updateCSSOutput();
    });

    document.getElementById("color3").addEventListener("input", (e) => {
      this.currentGradient.colors[2] = e.target.value;
      this.updateGradient();
      this.updateCSSOutput();
    });

    // Gradient type buttons
    document.querySelectorAll(".type-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document
          .querySelectorAll(".type-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.currentGradient.type = e.target.dataset.type;
        this.updateGradient();
        this.updateCSSOutput();
      });
    });

    // Angle slider
    const angleSlider = document.getElementById("angle");
    const angleValue = document.getElementById("angle-value");
    angleSlider.addEventListener("input", (e) => {
      this.currentGradient.angle = parseInt(e.target.value);
      angleValue.textContent = `${this.currentGradient.angle}°`;
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
        customResolution.style.display = "flex";
      } else {
        customResolution.style.display = "none";
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
  }

  randomizeAll() {
    // Random gradient type
    const types = ["linear", "radial", "conic"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    document
      .querySelectorAll(".type-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelector(`[data-type="${randomType}"]`)
      .classList.add("active");
    this.currentGradient.type = randomType;

    // Random angle
    const randomAngle = Math.floor(Math.random() * 360);
    document.getElementById("angle").value = randomAngle;
    document.getElementById("angle-value").textContent = `${randomAngle}°`;
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
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "✅ Copied!";
      copyBtn.style.background = "#28a745";

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = "#667eea";
      }, 2000);
    } catch (err) {
      console.error("Failed to copy CSS:", err);
      alert("Failed to copy CSS to clipboard");
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new GradientLab();
});
