// ==================== GLOBAL VARIABLES ====================
let photos = [];
let wishes = [];
let currentWishIndex = 0;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initFlowers();
    loadMusic();
    fetchPhotos();
    startWishRotation();
    
    // Pre-generate placeholders if no photos
    if (photos.length === 0) {
        photos = generatePlaceholderPhotos();
    }
});

// ==================== INTRO SCREEN ====================
function initFlowers() {
    const container = document.getElementById('flowersContainer');
    const flowers = ['🌸', '🌺', '🌼', '🌻', '🌷', '🌹', '💐', '🏵️'];
    
    setInterval(() => {
        const flower = document.createElement('div');
        flower.className = 'flower';
        flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
        flower.style.left = Math.random() * 100 + '%';
        flower.style.animationDuration = (Math.random() * 3 + 5) + 's';
        flower.style.fontSize = (Math.random() * 20 + 20) + 'px';
        
        container.appendChild(flower);
        
        setTimeout(() => {
            flower.remove();
        }, 8000);
    }, 300);
}

function showGiftScreen() {
    const introScreen = document.getElementById('introScreen');
    const giftScreen = document.getElementById('giftScreen');
    
    introScreen.classList.remove('active');
    setTimeout(() => {
        giftScreen.classList.add('active');
    }, 100);
}

// ==================== GIFT SCREEN ====================
function openGift(giftBox) {
    console.log('[DEBUG] openGift called.');
    giftBox.classList.add('opening');
    createConfetti();
    const music = document.getElementById('bgMusic');
    if (music.src) {
        music.play().catch(e => console.log('Music autoplay prevented'));
    }

    setTimeout(() => {
        console.log('[DEBUG] Transitioning screens...');
        const giftScreen = document.getElementById('giftScreen');
        const mainScreen = document.getElementById('mainScreen');
        
        giftScreen.classList.remove('active');
        mainScreen.classList.add('active');

        setTimeout(() => {
            console.log('[DEBUG] Mid-transition check:');
            console.log('[DEBUG] giftScreen opacity:', getComputedStyle(giftScreen).opacity);
            console.log('[DEBUG] mainScreen opacity:', getComputedStyle(mainScreen).opacity);
        }, 400);

        setTimeout(() => {
            initMainScreen();
        }, 800);
    }, 1500);
}

function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];
    
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            container.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 10);
    }
}

// ==================== MAIN SCREEN ====================
function initMainScreen() {
    console.log('--- [DEBUG] initMainScreen CALLED ---');
    console.trace(); // This will print a stack trace to find the caller.
    initBackgroundParticles();
    loadPhotosIntoRail();
    console.log('--- [DEBUG] initMainScreen FINISHED ---');
}

function initBackgroundParticles() {
    const container = document.getElementById('bgParticles');
    const particles = ['🌸', '🌺', '🌼', '🌻', '🌷', '🌹', '💐', '✨', '💖', '🎀'];
    
    setInterval(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 20000);
    }, 800);
}

// ==================== PHOTOS ====================
function fetchPhotos() {
    fetch('/api/photos')
        .then(response => response.json())
        .then(data => {
            if (data.photos && data.photos.length > 0) {
                photos = data.photos;
                console.log('Loaded photos:', photos.length);
            } else {
                console.log('No photos found, using placeholders');
                photos = generatePlaceholderPhotos();
            }
        })
        .catch(error => {
            console.error('Error fetching photos:', error);
            // Use placeholder if no photos found
            photos = generatePlaceholderPhotos();
        });
}

function generatePlaceholderPhotos() {
    // Tạo placeholder nếu chưa có ảnh
    const placeholders = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8', '#a29bfe', '#fab1a0'];
    
    for (let i = 0; i < 8; i++) {
        placeholders.push({
            isPlaceholder: true,
            color: colors[i],
            number: i + 1
        });
    }
    return placeholders;
}

function loadPhotosIntoRail() {
    const track = document.getElementById('photosTrack');
    if (!track) {
        console.error('Photos track not found!');
        return;
    }
    
    track.innerHTML = '';
    
    // Always ensure we have photos
    if (!photos || photos.length === 0) {
        console.log('No photos available, generating placeholders...');
        photos = generatePlaceholderPhotos();
    }
    
    console.log('Loading photos into rail:', photos.length);
    
    // Duplicate photos for seamless loop
    const duplicatedPhotos = [...photos, ...photos];
    
    duplicatedPhotos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        
        if (photo.isPlaceholder) {
            // Create placeholder
            photoItem.style.background = `linear-gradient(135deg, ${photo.color}, ${adjustColor(photo.color, -20)})`;
            photoItem.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 4rem; font-weight: bold;">👧</div>`;
        } else {
            // Load actual photo
            const img = document.createElement('img');
            img.src = photo;
            img.alt = `Photo ${index + 1}`;
            img.onerror = function() {
                // Fallback if image fails to load
                console.log('Image failed to load:', photo);
                photoItem.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                photoItem.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 3rem;">🌸</div>';
            };
            photoItem.appendChild(img);
        }
        
        track.appendChild(photoItem);
    });
    
    console.log('Photos loaded successfully!');
}

function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// ==================== WISHES ====================
function startWishRotation() {
    // Fetch wishes from server periodically
    setInterval(() => {
        fetchRandomWish();
    }, 5000); // Change wish every 5 seconds
    
    // Initial fetch
    fetchRandomWish();
}

function fetchRandomWish() {
    fetch('/api/wish')
        .then(response => response.json())
        .then(data => {
            updateWishDisplay(data.wish);
        })
        .catch(error => {
            console.error('Error fetching wish:', error);
        });
}

function updateWishDisplay(wish) {
    const wishText = document.getElementById('wishText');
    
    // Fade out
    wishText.style.animation = 'none';
    setTimeout(() => {
        wishText.textContent = wish;
        // Fade in
        wishText.style.animation = 'fadeText 1s ease';
    }, 100);
}

// ==================== MUSIC ====================
function loadMusic() {
    fetch('/api/music')
        .then(response => response.json())
        .then(data => {
            if (data.music) {
                const audio = document.getElementById('bgMusic');
                audio.src = data.music;
                audio.volume = 0.5;
                console.log('Music loaded:', data.music);
            } else {
                console.log('No music file found in assets/musics/');
            }
        })
        .catch(error => {
            console.error('Error loading music:', error);
        });
}

// ==================== UTILITIES ====================
// Pause animation on hover (optional feature)
document.addEventListener('DOMContentLoaded', function() {
    const photosTrack = document.getElementById('photosTrack');
    
    if (photosTrack) {
        photosTrack.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        photosTrack.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    }
});