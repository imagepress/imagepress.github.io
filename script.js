HTMLElement.prototype.slideToggle = function (duration, callback) {
  if (this.clientHeight === 0) {
    _s(this, duration, callback, true);
  } else {
    _s(this, duration, callback);
  }
};

HTMLElement.prototype.slideUp = function (duration, callback) {
  _s(this, duration, callback);
};

HTMLElement.prototype.slideDown = function (duration, callback) {
  _s(this, duration, callback, true);
};

function _s(el, duration, callback, isDown) {
  if (typeof duration === "undefined") duration = 400;
  if (typeof isDown === "undefined") isDown = false;

  el.style.overflow = "hidden";
  if (isDown) el.style.display = "block";

  var elStyles = window.getComputedStyle(el);

  var elHeight = parseFloat(elStyles.getPropertyValue("height"));
  var elPaddingTop = parseFloat(elStyles.getPropertyValue("padding-top"));
  var elPaddingBottom = parseFloat(elStyles.getPropertyValue("padding-bottom"));
  var elMarginTop = parseFloat(elStyles.getPropertyValue("margin-top"));
  var elMarginBottom = parseFloat(elStyles.getPropertyValue("margin-bottom"));

  var stepHeight = elHeight / duration;
  var stepPaddingTop = elPaddingTop / duration;
  var stepPaddingBottom = elPaddingBottom / duration;
  var stepMarginTop = elMarginTop / duration;
  var stepMarginBottom = elMarginBottom / duration;

  var start;

  function step(timestamp) {
    if (start === undefined) start = timestamp;

    var elapsed = timestamp - start;

    if (isDown) {
      el.style.height = stepHeight * elapsed + "px";
      el.style.paddingTop = stepPaddingTop * elapsed + "px";
      el.style.paddingBottom = stepPaddingBottom * elapsed + "px";
      el.style.marginTop = stepMarginTop * elapsed + "px";
      el.style.marginBottom = stepMarginBottom * elapsed + "px";
    } else {
      el.style.height = elHeight - stepHeight * elapsed + "px";
      el.style.paddingTop = elPaddingTop - stepPaddingTop * elapsed + "px";
      el.style.paddingBottom =
        elPaddingBottom - stepPaddingBottom * elapsed + "px";
      el.style.marginTop = elMarginTop - stepMarginTop * elapsed + "px";
      el.style.marginBottom =
        elMarginBottom - stepMarginBottom * elapsed + "px";
    }

    if (elapsed >= duration) {
      el.style.height = "";
      el.style.paddingTop = "";
      el.style.paddingBottom = "";
      el.style.marginTop = "";
      el.style.marginBottom = "";
      el.style.overflow = "";
      if (!isDown) el.style.display = "none";
      if (typeof callback === "function") callback();
    } else {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

// JS
const overlays = document.querySelector(".overlay");
const body = document.querySelector("body");
const menuBtn = document.querySelector(".menu-btn");
const menuItems = document.querySelector(".menu-items");

// Add class to a tag and ul tag if li parent contains sub-menu
const liElems = document.querySelectorAll(".menu-items li");
liElems.forEach((elem) => {
  const childrenElems = elem.querySelectorAll(".dropdown-menu");
  if (childrenElems.length > 0) {
    elem.firstElementChild.classList.add("expand-btn");
    elem.classList.add("dropdown");
  }
});

function toggle() {
  // disable overflow body
  body.classList.toggle("overflow");
  // dark background
  overlays.classList.toggle("overlay--active");
  // add open class
  menuBtn.classList.toggle("open");
  menuItems.classList.toggle("open");
}

// Open Menu Mobile
menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggle();
});

// Closes when the Esc key is pressed
window.onkeydown = function (event) {
  const key = event.key; // const {key} = event; in ES6+
  const active = menuItems.classList.contains("open");
  if (key === "Escape" && active) {
    toggle();
  }
};

// Closes when clicked outside the area
document.addEventListener("click", (e) => {
  let target = e.target,
    its_menu = target === menuItems || menuItems.contains(target),
    its_hamburger = target === menuBtn,
    menu_is_active = menuItems.classList.contains("open");
  if (!its_menu && !its_hamburger && menu_is_active) {
    toggle();
  }
});

// Mobile menu expand
const expandBtn = document.querySelectorAll(".expand-btn");
expandBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (window.innerWidth <= 1024) {
      // Prevent Default Anchor Click Behavior
      event.preventDefault();
      btn.classList.toggle("open");
      btn.nextElementSibling.slideToggle(300);
    }
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1024) {
    // Off menu mobile on desktop
    if (menuBtn.classList.contains("open")) {
      toggle();
    }
    // Change arrow menu on Desktop
    for (var i = 0; i < expandBtn.length; i += 1) {
      expandBtn[i].classList.remove("open");
    }
    // Off SlideToggle Menu on Desktop
    const dropdownMenu = document.querySelectorAll(
      ".menu-items .dropdown-menu"
    );
    for (var i = 0; i < dropdownMenu.length; i += 1) {
      dropdownMenu[i].style.display = "";
    }
  }
});


