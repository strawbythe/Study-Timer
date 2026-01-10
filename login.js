document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    
    // Demo credentials
    const demoUsername = 'student';
    const demoPassword = 'study123';
    
    // Check if credentials are saved in localStorage
    const savedUsername = localStorage.getItem('kawaiiTimerUsername');
    const savedPassword = localStorage.getItem('kawaiiTimerPassword');
    
    if (savedUsername && savedPassword) {
        usernameInput.value = savedUsername;
        passwordInput.value = atob(savedPassword); // Decode from base64
        rememberCheckbox.checked = true;
    }
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const remember = rememberCheckbox.checked;
        
        // Simple validation
        if (!username) {
            showMessage('Please enter your username!', 'error');
            usernameInput.focus();
            return;
        }
        
        if (!password) {
            showMessage('Please enter your password!', 'error');
            passwordInput.focus();
            return;
        }
        
        // Check credentials
        if (username === demoUsername && password === demoPassword) {
            // Save credentials if "Remember me" is checked
            if (remember) {
                localStorage.setItem('kawaiiTimerUsername', username);
                // Store password in base64 for basic obfuscation (not secure for production)
                localStorage.setItem('kawaiiTimerPassword', btoa(password));
            } else {
                localStorage.removeItem('kawaiiTimerUsername');
                localStorage.removeItem('kawaiiTimerPassword');
            }
            
            // Save username for the timer page
            sessionStorage.setItem('kawaiiTimerUsername', username);
            sessionStorage.setItem('kawaiiTimerLastLogin', new Date().toISOString());
            
            // Show success message and redirect
            showMessage('Login successful! Redirecting... ✨', 'success');
            
            // Add cute success animation
            loginForm.classList.add('success-animation');
            
            // Redirect to timer page after a short delay
            setTimeout(() => {
                window.location.href = 'timer.html';
            }, 1500);
        } else {
            // Show error with cute animation
            loginForm.classList.add('error-animation');
            setTimeout(() => {
                loginForm.classList.remove('error-animation');
            }, 500);
            
            showMessage('Invalid username or password. Hint: student / study123', 'error');
            
            // Clear password field for security
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
    
    // Forgot password link
    const forgotLink = document.querySelector('.forgot-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            showMessage('Hint: Demo credentials are:<br><strong>Username: student</strong><br><strong>Password: study123</strong>', 'info');
        });
    }
    
    // Signup link
    const signupLink = document.querySelector('.signup-link');
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            showMessage('✨ Signup feature coming soon! ✨<br>For now, use the demo credentials.', 'info');
        });
    }
    
    // Function to show messages
    function showMessage(text, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.message-popup');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const message = document.createElement('div');
        message.className = `message-popup ${type}`;
        message.innerHTML = `
            <div class="message-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${text}</span>
            </div>
        `;
        
        // Find where to add the message
        const loginCard = document.querySelector('.login-card');
        if (!loginCard) {
            console.error('Login card not found!');
            return;
        }
        
        // Add to page
        loginCard.appendChild(message);
        
        // Style the message
        const colorMap = {
            'error': { bg: '#ffe6e6', border: '#ff9999', text: '#cc0000' },
            'success': { bg: '#e6ffe6', border: '#99ff99', text: '#009900' },
            'info': { bg: '#e6f2ff', border: '#99ccff', text: '#0066cc' }
        };
        
        const colors = colorMap[type] || colorMap.info;
        
        message.style.cssText = `
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors.bg};
            border: 2px solid ${colors.border};
            color: ${colors.text};
            padding: 15px 25px;
            border-radius: 15px;
            font-weight: 600;
            z-index: 100;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 90%;
            text-align: left;
            animation: slideDown 0.3s ease-out;
        `;
        
        // Add keyframes for animation
        if (!document.querySelector('#slideDownAnimation')) {
            const style = document.createElement('style');
            style.id = 'slideDownAnimation';
            style.textContent = `
                @keyframes slideDown {
                    from { top: -100px; opacity: 0; }
                    to { top: 20px; opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.style.animation = 'slideUp 0.3s ease-out';
                setTimeout(() => {
                    if (message.parentNode) {
                        message.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Add keyframes for slideUp animation
    if (!document.querySelector('#slideUpAnimation')) {
        const style = document.createElement('style');
        style.id = 'slideUpAnimation';
        style.textContent = `
            @keyframes slideUp {
                from { top: 20px; opacity: 1; }
                to { top: -100px; opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add cute hover effect to inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-5px)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
    
    // Add animation to login button
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('mouseenter', function() {
            this.innerHTML = '<i class="fas fa-sign-in-alt"></i> Let\'s Study! ✨';
        });
        
        loginBtn.addEventListener('mouseleave', function() {
            this.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Timer';
        });
        
        // Add click effect
        loginBtn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        loginBtn.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Add animations to CSS
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        @keyframes successShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .success-animation {
            animation: successShake 0.5s ease;
        }
        
        .error-animation {
            animation: errorShake 0.5s ease;
        }
        
        .btn:active {
            transform: scale(0.98) !important;
        }
    `;
    document.head.appendChild(animationStyles);
    
    // Add password visibility toggle
    const passwordGroup = document.querySelector('.input-group:nth-child(2)');
    if (passwordGroup) {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        toggleBtn.title = 'Show password';
        
        // Style the toggle button
        toggleBtn.style.cssText = `
            position: absolute;
            right: 15px;
            top: 42px;
            background: none;
            border: none;
            color: #ff85a2;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 5px;
            z-index: 2;
        `;
        
        passwordGroup.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            this.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
            this.title = isPassword ? 'Hide password' : 'Show password';
        });
    }
    
    // Auto-focus username field on page load
    if (usernameInput.value === '') {
        usernameInput.focus();
    } else {
        passwordInput.focus();
    }
    
    // Add cute floating hearts animation in background
    function createFloatingHearts() {
        const heartsContainer = document.createElement('div');
        heartsContainer.className = 'floating-hearts';
        heartsContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        
        document.body.appendChild(heartsContainer);
        
        const heartEmojis = ['❤️', '💖', '💗', '💓', '💞', '💕', '🌸', '✨'];
        
        // Create 15 floating hearts
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 15}px;
                opacity: ${Math.random() * 0.3 + 0.1};
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                animation: floatHeart ${Math.random() * 20 + 20}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            heartsContainer.appendChild(heart);
        }
        
        // Add floating animation
        const floatAnimation = document.createElement('style');
        floatAnimation.textContent = `
            @keyframes floatHeart {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: ${Math.random() * 0.3 + 0.1};
                }
                90% {
                    opacity: ${Math.random() * 0.3 + 0.1};
                }
                100% {
                    transform: translateY(-100px) rotate(${Math.random() * 360}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(floatAnimation);
    }
    
    // Start floating hearts animation
    createFloatingHearts();
});