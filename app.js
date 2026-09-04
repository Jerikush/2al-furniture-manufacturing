// ===============================
// 2AL FURNITURE MANUFACTURING
// WEBSITE + ROUGH COST CALCULATOR
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------
  // MOBILE MENU
  // -------------------------------

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
      });
    });
  }


  // -------------------------------
  // CALCULATOR
  // -------------------------------

  let currentStep = 1;

  const selections = {
    type: "Kitchen",
    design: "Straight",
    material: "Standard"
  };

  const materialRates = {
    Standard: {
      materials: 12000,
      hardware: 3000,
      labor: 7000,
      other: 1500
    },

    Premium: {
      materials: 17000,
      hardware: 5000,
      labor: 9000,
      other: 2000
    },

    Luxury: {
      materials: 25000,
      hardware: 8000,
      labor: 12000,
      other: 3000
    }
  };


  const designMultiplier = {
    Straight: 1,
    "L-Shape": 1.18,
    "U-Shape": 1.38,
    "Full Wall": 1.25
  };


  const typeMultiplier = {
    Kitchen: 1,
    Wardrobe: 0.95,
    Vanity: 0.65,
    Cabinet: 0.85
  };


  const extraRates = {
    "Soft Close": 3500,
    "Magic Corner": 6500,
    "Spice Rack": 2500,
    "LED": 3000,
    "Quartz Upgrade": 8500
  };


  const steps = document.querySelectorAll(".calc-step");
  const currentStepText = document.getElementById("currentStep");
  const progressBar = document.getElementById("progressBar");
  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("nextBtn");


  // -------------------------------
  // OPTION BUTTONS
  // -------------------------------

  document.querySelectorAll(".option").forEach(button => {

    button.addEventListener("click", () => {

      const group = button.dataset.group;
      const value = button.dataset.value;

      document
        .querySelectorAll(`.option[data-group="${group}"]`)
        .forEach(option => {
          option.classList.remove("selected");
        });

      button.classList.add("selected");

      selections[group] = value;

    });

  });


  // -------------------------------
  // UPDATE STEP
  // -------------------------------

  function updateStep() {

    steps.forEach(step => {
      step.classList.remove("active");
    });

    const activeStep = document.querySelector(
      `.calc-step[data-step="${currentStep}"]`
    );

    if (activeStep) {
      activeStep.classList.add("active");
    }


    if (currentStepText) {
      currentStepText.textContent = currentStep;
    }


    if (progressBar) {
      progressBar.style.width =
        `${(currentStep / 6) * 100}%`;
    }


    if (backBtn) {
      backBtn.style.visibility =
        currentStep === 1 ? "hidden" : "visible";
    }


    if (nextBtn) {

      if (currentStep === 6) {
        nextBtn.style.display = "none";
      } else {
        nextBtn.style.display = "inline-flex";
        nextBtn.textContent = "Next";
      }

    }


    if (currentStep === 6) {
      calculateEstimate();
    }

  }


  // -------------------------------
  // NEXT BUTTON
  // -------------------------------

  if (nextBtn) {

    nextBtn.addEventListener("click", () => {

      if (currentStep < 6) {
        currentStep++;
        updateStep();
      }

    });

  }


  // -------------------------------
  // BACK BUTTON
  // -------------------------------

  if (backBtn) {

    backBtn.addEventListener("click", () => {

      if (currentStep > 1) {
        currentStep--;
        updateStep();
      }

    });

  }


  // -------------------------------
  // CALCULATE ESTIMATE
  // -------------------------------

  function calculateEstimate() {

    const width =
      Number(document.getElementById("width")?.value) || 0;

    const height =
      Number(document.getElementById("height")?.value) || 0;

    const depth =
      Number(document.getElementById("depth")?.value) || 0;


    if (!width || !height || !depth) {
      return;
    }


    // Convert mm to meters
    const widthM = width / 1000;
    const heightM = height / 1000;

    const area = widthM * heightM;


    // Depth factor
    let depthFactor = depth / 600;

    depthFactor = Math.max(
      0.8,
      Math.min(depthFactor, 1.25)
    );


    // Base scale
    let scale =
      area *
      depthFactor;


    // Design multiplier
    scale *=
      designMultiplier[selections.design] || 1;


    // Furniture type multiplier
    scale *=
      typeMultiplier[selections.type] || 1;


    const rates =
      materialRates[selections.material];


    let materials =
      rates.materials * scale;

    let hardware =
      rates.hardware * scale;

    let labor =
      rates.labor * scale;

    let other =
      rates.other * scale;


    // -------------------------------
    // EXTRAS
    // -------------------------------

    let extras = 0;

    document
      .querySelectorAll(".check-option input:checked")
      .forEach(input => {

        const extraName = input.value;

        extras +=
          extraRates[extraName] || 0;

      });


    // -------------------------------
    // MINIMUM ESTIMATE
    // -------------------------------

    const minimumProjectValue = 25000;

    let subtotal =
      materials +
      hardware +
      labor +
      other +
      extras;


    if (subtotal < minimumProjectValue) {
      const adjustment =
        minimumProjectValue - subtotal;

      other += adjustment;

      subtotal =
        minimumProjectValue;
    }


    // -------------------------------
    // DISPLAY
    // -------------------------------

    setCost("materialsCost", materials);
    setCost("hardwareCost", hardware);
    setCost("laborCost", labor);
    setCost("otherCost", other);
    setCost("extrasCost", extras);
    setCost("totalCost", subtotal);

  }


  // -------------------------------
  // FORMAT PESO
  // -------------------------------

  function formatPeso(amount) {

    return new Intl.NumberFormat(
      "en-PH",
      {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0
      }
    ).format(amount);

  }


  function setCost(id, amount) {

    const element =
      document.getElementById(id);

    if (element) {
      element.textContent =
        formatPeso(Math.round(amount));
    }

  }


  // -------------------------------
  // RECALCULATE WHEN DIMENSIONS CHANGE
  // -------------------------------

  ["width", "height", "depth"].forEach(id => {

    const input =
      document.getElementById(id);

    if (input) {

      input.addEventListener(
        "input",
        () => {

          if (currentStep === 6) {
            calculateEstimate();
          }

        }
      );

    }

  });


  // -------------------------------
  // RECALCULATE WHEN EXTRAS CHANGE
  // -------------------------------

  document
    .querySelectorAll(".check-option input")
    .forEach(input => {

      input.addEventListener(
        "change",
        () => {

          if (currentStep === 6) {
            calculateEstimate();
          }

        }
      );

    });


  // -------------------------------
  // RESET
  // -------------------------------

  const resetButton =
    document.getElementById("resetCalculator");

  if (resetButton) {

    resetButton.addEventListener(
      "click",
      resetCalculator
    );

  }


  function resetCalculator() {

    currentStep = 1;

    selections.type = "Kitchen";
    selections.design = "Straight";
    selections.material = "Standard";


    document
      .querySelectorAll(".option")
      .forEach(option => {

        option.classList.remove("selected");

      });


    document
      .querySelectorAll(
        '.option[data-value="Kitchen"],' +
        '.option[data-value="Straight"],' +
        '.option[data-value="Standard"]'
      )
      .forEach(option => {

        option.classList.add("selected");

      });


    document
      .querySelectorAll(
        ".check-option input"
      )
      .forEach(input => {

        input.checked = false;

      });


    document.getElementById("width").value =
      2400;

    document.getElementById("height").value =
      2400;

    document.getElementById("depth").value =
      600;


    updateStep();

  }


  // -------------------------------
  // PRINT ESTIMATE
  // -------------------------------

  window.printEstimate = function() {

    calculateEstimate();

    window.print();

  };


  // -------------------------------
  // CONTACT FORM
  // -------------------------------

  const contactForm =
    document.getElementById("contactForm");

  const formMessage =
    document.getElementById("formMessage");


  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        if (formMessage) {

          formMessage.textContent =
            "Thank you! Your inquiry has been received. Our team will contact you soon.";

        }


        contactForm.reset();

      }
    );

  }


  // -------------------------------
  // INITIALIZE
  // -------------------------------

  updateStep();

});
