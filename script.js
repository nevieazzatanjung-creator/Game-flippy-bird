document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const bird = document.getElementById('bird');
    const scoreDisplay = document.getElementById('score');

    let birdBottom = 300; // Posisi vertikal burung (dari bawah container)
    let birdLeft = 50;   // Posisi horizontal burung (tetap)
    let gravity = 3;     // Kekuatan gravitasi
    let isGameOver = false;
    let score = 0;
    let gameTimerId;
    let pipeInterval = 1500; // Interval waktu (ms) untuk membuat pipa baru
    const gameHeight = 600;
    const gameWidth = 400;

    // --- LOGIKA UTAMA BURUNG ---

    function startGame() {
        // Gravitasi: burung terus turun
        birdBottom -= gravity;
        bird.style.bottom = birdBottom + 'px';
        
        // Memastikan burung tidak jatuh di bawah lantai
        if (birdBottom <= 0) {
            gameOver();
        }
    }

    gameTimerId = setInterval(startGame, 20); // Loop game utama (setiap 20ms)

    function jump() {
        if (birdBottom < (gameHeight - 50) && !isGameOver) { // Lompat jika tidak terlalu tinggi
            birdBottom += 50; // Jarak lompatan
            bird.style.bottom = birdBottom + 'px';
        }
    }

    // Mendeteksi tombol spasi atau klik untuk melompat
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.key === ' ') {
            jump();
        }
    });
    gameContainer.addEventListener('click', jump);


    // --- LOGIKA PIPA ---
    function generatePipes() {
        if (isGameOver) return;
        
        const pipeWidth = 50;
        const pipeGap = 150; // Jarak celah antara pipa atas dan bawah
        
        // Tinggi pipa diatur secara acak
        let randomHeight = Math.random() * (gameHeight - pipeGap - 100) + 50;
        let pipeLeft = gameWidth; // Mulai di sisi kanan container

        // Pipa Atas
        const topPipe = document.createElement('div');
        topPipe.classList.add('pipe', 'top-pipe');
        topPipe.style.height = randomHeight + 'px';
        topPipe.style.left = pipeLeft + 'px';
        gameContainer.appendChild(topPipe);

        // Pipa Bawah
        const bottomPipe = document.createElement('div');
        bottomPipe.classList.add('pipe', 'bottom-pipe');
        bottomPipe.style.height = (gameHeight - randomHeight - pipeGap) + 'px';
        bottomPipe.style.left = pipeLeft + 'px';
        bottomPipe.style.bottom = 0 + 'px'; // Pipa bawah menempel di dasar
        gameContainer.appendChild(bottomPipe);

        // Logika pergerakan pipa
        function movePipe() {
            if (isGameOver) {
                clearInterval(pipeTimerId);
                return;
            }
            
            pipeLeft -= 2; // Kecepatan pergerakan pipa
            topPipe.style.left = pipeLeft + 'px';
            bottomPipe.style.left = pipeLeft + 'px';

            // Menghapus pipa setelah keluar layar
            if (pipeLeft < -pipeWidth) {
                clearInterval(pipeTimerId);
                gameContainer.removeChild(topPipe);
                gameContainer.removeChild(bottomPipe);
                score++;
                scoreDisplay.innerHTML = `Skor: ${score}`;
            }

            // Deteksi tabrakan
            if (
                pipeLeft > birdLeft && pipeLeft < birdLeft + 40 && 
                (birdBottom < bottomPipe.offsetHeight || birdBottom > gameHeight - topPipe.offsetHeight - 30)
            ) {
                gameOver();
            }
        }

        let pipeTimerId = setInterval(movePipe, 20);
    }

    // Mulai membuat pipa secara berulang
    let pipeGeneratorId = setInterval(generatePipes, pipeInterval);


    // --- GAME OVER ---

    function gameOver() {
        clearInterval(gameTimerId);
        clearInterval(pipeGeneratorId);
        isGameOver = true;
        
        // Opsional: Hapus event listener agar game tidak bisa di-restart otomatis
        document.removeEventListener('keydown', jump);
        gameContainer.removeEventListener('click', jump);

        // Memberi pesan Game Over
        const gameOverMsg = document.createElement('div');
        gameOverMsg.innerHTML = `GAME OVER! Skor Akhir: ${score}`;
        gameOverMsg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-size: 30px;
            text-align: center;
            z-index: 30;
        `;
        gameContainer.appendChild(gameOverMsg);
    }
});