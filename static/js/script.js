// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Rainfall Predictor App Loaded');
    
    // Fade in the entire content with a slight delay
    const container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.8s ease';
        
        setTimeout(() => {
            container.style.opacity = '1';
        }, 300);
    }
    
    // Add loading animation to form submit
    const predictionForm = document.querySelector('.prediction-form');
    if (predictionForm) {
        predictionForm.addEventListener('submit', function(e) {
            const button = this.querySelector('button');
            const originalText = button.innerHTML;
            
            // Check if the city input is valid
            const cityInput = document.getElementById('city');
            if (cityInput && cityInput.value.trim() === '') {
                e.preventDefault();
                
                // Shake the input to indicate error
                cityInput.style.animation = 'shake 0.5s';
                cityInput.classList.add('error');
                
                setTimeout(() => {
                    cityInput.style.animation = '';
                }, 500);
                
                return;
            }
            
            // Change button text and add loading class
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Predicting...';
            button.classList.add('loading');
            
            // Add loading class to form
            predictionForm.classList.add('processing');
            
            // Create and append a loading overlay
            const overlay = document.createElement('div');
            overlay.className = 'form-overlay';
            overlay.innerHTML = '<div class="loader-container"><div class="loader"></div><p>Fetching weather data...</p></div>';
            document.body.appendChild(overlay);
            
            // Enable the button and restore text after 15 seconds in case of error
            setTimeout(() => {
                if (button.classList.contains('loading')) {
                    button.innerHTML = originalText;
                    button.classList.remove('loading');
                    predictionForm.classList.remove('processing');
                    if (document.querySelector('.form-overlay')) {
                        document.body.removeChild(overlay);
                    }
                }
            }, 15000);
        });
    }
    
    // Handle popular city tags
    const cityTags = document.querySelectorAll('.city-tag');
    const cityInput = document.getElementById('city');
    if (cityTags.length > 0 && cityInput) {
        cityTags.forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.preventDefault();
                const cityName = this.getAttribute('data-city');
                cityInput.value = cityName;
                
                // Add active class to the selected city
                cityTags.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Focus on the input
                cityInput.focus();
                
                // Subtle pop animation
                this.style.animation = 'pop 0.3s ease';
                setTimeout(() => {
                    this.style.animation = '';
                }, 300);
            });
        });
        
        // Remove error class when typing
        cityInput.addEventListener('input', function() {
            this.classList.remove('error');
        });
    }
    
    // Update current time on result page with more accurate formatting
    const currentTimeElement = document.getElementById('current-time');
    if (currentTimeElement) {
        const updateTime = () => {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit' 
            };
            currentTimeElement.textContent = now.toLocaleDateString(undefined, options);
            
            // Add fade animation
            currentTimeElement.style.animation = 'fadeIn 0.5s ease';
            setTimeout(() => {
                currentTimeElement.style.animation = '';
            }, 500);
        };
        
        // Update immediately and then every minute
        updateTime();
        setInterval(updateTime, 60000);
    }
    
    // Share button functionality with enhanced feedback
    const shareButton = document.getElementById('share-button');
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            // Add click effect
            this.classList.add('button-clicked');
            setTimeout(() => {
                this.classList.remove('button-clicked');
            }, 300);
            
            // Get the prediction and city
            const city = document.querySelector('.city-info h2').textContent;
            const prediction = document.querySelector('.prediction').textContent;
            
            // Create share text
            const shareText = `Check out my rainfall prediction for ${city}: ${prediction} - via Rainfall Predictor`;
            
            // Create a toast notification element
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            
            // If Web Share API is available
            if (navigator.share) {
                navigator.share({
                    title: 'Rainfall Prediction Result',
                    text: shareText,
                    url: window.location.href
                })
                .then(() => {
                    // Success toast
                    toast.innerHTML = '<i class="fas fa-check-circle"></i> Shared successfully!';
                    toast.classList.add('success');
                    showToast(toast);
                })
                .catch(err => {
                    console.log('Error sharing:', err);
                    fallbackShare(toast);
                });
            } else {
                fallbackShare(toast);
            }
            
            function fallbackShare(toastElement) {
                // Fallback to copy to clipboard
                const tempInput = document.createElement('input');
                document.body.appendChild(tempInput);
                tempInput.value = shareText + ' ' + window.location.href;
                tempInput.select();
                
                try {
                    const success = document.execCommand('copy');
                    
                    if (success) {
                        // Update button text temporarily
                        const originalText = shareButton.innerHTML;
                        shareButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        
                        // Show toast notification
                        toastElement.innerHTML = '<i class="fas fa-clipboard-check"></i> Copied to clipboard!';
                        toastElement.classList.add('success');
                        showToast(toastElement);
                        
                        setTimeout(() => {
                            shareButton.innerHTML = originalText;
                        }, 2000);
                    } else {
                        toastElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to copy!';
                        toastElement.classList.add('error');
                        showToast(toastElement);
                    }
                } catch (err) {
                    toastElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error: ' + err;
                    toastElement.classList.add('error');
                    showToast(toastElement);
                }
                
                document.body.removeChild(tempInput);
            }
            
            // Helper function to show and hide toast notifications
            function showToast(toastElement) {
                document.body.appendChild(toastElement);
                
                // Animate in
                setTimeout(() => {
                    toastElement.classList.add('show');
                }, 10);
                
                // Remove after 3 seconds
                setTimeout(() => {
                    toastElement.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(toastElement);
                    }, 300);
                }, 3000);
            }
        });
    }
    
    // Add animations to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0) {
        featureCards.forEach((card, index) => {
            // Add staggered animation delay for initial load
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
            card.style.transitionDelay = `${index * 0.15}s`;
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
            
            // Add hover effects
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(5deg)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
    
    // Add animation to parameter badges
    const parameterBadges = document.querySelectorAll('.parameter-badge');
    if (parameterBadges.length > 0) {
        // Intersection Observer for on-scroll animation
        const badgeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const badge = entry.target;
                    badge.classList.add('animated');
                    setTimeout(() => {
                        badge.style.opacity = '1';
                        badge.style.transform = 'translateY(0)';
                    }, 100);
                    badgeObserver.unobserve(badge);
                }
            });
        }, { threshold: 0.2 });
        
        parameterBadges.forEach((badge, index) => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(25px)';
            badge.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
            badge.style.transitionDelay = `${index * 0.1}s`;
            
            // Observe each badge
            badgeObserver.observe(badge);
        });
    }
    
    // Add animation to parameter cards on result page
    const parameterCards = document.querySelectorAll('.parameter-card');
    if (parameterCards.length > 0) {
        // Intersection Observer for on-scroll animation
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    card.classList.add('animated');
                    animateCard(card);
                    cardObserver.unobserve(card);
                }
            });
        }, { threshold: 0.2 });
        
        parameterCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            card.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
            card.style.transitionDelay = `${index * 0.12}s`;
            
            // Observe each card
            cardObserver.observe(card);
        });
        
        function animateCard(card) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            
            // Animate scale fill after card appears
            const scaleFill = card.querySelector('.scale-fill');
            if (scaleFill) {
                scaleFill.style.width = '0%';
                setTimeout(() => {
                    const width = scaleFill.getAttribute('style').split('width:')[1]?.trim();
                    if (width) {
                        scaleFill.style.width = width;
                    }
                }, 400);
            }
        }
    }
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-5px); }
            80% { transform: translateX(5px); }
            100% { transform: translateX(0); }
        }
        
        @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .error {
            border-color: var(--accent-color) !important;
            box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important;
        }
        
        .button-clicked {
            transform: scale(0.95);
        }
        
        .form-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .loader-container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            text-align: center;
            animation: slideUp 0.4s ease;
        }
        
        .loader {
            border: 5px solid #f3f3f3;
            border-top: 5px solid var(--primary-color);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            margin: 0 auto 1rem;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .toast-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            color: var(--text-color);
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            z-index: 9999;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .toast-notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast-notification i {
            margin-right: 0.5rem;
            font-size: 1.2rem;
        }
        
        .toast-notification.success i {
            color: var(--success-color);
        }
        
        .toast-notification.error i {
            color: var(--accent-color);
        }
    `;
    
    document.head.appendChild(style);
}); 