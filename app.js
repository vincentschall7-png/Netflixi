// ============================================
// CONSTANTS & STATE
// ============================================
const CORRECT_PASSWORD = 'derkomische';

let videos = [];
let currentVideoIndex = null;

// ============================================
// DOM ELEMENTS
// ============================================
const uploadBtn = document.getElementById('uploadBtn');
const uploadModal = document.getElementById('uploadModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const passwordInput = document.getElementById('passwordInput');
const verifyPasswordBtn = document.getElementById('verifyPasswordBtn');
const passwordError = document.getElementById('passwordError');
const passwordStep = document.getElementById('passwordStep');
const uploadStep = document.getElementById('uploadStep');
const videoName = document.getElementById('videoName');
const videoFile = document.getElementById('videoFile');
const videoChunks = document.getElementById('videoChunks');
const uploadVideoBtn = document.getElementById('uploadVideoBtn');
const videoGallery = document.getElementById('videoGallery');
const videoPlayer = document.getElementById('videoPlayer');
const playerSection = document.getElementById('playerSection');
const currentVideoTitle = document.getElementById('currentVideoTitle');
const speedSlider = document.getElementById('speedSlider');
const speedDisplay = document.getElementById('speedDisplay');
const closePlayerBtn = document.getElementById('closePlayerBtn');
const singleUploadDiv = document.getElementById('singleUploadDiv');
const chunkUploadDiv = document.getElementById('chunkUploadDiv');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const chunksNameDisplay = document.getElementById('chunksNameDisplay');
const chunksList = document.getElementById('chunksList');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadVideos();
    setupEventListeners();
    setupRealtimeListener();
});

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Modal controls
    uploadBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    uploadModal.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // Password verification
    verifyPasswordBtn.addEventListener('click', verifyPassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyPassword();
    });

    // Upload method toggle
    document.querySelectorAll('input[name="uploadMethod"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'single') {
                singleUploadDiv.classList.remove('hidden');
                chunkUploadDiv.classList.add('hidden');
            } else {
                singleUploadDiv.classList.add('hidden');
                chunkUploadDiv.classList.remove('hidden');
            }
        });
    });

    // File selection
    videoFile.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileNameDisplay.textContent = e.target.files[0].name;
        }
    });

    videoChunks.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            chunksNameDisplay.textContent = `${e.target.files.length} Dateien ausgewählt`;
            displayChunksList(e.target.files);
        }
    });

    // File label clicks
    document.querySelector('label[for="videoFile"]').addEventListener('click', () => {
        videoFile.click();
    });

    document.querySelector('label[for="videoChunks"]').addEventListener('click', () => {
        videoChunks.click();
    });

    // Upload button
    uploadVideoBtn.addEventListener('click', handleUpload);

    // Player controls
    speedSlider.addEventListener('input', updatePlaybackSpeed);
    closePlayerBtn.addEventListener('click', closePlayer);
}

