// ساعت محلی و ساعت نیویورک
function updateTime() {
    const now = new Date();
    document.getElementById('localTime').innerText = now.toLocaleTimeString();

    const newYorkOffset = -5; // ساعت نیویورک در زمستان
    const newYorkTime = new Date(now.getTime() + (newYorkOffset + now.getTimezoneOffset() / 60) * 60 * 60 * 1000);
    document.getElementById('newYorkTime').innerText = newYorkTime.toLocaleTimeString();
}

setInterval(updateTime, 1000);

// قسمت To-Do List
document.getElementById('addTodo').addEventListener('click', () => {
    const todoInput = document.getElementById('todoInput');
    const todoText = todoInput.value.trim();
    
    if (todoText) {
        const todoList = document.getElementById('todoItems');
        const li = document.createElement('li');
        li.textContent = todoText;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'حذف';
        deleteBtn.addEventListener('click', () => {
            todoList.removeChild(li);
        });

        li.appendChild(deleteBtn);
        todoList.appendChild(li);
        todoInput.value = ''; // پاک کردن ورودی بعد از اضافه کردن
    }
});

// ضبط صدا
let mediaRecorder;
let audioChunks = [];
let audioBlob;

document.getElementById('recordBtn').addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
    });

    document.getElementById('stopBtn').disabled = false;
    document.getElementById('recordBtn').disabled = true;
});

document.getElementById('stopBtn').addEventListener('click', () => {
    mediaRecorder.stop();
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('playBtn').disabled = false;
    document.getElementById('deleteBtn').disabled = false;

    mediaRecorder.addEventListener("stop", () => {
        audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        document.getElementById('audioPlayback').src = audioUrl;
        
        // تنظیم دکمه دانلود
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.href = audioUrl;
        downloadBtn.download = 'recording.wav'; // نام فایل دانلود
        downloadBtn.innerText = 'دانلود';
        downloadBtn.style.display = 'inline'; // نمایش دکمه دانلود
        
        audioChunks = [];
    });
});

// دکمه پخش
document.getElementById('playBtn').addEventListener('click', () => {
    if (audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);
        document.getElementById('audioPlayback').src = audioUrl;
        document.getElementById('audioPlayback').play();
    }
});

// دکمه حذف
document.getElementById('deleteBtn').addEventListener('click', () => {
    document.getElementById('audioPlayback').src = '';
    document.getElementById('playBtn').disabled = true;
    document.getElementById('deleteBtn').disabled = true;
    document.getElementById('downloadBtn').style.display = 'none'; // پنهان کردن دکمه دانلود
    audioBlob = null;
});

// پخش موزیک
document.getElementById('musicFile').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        document.getElementById('musicPlayback').src = url;
        document.getElementById('musicPlayback').play();
    }
});

// ویدیو پلیر
document.getElementById('loadVideo').addEventListener('click', () => {
    const url = document.getElementById('videoUrl').value;
    const video = document.getElementById('videoPlayback');
    
    // تنظیم منبع ویدیو
    video.src = url;
    video.load(); // بارگذاری ویدیو
    video.play(); // پخش ویدیو
});

// دکمه‌های پخش جلو و عقب
document.getElementById('playBack').addEventListener('click', () => {
    const video = document.getElementById('videoPlayback');
    video.currentTime = Math.max(0, video.currentTime - 60); // 1 دقیقه عقب
});

document.getElementById('playForward').addEventListener('click', () => {
    const video = document.getElementById('videoPlayback');
    video.currentTime = Math.min(video.duration, video.currentTime + 60); // 1 دقیقه جلو
});

// دکمه فول اسکرین
document.getElementById('fullScreen').addEventListener('click', () => {
    const video = document.getElementById('videoPlayback');
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.mozRequestFullScreen) { // Firefox
        video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) { // Chrome, Safari and Opera
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { // IE/Edge
        video.msRequestFullscreen();
    }
});

// قیمت ارز داوجونز و انس جهانی
async function fetchMarketPrices() {
    const prices = `
        <p>داوجونز: 34,000</p>
        <p>انس جهانی: 1,900</p>
    `;
    document.getElementById('marketPrices').innerHTML = prices;
}

fetchMarketPrices();

// تایمر زنگ
let alarmTimeout; // متغیر برای ذخیره تایمر

document.getElementById('setAlarm').addEventListener('click', () => {
    const alarmTime = document.getElementById('alarmTime').value;
    const [hours, minutes] = alarmTime.split(':');
    const now = new Date();
    const alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

    const timeToAlarm = alarmDate.getTime() - now.getTime();
    if (timeToAlarm >= 0) {
        alarmTimeout = setTimeout(() => {
            document.getElementById('alarmStatus').innerText = "زنگ به صدا درآمد!";
            new Audio('alarm-sound.mp3').play(); // صدای زنگ
        }, timeToAlarm);
    } else {
        alert('زمان زنگ باید در آینده باشد.');
    }
});

// حذف تایمر
document.getElementById('clearAlarm').addEventListener('click', () => {
    clearTimeout(alarmTimeout);
    document.getElementById('alarmStatus').innerText = "تایمر حذف شد.";
});
