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

function toggleFaqAnswer(faqId) {
        const faqAnswer = document.getElementById(faqId);
        faqAnswer.classList.toggle('show');
    }
        function hideLoadingSpinner(elementId) {
            const loadingSpinner = document.getElementById(elementId);
            loadingSpinner.style.display = 'none';
        }
         document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('menuBtn').addEventListener('click', function () {
        const navbar = document.querySelector('.navbar');
        navbar.classList.toggle('active');
    });         
});