// ============================================
// FIREBASE REALTIME LISTENER
// ============================================
function setupRealtimeListener() {
    // Listen for real-time updates to videos collection
    videosCollection.orderBy('uploadDate', 'desc').onSnapshot((snapshot) => {
        videos = [];
        snapshot.forEach((doc) => {
            videos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        renderGallery();
    }, (error) => {
        console.error('Error listening to videos:', error);
    });
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function openModal() {
    uploadModal.classList.remove('hidden');
    resetModal();
}

function closeModal() {
    uploadModal.classList.add('hidden');
    resetModal();
}

function resetModal() {
    passwordStep.classList.remove('hidden');
    uploadStep.classList.add('hidden');
    passwordInput.value = '';
    passwordError.classList.add('hidden');
    videoName.value = '';
    videoFile.value = '';
    videoChunks.value = '';
    fileNameDisplay.textContent = 'Video auswählen...';
    chunksNameDisplay.textContent = 'Video-Teile auswählen...';
    chunksList.innerHTML = '';
    uploadProgress.classList.add('hidden');
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    document.querySelector('input[name="uploadMethod"][value="single"]').checked = true;
    singleUploadDiv.classList.remove('hidden');
    chunkUploadDiv.classList.add('hidden');
}

function verifyPassword() {
    const password = passwordInput.value;
    if (password === CORRECT_PASSWORD) {
        passwordStep.classList.add('hidden');
        uploadStep.classList.remove('hidden');
        passwordError.classList.add('hidden');
    } else {
        passwordError.classList.remove('hidden');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// ============================================
// UPLOAD FUNCTIONS
// ============================================
function displayChunksList(files) {
    const fileNames = Array.from(files).map(f => f.name).join(', ');
    chunksList.textContent = `Ausgewählte Dateien: ${fileNames}`;
}

async function handleUpload() {
    const name = videoName.value.trim();
    if (!name) {
        alert('Bitte geben Sie einen Video-Namen ein!');
        return;
    }

    const uploadMethod = document.querySelector('input[name="uploadMethod"]:checked').value;

    try {
        uploadProgress.classList.remove('hidden');
        uploadVideoBtn.disabled = true;

        let videoBlob;

        if (uploadMethod === 'single') {
            if (!videoFile.files.length) {
                alert('Bitte wählen Sie eine Video-Datei aus!');
                uploadVideoBtn.disabled = false;
                uploadProgress.classList.add('hidden');
                return;
            }
            videoBlob = videoFile.files[0];
            updateProgress(25);
        } else {
            if (!videoChunks.files.length) {
                alert('Bitte wählen Sie Video-Teile aus!');
                uploadVideoBtn.disabled = false;
                uploadProgress.classList.add('hidden');
                return;
            }
            videoBlob = await mergeVideoChunks(videoChunks.files);
            updateProgress(25);
        }

        await uploadToFirebase(name, videoBlob);

        setTimeout(() => {
            closeModal();
            uploadVideoBtn.disabled = false;
        }, 500);

    } catch (error) {
        console.error('Upload error:', error);
        alert('Fehler beim Hochladen: ' + error.message);
        uploadVideoBtn.disabled = false;
        uploadProgress.classList.add('hidden');
    }
}

async function mergeVideoChunks(files) {
    const chunks = Array.from(files).sort((a, b) => a.name.localeCompare(b.name));
    const totalChunks = chunks.length;

    const blobs = [];
    for (let i = 0; i < totalChunks; i++) {
        const chunk = chunks[i];
        blobs.push(chunk);
        updateProgress(10 + (i / totalChunks) * 15);
    }

    const mergedBlob = new Blob(blobs, { type: 'video/mp4' });
    return mergedBlob;
}

function updateProgress(percent) {
    progressFill.style.width = percent + '%';
    progressText.textContent = Math.round(percent) + '%';
}

// ============================================
// FIREBASE STORAGE FUNCTIONS
// ============================================
async function uploadToFirebase(name, videoBlob) {
    try {
        // Generate unique ID for video
        const videoId = 'video_' + Date.now();
        const fileName = `${videoId}.mp4`;

        // Upload to Firebase Storage
        const videoRef = videosStorageRef.child(videoId).child(fileName);

        updateProgress(30);

        // Upload with progress tracking
        const uploadTask = videoRef.put(videoBlob);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Progress
                    const progress = 30 + (snapshot.bytesTransferred / snapshot.totalBytes) * 60;
                    updateProgress(progress);
                },
                (error) => {
                    // Error
                    reject(error);
                },
                async () => {
                    // Success - get download URL
                    try {
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();

                        updateProgress(95);

                        // Create metadata in Firestore
                        await videosCollection.doc(videoId).set({
                            name: name,
                            videoUrl: downloadURL,
                            size: videoBlob.size,
                            uploadDate: firebase.firestore.FieldValue.serverTimestamp(),
                            fileName: fileName
                        });

                        updateProgress(100);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    } catch (error) {
        throw error;
    }
}

// ============================================
// LOAD VIDEOS FROM FIRESTORE
// ============================================
async function loadVideos() {
    try {
        const snapshot = await videosCollection.orderBy('uploadDate', 'desc').get();
        videos = [];
        snapshot.forEach((doc) => {
            videos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        renderGallery();
    } catch (error) {
        console.error('Error loading videos:', error);
        videos = [];
        renderGallery();
    }
}

// ============================================
// DELETE VIDEO
// ============================================
async function deleteVideo(id) {
    if (!confirm('Möchten Sie dieses Video wirklich löschen?')) {
        return;
    }

    try {
        // Get video data
        const videoDoc = await videosCollection.doc(id).get();
        const videoData = videoDoc.data();

        if (videoData && videoData.fileName) {
            // Delete from Storage
            const videoRef = videosStorageRef.child(id).child(videoData.fileName);
            await videoRef.delete();
        }

        // Delete from Firestore
        await videosCollection.doc(id).delete();

        if (currentVideoIndex !== null && videos[currentVideoIndex]?.id === id) {
            closePlayer();
        }
    } catch (error) {
        console.error('Error deleting video:', error);
        alert('Fehler beim Löschen: ' + error.message);
    }
}

// ============================================
// GALLERY FUNCTIONS
// ============================================
function renderGallery() {
    if (videos.length === 0) {
        videoGallery.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📹</div>
                <p>Noch keine Videos hochgeladen</p>
                <p class="empty-hint">Klicken Sie auf "Video hochladen", um zu beginnen</p>
            </div>
        `;
        return;
    }

    videoGallery.innerHTML = videos.map((video, index) => `
        <div class="video-card" data-index="${index}">
            <video class="video-thumbnail" src="${video.videoUrl}" muted></video>
            <div class="video-info">
                <h3>${escapeHtml(video.name)}</h3>
                <div class="video-meta">
                    <span>${formatFileSize(video.size)}</span>
                    <button class="delete-btn" data-id="${video.id}" title="Löschen">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-btn')) {
                const index = parseInt(card.dataset.index);
                playVideo(index);
            }
        });

        // Generate thumbnail
        const thumbnail = card.querySelector('.video-thumbnail');
        thumbnail.currentTime = 1; // Show frame at 1 second
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            deleteVideo(id);
        });
    });
}

// ============================================
// PLAYER FUNCTIONS
// ============================================
function playVideo(index) {
    if (index < 0 || index >= videos.length) return;

    currentVideoIndex = index;
    const video = videos[index];

    videoPlayer.src = video.videoUrl;
    currentVideoTitle.textContent = video.name;
    playerSection.classList.remove('hidden');

    // Scroll to player
    playerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Play video
    videoPlayer.play().catch(error => {
        console.error('Error playing video:', error);
    });
}

function closePlayer() {
    videoPlayer.pause();
    videoPlayer.src = '';
    playerSection.classList.add('hidden');
    currentVideoIndex = null;
}

function updatePlaybackSpeed() {
    const speed = speedSlider.value / 100;
    videoPlayer.playbackRate = speed;
    speedDisplay.textContent = speed.toFixed(2) + 'x';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
