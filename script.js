let mediaRecorder;
let audioChunks = [];
const recordingsList = document.getElementById("recordingsList");

document.getElementById("startRecord").addEventListener("click", async () => {
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        audioChunks = [];
        saveRecording(audioBlob);
    };

    mediaRecorder.start();
    document.getElementById("startRecord").disabled = true;
    document.getElementById("stopRecord").disabled = false;
});

document.getElementById("stopRecord").addEventListener("click", () => {
    mediaRecorder.stop();
    document.getElementById("startRecord").disabled = false;
    document.getElementById("stopRecord").disabled = true;
});

function saveRecording(blob) {
    const url = URL.createObjectURL(blob); // ایجاد URL برای Blob
    const li = document.createElement("li");

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = url; // قرار دادن URL برای پخش

    // ایجاد دکمه دانلود
    const downloadBtn = document.createElement("a");
    downloadBtn.textContent = "⬇️ دانلود";  // متن دکمه دانلود
    downloadBtn.href = url;  // لینک به فایل ضبط‌شده
    downloadBtn.download = "recording.wav";  // نام پیش‌فرض فایل هنگام دانلود

    // ایجاد دکمه حذف
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌ حذف";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => {
        li.remove();  // حذف ضبط از لیست
    };

    // اضافه کردن اجزا به لیست
    li.appendChild(audio);
    li.appendChild(downloadBtn);  // اضافه کردن دکمه دانلود
    li.appendChild(deleteBtn);  // اضافه کردن دکمه حذف
    recordingsList.appendChild(li);  // اضافه کردن به لیست ضبط‌ها
}

// پخش فایل صوتی از حافظه
document.getElementById("audioFile").addEventListener("change", (event) => {
    const file = event.target.files[0];
    const audioPlayer = document.getElementById("audioPlayer");

    if (file) {
        const audioURL = URL.createObjectURL(file);
        audioPlayer.src = audioURL; // لینک به فایل انتخاب شده
        audioPlayer.play(); // شروع به پخش
    }
});

// پخش ویدیو از URL
document.getElementById("playVideoBtn").addEventListener("click", () => {
    const videoURL = document.getElementById("videoURL").value;
    const videoPlayer = document.getElementById("videoPlayer");

    if (videoURL) {
        videoPlayer.style.display = "block";  // نمایش پخش‌کننده ویدیو
        videoPlayer.src = videoURL; // تنظیم URL ویدیو
        videoPlayer.play(); // پخش ویدیو
    } else {
        alert("لطفاً یک URL ویدیو وارد کنید.");
    }
});

// رفتن به فول‌اسکرین
document.getElementById("fullscreenBtn").addEventListener("click", () => {
    const videoPlayer = document.getElementById("videoPlayer");

    if (videoPlayer.requestFullscreen) {
        videoPlayer.requestFullscreen();
    } else if (videoPlayer.mozRequestFullScreen) { // Firefox
        videoPlayer.mozRequestFullScreen();
    } else if (videoPlayer.webkitRequestFullscreen) { // Chrome, Safari
        videoPlayer.webkitRequestFullscreen();
    } else if (videoPlayer.msRequestFullscreen) { // IE/Edge
        videoPlayer.msRequestFullscreen();
    }
});

// جلو به جلو 3 دقیقه
document.getElementById("skipForwardBtn").addEventListener("click", () => {
    const videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.currentTime += 180;  // 180 ثانیه = 3 دقیقه
});

// عقب به عقب 3 دقیقه
document.getElementById("skipBackwardBtn").addEventListener("click", () => {
    const videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.currentTime -= 180;  // 180 ثانیه = 3 دقیقه
});