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
document.getElementById('addTodo').addEventListener('click', addTodo);

function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const todoText = todoInput.value.trim();
    
    if (todoText) {
        const todoList = document.getElementById('todoItems');
        const li = document.createElement('li');
        li.textContent = todoText;

        const deleteBtn = createDeleteButton(li);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
        todoInput.value = ''; // پاک کردن ورودی بعد از اضافه کردن
    } else {
        alert('لطفاً یک کار وارد کنید.');
    }
}

function createDeleteButton(li) {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'حذف';
    deleteBtn.addEventListener('click', () => {
        li.remove();
    });
    return deleteBtn;
}

// تنظیم نوتیفیکیشن
document.getElementById('setNotification').addEventListener('click', setNotification);

function setNotification() {
    const notificationText = document.getElementById('notificationText').value;
    const notificationTime = new Date(document.getElementById('notificationTime').value);
    
    const now = new Date();
    const timeToNotification = notificationTime - now;
    
    if (timeToNotification >= 0) {
        setTimeout(() => {
            alert(notificationText);
        }, timeToNotification);
    } else {
        alert('زمان یادآوری باید در آینده باشد.');
    }
}

// ضبط صدا
let mediaRecorder;
let audioChunks = [];

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
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        document.getElementById('audioPlayback').src = audioUrl;
        
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.href = audioUrl;
        downloadBtn.download = 'recording.wav'; 
        downloadBtn.innerText = 'دانلود';
        downloadBtn.style.display = 'inline';
        
        audioChunks = [];
    });
});

// دکمه پخش
document.getElementById('playBtn').addEventListener('click', () => {
    const audioPlayback = document.getElementById('audioPlayback');
    if (audioPlayback.src) {
        audioPlayback.play();
    }
});

// دکمه حذف
document.getElementById('deleteBtn').addEventListener('click', () => {
    document.getElementById('audioPlayback').src = '';
    document.getElementById('playBtn').disabled = true;
    document.getElementById('deleteBtn').disabled = true;
    document.getElementById('downloadBtn').style.display = 'none';
});

// پخش موزیک
document.getElementById('musicFile').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        document.getElementById('musicPlayback').src = url;
        document.getElementById('musicPlayback').play();
    } else {
        alert('لطفاً یک فایل معتبر انتخاب کنید.');
    }
});

// ویدیو پلیر
document.getElementById('loadVideo').addEventListener('click', loadVideo);

function loadVideo() {
    const url = document.getElementById('videoUrl').value.trim();
    if (!url) {
        alert('لطفاً یک آدرس ویدیو معتبر وارد کنید.');
        return;
    }
    
    const video = document.getElementById('videoPlayback');
    video.src = url;
    video.load(); 
    video.play(); 
}

// دکمه‌های پخش جلو و عقب
document.getElementById('playBack').addEventListener('click', () => {
    const video = document.getElementById('videoPlayback');
    video.currentTime = Math.max(0, video.currentTime - 60); 
});

document.getElementById('playForward').addEventListener('click', () => {
    const video = document.getElementById('videoPlayback');
    video.currentTime = Math.min(video.duration, video.currentTime + 60); 
});

// دکمه فول اسکرین
document.getElementById('fullScreen').addEventListener('click', () => {
    const video = document.getElementById('videoPlayback');
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
    }
});

// تنظیم چندین تایمر
document.getElementById('setTimer').addEventListener('click', setTimer);

function setTimer() {
    const timerInput = document.getElementById('timerInput').value;
    const timerList = document.getElementById('timerList');
    const li = document.createElement('li');
    li.textContent = `تایمر تنظیم شده: ${timerInput}`;

    const timerDuration = new Date();
    const [hours, minutes] = timerInput.split(':');
    timerDuration.setHours(hours);
    timerDuration.setMinutes(minutes);
    const timeToTimer = timerDuration.getTime() - Date.now();

    if (timeToTimer >= 0) {
        const timeoutId = setTimeout(() => {
            alert(`تایمر ${timerInput} به پایان رسید!`);
            const alarmSound = document.getElementById('alarmSound');
            alarmSound.currentTime = 0;
            alarmSound.play();
            timerList.removeChild(li);
        }, timeToTimer);

        const deleteBtn = createDeleteButton(li, timeoutId);
        li.appendChild(deleteBtn);
        timerList.appendChild(li);
    } else {
        alert('زمان تایمر باید در آینده باشد.');
    }
}

// دکمه حذف برای تایمر
function createDeleteButton(li, timeoutId) {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'حذف';
    deleteBtn.addEventListener('click', () => {
        clearTimeout(timeoutId);
        li.remove();
    });
    return deleteBtn;
}

// نمایش تاریخ انتخاب شده
document.getElementById('showDate').addEventListener('click', () => {
    const selectedDate = document.getElementById('calendarDate').value;
    const gregorianDate = new Date(selectedDate);
    const persianDate = gregorianToJalali(gregorianDate);
    document.getElementById('selectedDate').innerText = `تاریخ انتخاب شده: ${persianDate}`;
});

// تبدیل تاریخ گریگوری به تاریخ هجری شمسی
function gregorianToJalali(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`; // این تبدیل واقعی نیست، برای مثال است
}
