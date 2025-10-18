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

    // Add screen shake effect
    const giftScreen = document.getElementById('giftScreen');
    giftScreen.style.animation = 'screenShake 0.5s ease-in-out';

    // Add wave pulse effect around the gift
    const wave = document.createElement('div');
    wave.style.position = 'absolute';
    wave.style.width = '400px';
    wave.style.height = '400px';
    wave.style.borderRadius = '50%';
    wave.style.background = 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)';
    wave.style.left = '50%';
    wave.style.top = '50%';
    wave.style.transform = 'translate(-50%, -50%)';
    wave.style.animation = 'wavePulse 0.8s ease-out';
    wave.style.pointerEvents = 'none';
    wave.style.zIndex = '15';
    giftScreen.appendChild(wave);

    // Add flash effect
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.background = 'white';
    flash.style.opacity = '0';
    flash.style.animation = 'flash 0.3s ease-in-out';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '20';
    giftScreen.appendChild(flash);

    giftBox.classList.add('opening');
    createConfetti();
    const music = document.getElementById('bgMusic');
    if (music.src) {
        music.play().catch(e => console.log('Music autoplay prevented'));
    }

    setTimeout(() => {
        console.log('[DEBUG] Transitioning screens...');
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
    const particles = ['🌸', '🌺', '🌼', '🌻', '🌷', '🌹', '💐', '✨', '💖', '🎀', '🌟', '💫', '⭐', '🌙', '☀️'];

    setInterval(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.fontSize = (Math.random() * 20 + 15) + 'px'; // Vary size
        particle.style.opacity = (Math.random() * 0.5 + 0.3); // Vary opacity

        container.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 20000);
    }, 500); // More frequent particles
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

    // Shuffle photos for random order each time
    const shuffledPhotos = shuffleArray([...photos]);

    // Duplicate shuffled photos for seamless loop
    const duplicatedPhotos = [...shuffledPhotos, ...shuffledPhotos];

    // Preload first few images for faster loading
    preloadImages(duplicatedPhotos.slice(0, 5));

    duplicatedPhotos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';

        // Add particle trail effect
        const particleTrail = document.createElement('div');
        particleTrail.className = 'particle-trail';
        particleTrail.style.position = 'absolute';
        particleTrail.style.width = '100%';
        particleTrail.style.height = '100%';
        particleTrail.style.pointerEvents = 'none';
        particleTrail.style.zIndex = '1';
        photoItem.appendChild(particleTrail);

        // Generate particles for trail
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.width = '4px';
                particle.style.height = '4px';
                particle.style.background = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][Math.floor(Math.random() * 5)];
                particle.style.borderRadius = '50%';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animation = `particleFloat ${1 + Math.random() * 2}s ease-out forwards`;
                particleTrail.appendChild(particle);

                setTimeout(() => particle.remove(), 3000);
            }, i * 200);
        }

        // Add 3D tilt effect
        photoItem.addEventListener('mousemove', (e) => {
            const rect = photoItem.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            photoItem.style.transform = `translateY(var(--float, 0px)) rotate(var(--rotate, 0deg)) scale(var(--scale, 1)) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        photoItem.addEventListener('mouseleave', () => {
            photoItem.style.transform = 'translateY(var(--float, 0px)) rotate(var(--rotate, 0deg)) scale(var(--scale, 1))';
        });

        // Firework burst when photo reaches center
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    createFireworkBurst(photoItem);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(photoItem);

        if (photo.isPlaceholder) {
            // Create placeholder
            photoItem.style.background = `linear-gradient(135deg, ${photo.color}, ${adjustColor(photo.color, -20)})`;
            photoItem.innerHTML += `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 4rem; font-weight: bold;">👧</div>`;
        } else {
            // Load actual photo with lazy loading
            const img = document.createElement('img');
            img.src = photo;
            img.alt = `Photo ${index + 1}`;
            img.loading = 'lazy';  // Enable lazy loading
            img.decoding = 'async';  // Async decoding for better performance
            img.onload = function() {
                img.classList.add('loaded');  // Add loaded class for fade-in effect
            };
            img.onerror = function() {
                // Fallback if image fails to load
                console.log('Image failed to load:', photo);
                photoItem.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                photoItem.innerHTML += '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 3rem;">🌸</div>';
            };
            photoItem.appendChild(img);
        }

        track.appendChild(photoItem);
    });

    console.log('Photos loaded successfully!');
}

function createFireworkBurst(element) {
    const burstContainer = document.createElement('div');
    burstContainer.style.position = 'absolute';
    burstContainer.style.width = '100%';
    burstContainer.style.height = '100%';
    burstContainer.style.top = '0';
    burstContainer.style.left = '0';
    burstContainer.style.pointerEvents = 'none';
    burstContainer.style.zIndex = '10';
    element.appendChild(burstContainer);

    // Increase number of particles for more spectacular effect
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8', '#a29bfe', '#fab1a0'][Math.floor(Math.random() * 8)];
        particle.style.borderRadius = '50%';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.transform = 'translate(-50%, -50%)';
        particle.style.animation = `fireworkBurst 1.5s ease-out forwards`;

        const angle = (i / 40) * 360;
        const distance = 120 + Math.random() * 80;
        particle.style.setProperty('--angle', angle + 'deg');
        particle.style.setProperty('--distance', distance + 'px');

        burstContainer.appendChild(particle);

        setTimeout(() => particle.remove(), 1500);
    }

    setTimeout(() => burstContainer.remove(), 1500);
}

function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Preload images for faster loading
function preloadImages(imageUrls) {
    imageUrls.forEach(url => {
        if (typeof url === 'string' && !url.isPlaceholder) {
            const img = new Image();
            img.src = url;
        }
    });
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

// ==================== PHOTO SCALING ====================
function updatePhotoScales() {
    const photoItems = document.querySelectorAll('.photo-item');
    const viewportCenter = window.innerWidth / 2;

    photoItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distanceFromCenter = Math.abs(itemCenter - viewportCenter);
        const maxDistance = viewportCenter; // Maximum distance from center

        // Calculate scale: closer to center = bigger, farther = smaller
        // Scale from 0.7 (far) to 1.2 (center), but not too big to hide wishes
        const scale = 1.2 - (distanceFromCenter / maxDistance) * 0.5;

        // Clamp scale between 0.7 and 1.1 to avoid too small or too big
        const clampedScale = Math.max(0.7, Math.min(1.1, scale));

        item.style.setProperty('--scale', clampedScale);
    });
}

// ==================== UTILITIES ====================
document.addEventListener('DOMContentLoaded', function() {
    // Start photo scaling updates
    updatePhotoScales();
    setInterval(updatePhotoScales, 10); // Update every 10ms for smooth scaling
});