// site function for image compression 
function updateMaxWidth() {
    const rangeInput = document.getElementById('maxWidthRange');
    const maxWidthValue = document.getElementById('maxWidthValue');
    const newMaxWidth = rangeInput.value;
    maxWidthValue.innerText = newMaxWidth;  
}
        function displayOriginalPreview() {
    const originalImageLoading = document.getElementById('originalImageLoading');
    originalImageLoading.style.display = 'block';

    const input = document.getElementById('imageInput');
    const originalImageContainer = document.getElementById('originalImageContainer');
    const originalImage = document.getElementById('originalImage');
    const fileSizeElement = document.getElementById('fileSizeOriginal');
    const maxWidthRange = document.getElementById('maxWidthRange');

    if (input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            originalImageLoading.style.display = 'none';
            originalImageContainer.style.display = 'block';
            originalImage.src = e.target.result;

            const originalFileSize = file.size;
            fileSizeElement.innerText = `Original Image Size: ${formatBytes(originalFileSize)}`;

            // Set the max value of the range input to the natural width of the image
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const naturalWidth = img.naturalWidth;
                maxWidthRange.max = naturalWidth;
                maxWidthRange.value = naturalWidth;
                document.getElementById('maxWidthValue').innerText = naturalWidth;
            };
        };

        reader.readAsDataURL(file);
    }
}

       function compressImageBySize() {
    const input = document.getElementById('imageInput');
    const downloadLink = document.getElementById('downloadLink');
    const compressedImage = document.getElementById('compressedImage');
    const targetSizeKB = document.getElementById('fileSize').value;
    const fileSizeElement = document.getElementById('fileSizeCompressed');
    const compressedImageContainer = document.getElementById('compressedImageContainer');
    const compressedImageLoading = document.getElementById('compressedImageLoading');

    if (input.files.length > 0) {
        compressedImageContainer.style.display = 'block';
        compressedImageLoading.style.display = 'block';

        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                // Rest of your compression logic
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const naturalWidth = img.naturalWidth;
                const naturalHeight = img.naturalHeight;
                const aspectRatio = naturalWidth / naturalHeight;
                const maxWidth = parseInt(document.getElementById('maxWidthRange').value);
                let newWidth = Math.min(naturalWidth, maxWidth);
                let newHeight = newWidth / aspectRatio;
                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                let compressedDataURL;
                let compressedFileSize;

                let quality = 1.0;
                do {
                    compressedDataURL = canvas.toDataURL('image/jpeg', quality);
                    compressedFileSize = getFileSize(compressedDataURL);
                    quality -= 0.01;
                } while (compressedFileSize > targetSizeKB * 1024 && quality > 0);

                compressedImage.src = compressedDataURL;
                downloadLink.href = compressedDataURL;
                downloadLink.style.display = 'block';
                fileSizeElement.innerText = `Compressed Image Size: ${formatBytes(compressedFileSize)}`;

                compressedImageContainer.style.display = 'block';
                compressedImageLoading.style.display = 'none';
            };
        };

        reader.readAsDataURL(file);
    } else {
        alert('Please select an image before compressing.');
        compressedImageContainer.style.display = 'none';
    }
}
function getFileSize(dataURL) {

            const base64Data = dataURL.split(',')[1];
            
            const binaryData = atob(base64Data);
   
            return binaryData.length;
        }

        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';

            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }


        function hideLoadingSpinner(elementId) {
            const loadingSpinner = document.getElementById(elementId);
            loadingSpinner.style.display = 'none';
        }
       