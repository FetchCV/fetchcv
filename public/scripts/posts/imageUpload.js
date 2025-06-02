// @ts-nocheck
let currentFiles = [];
const fileInput = document.querySelector(".file-input");
const previewArea = document.getElementById("upload-preview-area");
const alertDiv = document.querySelector(".alert");
const MAX_FILES = 10;
function showAlert(message) {
    alertDiv.textContent = message;
    alertDiv.classList.remove("hidden");
    setTimeout(() => {
        hideAlert();
    }, 5000);
}
function hideAlert() {
    alertDiv.classList.add("hidden");
    alertDiv.textContent = "";
}
function autoGrow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}
function updateFileState() {
    const dataTransfer = new DataTransfer();
    currentFiles.forEach(file => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;
    if (currentFiles.length === 0) {
        previewArea.innerHTML = "Upload an image or video";
        previewArea.classList.remove("flex", "flex-wrap", "justify-start", "items-center", "p-2");
        previewArea.classList.add("text-center", "text-close-b-dark", "p-4");
    }
    else {
        previewArea.classList.add("flex", "flex-wrap", "justify-start", "items-center", "p-2");
        previewArea.classList.remove("text-center", "text-close-b-dark", "p-4");
    }
}
function displayPreview(file, parentElement) {
    const previewItemContainer = document.createElement("div");
    previewItemContainer.className = "relative inline-flex items-center justify-center m-1 border border-gray-300 dark:border-zinc-600 rounded-md overflow-hidden transition-all duration-150 ease-in-out hover:shadow-lg hover:border-gray-400 dark:hover:border-zinc-500";
    const removeButton = document.createElement("button");
    removeButton.innerHTML = "&times;";
    removeButton.type = "button";
    removeButton.title = "Remove media";
    removeButton.className = "absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm leading-none hover:bg-red-700 z-10 focus:outline-none";
    removeButton.onclick = (event) => {
        event.stopPropagation(); // Prevent triggering click on the preview item itself
        currentFiles = currentFiles.filter(f => f !== file);
        previewItemContainer.remove();
        updateFileState();
    };
    previewItemContainer.appendChild(removeButton);
    if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.alt = "Image preview";
        img.className = "block max-w-full max-h-24 h-24 w-auto object-contain";
        img.addEventListener("click", (event) => {
            event.stopPropagation();
        });
        img.onload = () => {
            URL.revokeObjectURL(img.src);
        };
        previewItemContainer.appendChild(img);
    }
    else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        const objectUrl = URL.createObjectURL(file);
        video.title = "Click to play";
        video.src = objectUrl;
        video.controls = false;
        video.className = "block max-w-full max-h-24 h-24 w-auto object-contain";
        video.addEventListener("click", () => {
            event?.stopPropagation();
            if (video.paused) {
                video.play();
                video.title = "Click to pause";
            }
            else {
                video.pause();
                video.title = "Click to play";
            }
        });
        // Revoke the object URL when the preview is removed from DOM
        previewItemContainer.addEventListener("DOMNodeRemoved", () => {
            URL.revokeObjectURL(objectUrl);
        });
        previewItemContainer.appendChild(video);
    }
    else {
        const unsupportedText = document.createElement("span");
        unsupportedText.textContent = "Unsupported";
        unsupportedText.className = "p-2 text-xs text-red-500 self-center";
        previewItemContainer.appendChild(unsupportedText);
    }
    parentElement.appendChild(previewItemContainer);
}
function handleFiles() {
    hideAlert(); // Hide any previous alerts
    const newFiles = Array.from(this.files);
    let filesProcessed = 0;
    const validNewFiles = newFiles.filter(file => {
        const isDuplicate = currentFiles.some(existingFile => existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified);
        return !isDuplicate && (file.type.startsWith("image/") || file.type.startsWith("video/"));
    });
    if (currentFiles.length >= MAX_FILES && validNewFiles.length > 0) {
        showAlert(`Maximum of ${MAX_FILES} files already uploaded.`);
        this.value = "";
        return;
    }
    let slotsAvailable = MAX_FILES - currentFiles.length;
    for (const file of validNewFiles) {
        if (slotsAvailable <= 0) {
            showAlert(`File limit of ${MAX_FILES} reached. Some files were not added.`);
            break;
        }
        if (currentFiles.length === 0 && filesProcessed === 0 && previewArea.textContent.includes("Upload an image or video")) {
            previewArea.innerHTML = "";
        }
        currentFiles.push(file);
        displayPreview(file, previewArea);
        slotsAvailable--;
        filesProcessed++;
    }
    if (filesProcessed > 0) {
        updateFileState();
    }
    this.value = "";
}
function dragOverHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    previewArea.classList.add("border-2", "border-dashed", "border-public");
}
function dragLeaveHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    previewArea.classList.remove("border-2", "border-dashed", "border-public");
}
function dropHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    hideAlert();
    previewArea.classList.remove("border-2", "border-dashed", "border-public");
    const droppedFiles = Array.from(event.dataTransfer.files);
    let filesProcessed = 0;
    const validDroppedFiles = droppedFiles.filter(file => {
        const isDuplicate = currentFiles.some(existingFile => existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified);
        return !isDuplicate && (file.type.startsWith("image/") || file.type.startsWith("video/"));
    });
    if (currentFiles.length >= MAX_FILES && validDroppedFiles.length > 0) {
        showAlert(`Maximum of ${MAX_FILES} files already uploaded.`);
        return;
    }
    let slotsAvailable = MAX_FILES - currentFiles.length;
    for (const file of validDroppedFiles) {
        if (slotsAvailable <= 0) {
            showAlert(`File limit of ${MAX_FILES} reached. Some files were not added.`);
            break;
        }
        if (currentFiles.length === 0 && filesProcessed === 0 && previewArea.textContent.includes("Upload an image or video")) {
            previewArea.innerHTML = "";
        }
        currentFiles.push(file);
        displayPreview(file, previewArea);
        slotsAvailable--;
        filesProcessed++;
    }
    if (filesProcessed > 0) {
        updateFileState();
    }
    else if (droppedFiles.length > 0 && validDroppedFiles.length === 0) {
        if (droppedFiles.some(f => !currentFiles.find(cf => cf.name === f.name && cf.size === f.size))) {
            previewArea.innerHTML = "Please drop an image or video file.";
        }
        updateFileState();
        if (currentFiles.length === 0)
            updateFileState();
    }
}
previewArea.addEventListener("dragover", dragOverHandler, false);
previewArea.addEventListener("dragleave", dragLeaveHandler, false);
previewArea.addEventListener("drop", dropHandler, false);
fileInput.addEventListener("change", handleFiles, false);
updateFileState();
async function getFile() {
    try {
        hideAlert();
        const fileHandles = await window.showOpenFilePicker({
            types: [{
                    description: "Images and videos",
                    accept: {
                        "image/*": [".png", ".jpg", ".jpeg", ".gif"],
                        "video/*": [".mp4", ".mov", ".avi"]
                    }
                }],
            excludeAcceptAllOption: true,
            multiple: true
        });
        const potentialFiles = [];
        for (const handle of fileHandles) {
            potentialFiles.push(await handle.getFile());
        }
        let filesProcessed = 0;
        const validNewFiles = potentialFiles.filter(file => {
            const isDuplicate = currentFiles.some(existingFile => existingFile.name === file.name &&
                existingFile.size === file.size &&
                existingFile.lastModified === file.lastModified);
            return !isDuplicate && (file.type.startsWith("image/") || file.type.startsWith("video/"));
        });
        if (currentFiles.length >= MAX_FILES && validNewFiles.length > 0) {
            showAlert(`Maximum of ${MAX_FILES} files already uploaded.`);
            return;
        }
        let slotsAvailable = MAX_FILES - currentFiles.length;
        for (const file of validNewFiles) {
            if (slotsAvailable <= 0) {
                showAlert(`File limit of ${MAX_FILES} reached. Some files were not added.`);
                break;
            }
            if (currentFiles.length === 0 && filesProcessed === 0 && previewArea.textContent.includes("Upload an image or video")) {
                previewArea.innerHTML = "";
            }
            currentFiles.push(file);
            displayPreview(file, previewArea);
            slotsAvailable--;
            filesProcessed++;
        }
        if (filesProcessed > 0) {
            updateFileState();
        }
    }
    catch (err) {
        updateFileState();
    }
}
