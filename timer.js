document.addEventListener('DOMContentLoaded', function() {
    // Timer variables
    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let totalTime = 25 * 60;
    let isRunning = false;
    let isStudyMode = true;
    let todayStudyTime = 0;
    let weekStudyTime = 0;
    let sessionsCount = 0;
    
    // DOM Elements
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const soundToggle = document.getElementById('soundToggle');
    const alarmBtn = document.getElementById('alarmBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettings = document.getElementById('saveSettings');
    const studyTimeSlider = document.getElementById('studyTime');
    const breakTimeSlider = document.getElementById('breakTime');
    const studyTimeValue = document.getElementById('studyTimeValue');
    const breakTimeValue = document.getElementById('breakTimeValue');
    const alarmSoundElement = document.getElementById('alarmSound');
    const todayTimeElement = document.getElementById('todayTime');
    const weekTimeElement = document.getElementById('weekTime');
    const sessionsCountElement = document.getElementById('sessionsCount');
    const usernameDisplay = document.getElementById('usernameDisplay');
    
    // Get username from session storage
    const username = sessionStorage.getItem('kawaiiTimerUsername') || 'Student';
    usernameDisplay.textContent = username;
    
    // Initialize stats from localStorage
    loadStats();
    
    // Update the timer display
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
        
        // Update progress ring
        const progressRing = document.querySelector('.progress-ring-circle');
        const circumference = 2 * Math.PI * 138;
        const offset = circumference - (timeLeft / totalTime) * circumference;
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        progressRing.style.strokeDashoffset = offset;
        
        // Change circle color based on mode
        if (isStudyMode) {
            progressRing.style.stroke = '#ff85a2';
        } else {
            progressRing.style.stroke = '#85d7ff';
        }
        
        // Update page title
        const modeText = isStudyMode ? 'Study' : 'Break';
        document.title = `${minutes}:${seconds.toString().padStart(2, '0')} - ${modeText} | Kawaii Timer`;
    }
    
    // Start the timer
    function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                
                // Play alarm sound
                playAlarm();
                
                // Update stats
                if (isStudyMode) {
                    sessionsCount++;
                    todayStudyTime += totalTime / 60; // Add minutes
                    weekStudyTime += totalTime / 60;
                    updateStats();
                    saveStats();
                }
                
                // Switch mode
                isStudyMode = !isStudyMode;
                updateModeDisplay();
                
                // Set next timer based on mode
                if (isStudyMode) {
                    timeLeft = parseInt(studyTimeSlider.value) * 60;
                    totalTime = timeLeft;
                } else {
                    timeLeft = parseInt(breakTimeSlider.value) * 60;
                    totalTime = timeLeft;
                }
                
                // Show notification
                const modeText = isStudyMode ? 'Study' : 'Break';
                showNotification(`${isStudyMode ? 'Break' : 'Study'} time is over! Time to ${modeText.toLowerCase()}!`);
                
                updateDisplay();
            }
        }, 1000);
    }
    
    // Pause the timer
    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
    
    // Reset the timer
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        if (isStudyMode) {
            timeLeft = parseInt(studyTimeSlider.value) * 60;
            totalTime = timeLeft;
        } else {
            timeLeft = parseInt(breakTimeSlider.value) * 60;
            totalTime = timeLeft;
        }
        
        updateDisplay();
    }
    
    // Play alarm sound
    function playAlarm() {
        if (soundToggle.classList.contains('sound-on')) {
            alarmSoundElement.currentTime = 0;
            alarmSoundElement.play().catch(e => console.log("Audio play failed:", e));
        }
    }
    
    // Show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-bell"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ffebf3;
            border: 3px solid #ff85a2;
            color: #ff66a3;
            padding: 20px;
            border-radius: 15px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 10px 25px rgba(255, 133, 162, 0.3);
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 300px;
            animation: slideIn 0.5s ease-out;
        `;
        
        // Add keyframes for animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 500);
        }, 5000);
    }
    
    // Update mode display
    function updateModeDisplay() {
        modeButtons.forEach(btn => {
            if (btn.dataset.mode === (isStudyMode ? 'study' : 'break')) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        const timeLabel = document.querySelector('.time-label');
        timeLabel.textContent = isStudyMode ? 'STUDY TIME' : 'BREAK TIME';
        
        // Change timer card color slightly based on mode
        const timerCard = document.querySelector('.timer-card');
        if (isStudyMode) {
            timerCard.style.borderColor = '#ffd1dc';
        } else {
            timerCard.style.borderColor = '#b3e0ff';
        }
    }
    
    // Update stats display
    function updateStats() {
        todayTimeElement.textContent = `${Math.floor(todayStudyTime)} min`;
        weekTimeElement.textContent = `${Math.floor(weekStudyTime)} min`;
        sessionsCountElement.textContent = sessionsCount;
    }
    
    // Load stats from localStorage
    function loadStats() {
        const savedStats = localStorage.getItem('kawaiiTimerStats');
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            todayStudyTime = stats.todayStudyTime || 0;
            weekStudyTime = stats.weekStudyTime || 0;
            sessionsCount = stats.sessionsCount || 0;
        }
        updateStats();
    }
    
    // Save stats to localStorage
    function saveStats() {
        const stats = {
            todayStudyTime,
            weekStudyTime,
            sessionsCount,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('kawaiiTimerStats', JSON.stringify(stats));
    }
    
    // Event Listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // Preset buttons
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const minutes = parseInt(this.dataset.minutes);
            timeLeft = minutes * 60;
            totalTime = timeLeft;
            
            // If switching to break time, change mode
            if (minutes <= 10 && minutes !== 25) {
                isStudyMode = false;
                updateModeDisplay();
            } else {
                isStudyMode = true;
                updateModeDisplay();
            }
            
            updateDisplay();
            
            // Show notification
            const modeText = isStudyMode ? 'Study' : 'Break';
            showNotification(`Timer set to ${minutes} min ${modeText.toLowerCase()}!`);
        });
    });
    
    // Mode buttons
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mode = this.dataset.mode;
            isStudyMode = mode === 'study';
            
            // Update timer based on mode
            if (isStudyMode) {
                timeLeft = parseInt(studyTimeSlider.value) * 60;
                totalTime = timeLeft;
            } else {
                timeLeft = parseInt(breakTimeSlider.value) * 60;
                totalTime = timeLeft;
            }
            
            updateModeDisplay();
            updateDisplay();
            
            // Show notification
            const modeText = isStudyMode ? 'Study' : 'Break';
            showNotification(`Switched to ${modeText} mode!`);
        });
    });
    
    // Sound toggle
    soundToggle.addEventListener('click', function() {
        if (this.classList.contains('sound-on')) {
            this.classList.remove('sound-on');
            this.classList.add('sound-off');
            this.innerHTML = '<i class="fas fa-volume-mute"></i> Sound Off';
        } else {
            this.classList.remove('sound-off');
            this.classList.add('sound-on');
            this.innerHTML = '<i class="fas fa-volume-up"></i> Sound On';
        }
    });
    
    // Alarm button
    alarmBtn.addEventListener('click', function() {
        playAlarm();
        showNotification('Alarm sound played!');
    });
    
    // Logout button
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('kawaiiTimerUsername');
        window.location.href = 'index.html';
    });
    
    // Settings button
    settingsBtn.addEventListener('click', function() {
        settingsModal.style.display = 'flex';
    });
    
    // Close settings
    closeSettings.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });
    
    // Save settings
    saveSettings.addEventListener('click', function() {
        // Update timer values
        if (isStudyMode) {
            timeLeft = parseInt(studyTimeSlider.value) * 60;
            totalTime = timeLeft;
        } else {
            timeLeft = parseInt(breakTimeSlider.value) * 60;
            totalTime = timeLeft;
        }
        
        updateDisplay();
        settingsModal.style.display = 'none';
        showNotification('Settings saved successfully!');
    });
    
    // Update slider values display
    studyTimeSlider.addEventListener('input', function() {
        studyTimeValue.textContent = this.value;
    });
    
    breakTimeSlider.addEventListener('input', function() {
        breakTimeValue.textContent = this.value;
    });
    
    // Task list functionality
    const taskCheckboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.textDecoration = 'line-through';
                label.style.color = '#9d7b9f';
                
                // Show cute message
                if (Math.random() > 0.5) {
                    showNotification('Great job completing a task! 🎉');
                }
            } else {
                label.style.textDecoration = 'none';
                label.style.color = '#5a3d5c';
            }
        });
    });
    
    // Add task functionality
    const addTaskInput = document.querySelector('.add-task input');
    const addTaskButton = document.querySelector('.add-task button');
    
    addTaskButton.addEventListener('click', function() {
        const taskText = addTaskInput.value.trim();
        if (taskText) {
            const tasksList = document.querySelector('.tasks-list');
            const newTaskId = `task${tasksList.children.length + 1}`;
            
            const newTask = document.createElement('div');
            newTask.className = 'task-item';
            newTask.innerHTML = `
                <input type="checkbox" id="${newTaskId}">
                <label for="${newTaskId}">${taskText}</label>
            `;
            
            tasksList.appendChild(newTask);
            addTaskInput.value = '';
            
            // Add event listener to new checkbox
            newTask.querySelector('input').addEventListener('change', function() {
                const label = this.nextElementSibling;
                if (this.checked) {
                    label.style.textDecoration = 'line-through';
                    label.style.color = '#9d7b9f';
                } else {
                    label.style.textDecoration = 'none';
                    label.style.color = '#5a3d5c';
                }
            });
            
            showNotification('Task added successfully!');
        }
    });
    
    // Initialize
    updateDisplay();
    updateModeDisplay();
    soundToggle.classList.add('sound-on');
    
    // Add cute hover effects
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-3px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add some random cute effects to the page
    setInterval(() => {
        const emojis = ['🌸', '✨', '🎀', '🍥', '📚', '✏️', '⏰', '📖'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Occasionally add a floating emoji
        if (Math.random() > 0.9) {
            const floatingEmoji = document.createElement('div');
            floatingEmoji.textContent = randomEmoji;
            floatingEmoji.style.cssText = `
                position: fixed;
                font-size: 2rem;
                z-index: 100;
                pointer-events: none;
                animation: floatUp 3s ease-in forwards;
                left: ${Math.random() * 90 + 5}vw;
            `;
            
            document.body.appendChild(floatingEmoji);
            
            // Add keyframes for floating animation
            const floatStyle = document.createElement('style');
            if (!document.querySelector('#floatAnimation')) {
                floatStyle.id = 'floatAnimation';
                floatStyle.textContent = `
                    @keyframes floatUp {
                        0% { bottom: -50px; opacity: 1; }
                        100% { bottom: 100vh; opacity: 0; }
                    }
                `;
                document.head.appendChild(floatStyle);
            }
            
            // Remove after animation
            setTimeout(() => {
                if (floatingEmoji.parentNode) {
                    floatingEmoji.remove();
                }
            }, 3000);
        }
    }, 5000);
});

// ===== PROFILE CUSTOMIZATION =====
let profileColor = '#ff85a2';
let avatarIcon = 'fa-user-graduate';

// Profile Modal Elements
const profileModal = document.getElementById('profileModal');
const profileUsername = document.getElementById('profileUsername');
const userStatus = document.getElementById('userStatus');
const avatarOptions = document.querySelectorAll('.avatar-option');
const colorOptions = document.querySelectorAll('.color-option');
const avatarPreview = document.getElementById('avatarPreview');
const avatarIconElement = document.getElementById('avatarIcon');
const previewUsername = document.getElementById('previewUsername');
const previewStatus = document.getElementById('previewStatus');
const saveProfileBtn = document.getElementById('saveProfile');
const closeProfileBtn = document.getElementById('closeProfile');

// Load saved profile
function loadProfile() {
    const savedProfile = localStorage.getItem('kawaiiTimerProfile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        
        // Update profile
        if (profile.username) {
            usernameDisplay.textContent = profile.username;
            previewUsername.textContent = profile.username;
        }
        if (profile.status) {
            previewStatus.textContent = profile.status;
        }
        if (profile.avatarIcon) {
            avatarIcon = profile.avatarIcon;
            avatarIconElement.className = `fas ${avatarIcon}`;
            
            // Update avatar options
            avatarOptions.forEach(option => {
                if (option.dataset.icon === avatarIcon) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }
        if (profile.color) {
            profileColor = profile.color;
            updateThemeColor(profileColor);
            
            // Update color options
            colorOptions.forEach(option => {
                if (option.dataset.color === profileColor) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }
    }
}

// Update theme color
function updateThemeColor(color) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', color);
    
    // Update user avatar
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        userAvatar.style.background = `linear-gradient(to bottom right, ${color}, ${darkenColor(color, 20)})`;
    }
    
    // Update progress ring
    const progressRing = document.querySelector('.progress-ring-circle');
    if (progressRing && isStudyMode) {
        progressRing.style.stroke = color;
    }
    
    // Update buttons with primary color
    const primaryButtons = document.querySelectorAll('#startBtn, .btn-control:first-child');
    primaryButtons.forEach(btn => {
        btn.style.background = `linear-gradient(to right, ${color}, ${darkenColor(color, 10)})`;
    });
}

// Helper function to darken color
function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// ===== TASK MANAGEMENT =====
let tasks = [
    { id: 1, text: 'Math homework', completed: false },
    { id: 2, text: 'English essay', completed: false },
    { id: 3, text: 'Science project', completed: false },
    { id: 4, text: 'History reading', completed: false }
];

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('kawaiiTimerTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('kawaiiTimerTasks', JSON.stringify(tasks));
}

// Render tasks to the DOM
function renderTasks() {
    const tasksList = document.querySelector('.tasks-list');
    if (!tasksList) return;
    
    tasksList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <div class="task-content">
                <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                <label for="task-${task.id}">${task.text}</label>
            </div>
            <div class="task-actions">
                <button class="task-btn edit-task" data-id="${task.id}" title="Edit task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-btn delete-task" data-id="${task.id}" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        tasksList.appendChild(taskItem);
    });
    
    // Add event listeners to new task elements
    addTaskEventListeners();
}

// Add event listeners to task elements
function addTaskEventListeners() {
    // Task checkboxes
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskId = parseInt(this.id.split('-')[1]);
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = this.checked;
                saveTasks();
                
                const label = this.nextElementSibling;
                if (this.checked) {
                    label.style.textDecoration = 'line-through';
                    label.style.color = '#9d7b9f';
                    
                    // Show celebration occasionally
                    if (Math.random() > 0.7) {
                        showNotification('Great job completing a task! 🎉');
                        createCelebration();
                    }
                } else {
                    label.style.textDecoration = 'none';
                    label.style.color = '#5a3d5c';
                }
            }
        });
    });
    
    // Edit task buttons
    document.querySelectorAll('.edit-task').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = parseInt(this.dataset.id);
            editTask(taskId);
        });
    });
    
    // Delete task buttons
    document.querySelectorAll('.delete-task').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = parseInt(this.dataset.id);
            deleteTask(taskId);
        });
    });
}

// Edit a task
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newText = prompt('Edit your task:', task.text);
    if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
        showNotification('Task updated! ✏️');
    }
}

// Delete a task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
        showNotification('Task deleted! 🗑️');
    }
}

// Add new task
function addNewTask(taskText) {
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    tasks.push({
        id: newId,
        text: taskText,
        completed: false
    });
    saveTasks();
    renderTasks();
    showNotification('New task added! 📝');
}

// Create celebration effect
function createCelebration() {
    const emojis = ['🎉', '✨', '🌟', '🥳', '🎊', '💫', '🌸', '💖'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.cssText = `
                position: fixed;
                font-size: ${Math.random() * 25 + 15}px;
                z-index: 10000;
                pointer-events: none;
                left: ${Math.random() * 100}vw;
                top: -50px;
                animation: confettiFall ${Math.random() * 2 + 1}s ease-in forwards;
            `;
            
            document.body.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, 2000);
        }, i * 100);
    }
    
    // Add confetti animation
    if (!document.querySelector('#confettiAnimation')) {
        const style = document.createElement('style');
        style.id = 'confettiAnimation';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== EVENT LISTENERS =====

// Add to your existing event listeners section:

// Profile button (add this to header controls in timer.html)
const profileBtn = document.getElementById('profileBtn');
if (profileBtn) {
    profileBtn.addEventListener('click', function() {
        // Populate profile modal with current data
        profileUsername.value = usernameDisplay.textContent;
        userStatus.value = previewStatus.textContent;
        profileModal.style.display = 'flex';
    });
}

// Avatar options
avatarOptions.forEach(option => {
    option.addEventListener('click', function() {
        avatarOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        const iconClass = this.dataset.icon;
        avatarIconElement.className = `fas ${iconClass}`;
    });
});

// Color options
colorOptions.forEach(option => {
    option.addEventListener('click', function() {
        colorOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        const color = this.dataset.color;
        avatarPreview.style.background = `linear-gradient(to bottom right, ${color}, ${darkenColor(color, 20)})`;
    });
});

// Save profile
saveProfileBtn.addEventListener('click', function() {
    const newUsername = profileUsername.value.trim();
    const newStatus = userStatus.value.trim();
    
    if (newUsername) {
        usernameDisplay.textContent = newUsername;
        previewUsername.textContent = newUsername;
    }
    
    if (newStatus) {
        previewStatus.textContent = newStatus;
    }
    
    // Get selected avatar and color
    const selectedAvatar = document.querySelector('.avatar-option.active');
    const selectedColor = document.querySelector('.color-option.active');
    
    if (selectedAvatar) {
        avatarIcon = selectedAvatar.dataset.icon;
    }
    
    if (selectedColor) {
        profileColor = selectedColor.dataset.color;
        updateThemeColor(profileColor);
    }
    
    // Save to localStorage
    const profile = {
        username: newUsername || usernameDisplay.textContent,
        status: newStatus || previewStatus.textContent,
        avatarIcon: avatarIcon,
        color: profileColor,
        updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('kawaiiTimerProfile', JSON.stringify(profile));
    
    profileModal.style.display = 'none';
    showNotification('Profile saved successfully! 💾');
});

// Close profile modal
closeProfileBtn.addEventListener('click', function() {
    profileModal.style.display = 'none';
});

// Updated add task button event listener
const addTaskButton = document.querySelector('.add-task button');
const addTaskInput = document.querySelector('.add-task input');

if (addTaskButton && addTaskInput) {
    addTaskButton.addEventListener('click', function() {
        const taskText = addTaskInput.value.trim();
        if (taskText) {
            addNewTask(taskText);
            addTaskInput.value = '';
        }
    });
    
    // Allow pressing Enter to add task
    addTaskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const taskText = addTaskInput.value.trim();
            if (taskText) {
                addNewTask(taskText);
                addTaskInput.value = '';
            }
        }
    });
}

// ===== INITIALIZATION =====
// Add to your existing initialization section:

// Initialize profile
loadProfile();

// Initialize tasks
loadTasks();

// Add CSS variable for theme color
document.documentElement.style.setProperty('--primary-color', profileColor);