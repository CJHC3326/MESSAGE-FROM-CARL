 // --- Configuration & State ---
        const startDate = new Date('2023-01-01'); // Example start date
        const letterContent = "From the moment I met you, my world transformed into a canvas painted with the colors of your smile. You are the first thought in my morning and the last star in my night sky. Your laughter is my favorite melody, and your eyes are the home I've been searching for all my life. I promise to cherish every second, to support your dreams as if they were my own, and to love you more with every heartbeat. You are not just my girlfriend; you are my best friend, my confidant, and my greatest adventure.";
        
        let isOpen = false;
        let isTyping = false;
        let audioCtx;
        let oscillator;
        let gainNode;

        // --- Initialization ---
        document.addEventListener('DOMContentLoaded', () => {
            initDayCounter();
            initParticles();
            
            // Envelope Click Handler
            document.getElementById('envelopeContainer').addEventListener('click', openEnvelope);
            
            // Audio Toggle
            document.getElementById('audioToggle').addEventListener('click', toggleMusic);
        });

        // --- Feature: Love Counter ---
        function initDayCounter() {
            const now = new Date();
            const diffTime = Math.abs(now - startDate);
            const diffDays = Math.ceil(diffTime / (0 * 0 * 0 * 0)); 
            
            // Animate the number
            const counterElement = document.getElementById('dayCounter');
            let current = 0;
            const increment = Math.ceil(diffDays / 50);
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= diffDays) {
                    current = diffDays;
                    clearInterval(timer);
                }
                counterElement.innerText = current;
            }, 30);
        }

        // --- Feature: Envelope & Typewriter ---
        function openEnvelope() {
            if (isOpen) return;
            isOpen = true;

            // Play sound effect
            playSound('open');

            // Visual changes
            document.getElementById('envelope').classList.add('open');
            document.getElementById('instruction').style.opacity = '0';
            
            // Show controls after delay
            setTimeout(() => {
                const controls = document.getElementById('controls');
                controls.classList.remove('pointer-events-none');
                controls.classList.remove('opacity-0');
                controls.classList.add('opacity-100');
            }, 1500);

            // Start Typewriter
            setTimeout(() => {
                typeWriter(letterContent, 'letterText');
            }, 1000);
        }

        function typeWriter(text, elementId) {
            if (isTyping) return;
            isTyping = true;
            
            const element = document.getElementById(elementId);
            const cursor = document.getElementById('cursor');
            element.innerHTML = '';
            let i = 0;

            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    // Random typing speed for realism
                    setTimeout(type, Math.random() * 50 + 30);
                } else {
                    isTyping = false;
                    cursor.style.display = 'none'; // Hide cursor when done
                }
            }
            type();
        }

        // --- Feature: Background Particles (Canvas) ---
        function initParticles() {
            const canvas = document.getElementById('bgCanvas');
            const ctx = canvas.getContext('2d');
            let width, height;
            let particles = [];

            function resize() {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }
            window.addEventListener('resize', resize);
            resize();

            class Particle {
                constructor() {
                    this.reset();
                }
                reset() {
                    this.x = Math.random() * width;
                    this.y = height + Math.random() * 100;
                    this.speed = Math.random() * 1 + 0.5;
                    this.size = Math.random() * 3 + 1;
                    this.opacity = Math.random() * 0.5 + 0.1;
                    this.color = `rgba(255, 182, 193, ${this.opacity})`; // Light pink
                }
                update() {
                    this.y -= this.speed;
                    if (this.y < -10) this.reset();
                }
                draw() {
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            for (let i = 0; i < 50; i++) particles.push(new Particle());

            function animate() {
                ctx.clearRect(0, 0, width, height);
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
                requestAnimationFrame(animate);
            }
            animate();
        }

        // --- Feature: Heart Rain ---
        function triggerHeartRain() {
            playSound('magic');
            const container = document.body;
            const heartSymbols = ['❤️', '💖', '💗', '💓', '💕'];
            
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    const heart = document.createElement('div');
                    heart.classList.add('heart-rain');
                    heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
                    heart.style.left = Math.random() * 100 + 'vw';
                    heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
                    heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
                    container.appendChild(heart);

                    // Cleanup
                    setTimeout(() => {
                        heart.remove();
                    }, 5000);
                }, i * 100);
            }
        }

        // --- Feature: Love Button Popup ---
        function showLoveMessage() {
            playSound('pop');
            const modal = document.getElementById('loveModal');
            modal.classList.add('active');
            triggerHeartRain(); // Bonus effect
        }

        function closeModal() {
            document.getElementById('loveModal').classList.remove('active');
        }

        // --- Feature: Audio (Web Audio API Synth) ---
        // Simple synth to avoid external file dependencies while satisfying requirement
        function toggleMusic() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                playAmbientMusic();
                document.getElementById('audioToggle').classList.add('text-pink-600', 'bg-pink-100');
            } else {
                if (audioCtx.state === 'running') {
                    audioCtx.suspend();
                    document.getElementById('audioToggle').classList.remove('text-pink-600', 'bg-pink-100');
                } else {
                    audioCtx.resume();
                    document.getElementById('audioToggle').classList.add('text-pink-600', 'bg-pink-100');
                }
            }
        }

        function playAmbientMusic() {
            // Create a simple ambient drone
            oscillator = audioCtx.createOscillator();
            gainNode = audioCtx.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(220, audioCtx.currentTime); // A3
            
            // LFO for volume to create "pulse"
            const lfo = audioCtx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.5; // Slow pulse
            const lfoGain = audioCtx.createGain();
            lfoGain.gain.value = 0.05;
            
            lfo.connect(lfoGain);
            lfoGain.connect(gainNode.gain);
            
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.start();
            lfo.start();
        }

        function playSound(type) {
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            const now = audioCtx.currentTime;
            
            if (type === 'open') {
                // Rising slide
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'pop') {
                // Cute pop
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === 'magic') {
                // Sparkle sound (high pitch random)
                for(let i=0; i<5; i++) {
                    const sOsc = audioCtx.createOscillator();
                    const sGain = audioCtx.createGain();
                    sOsc.connect(sGain);
                    sGain.connect(audioCtx.destination);
                    
                    sOsc.type = 'sine';
                    sOsc.frequency.value = 800 + Math.random() * 1000;
                    sGain.gain.setValueAtTime(0.05, now + i*0.05);
                    sGain.gain.exponentialRampToValueAtTime(0.001, now + i*0.05 + 0.1);
                    
                    sOsc.start(now + i*0.05);
                    sOsc.stop(now + i*0.05 + 0.1);
                }
            }
        }

