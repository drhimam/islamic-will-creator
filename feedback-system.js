/**
 * Islamic Will Creator - Interactive Feedback System
 * Displays feedback instantly with comments and reply functionality (no backend required)
 */

class FeedbackSystem {
    constructor() {
        this.feedbackStorageKey = 'islamicWillFeedback';
        this.commentStorageKey = 'islamicWillComments';
        
        this.setupEventListeners();
        this.loadAndDisplayFeedback();
        this.autoFillTechnicalInfo();
    }

    setupEventListeners() {
        // Add event listener to feedback form
        const feedbackForm = document.getElementById('feedback-form');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', (e) => this.handleFeedbackSubmit(e));
        }
    }

    autoFillTechnicalInfo() {
        // Auto-fill browser information
        const browserField = document.getElementById('browser');
        if (browserField) {
            browserField.value = this.getBrowserInfo();
        }

        // Auto-detect device type
        const deviceField = document.getElementById('device');
        if (deviceField) {
            deviceField.value = this.getDeviceType();
        }
    }

    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown Browser';
        
        if (ua.includes('Chrome')) browser = `Chrome ${ua.split('Chrome/')[1].split(' ')[0]}`;
        else if (ua.includes('Firefox')) browser = `Firefox ${ua.split('Firefox/')[1]}`;
        else if (ua.includes('Safari')) browser = `Safari ${ua.split('Version/')[1].split(' ')[0]}`;
        else if (ua.includes('Edge')) browser = `Edge ${ua.split('Edge/')[1]}`;
        
        return browser;
    }

    getDeviceType() {
        const width = window.innerWidth;
        if (width <= 768) return 'mobile';
        if (width <= 1024) return 'tablet';
        return 'desktop';
    }

    async handleFeedbackSubmit(event) {
        event.preventDefault();
        
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
        submitBtn.disabled = true;

        try {
            // Collect form data
            const formData = this.collectFormData();
            
            // Save feedback to localStorage
            this.saveFeedback(formData);
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            this.resetForm();
            
            // Reload and display feedback
            this.loadAndDisplayFeedback();
            
        } catch (error) {
            console.error('Error saving feedback:', error);
            this.showErrorMessage();
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    collectFormData() {
        return {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            name: document.getElementById('feedbackName')?.value || 'Anonymous',
            email: document.getElementById('feedbackEmail')?.value || '',
            rating: document.querySelector('input[name="rating"]:checked')?.value || '0',
            feedbackType: document.getElementById('feedbackType')?.value || 'other',
            subject: document.getElementById('feedbackSubject')?.value || '',
            message: document.getElementById('feedbackMessage')?.value || '',
            browser: document.getElementById('browser')?.value || '',
            device: document.getElementById('device')?.value || '',
            approved: true // Auto-approve all feedback for demo purposes
        };
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveFeedback(feedbackData) {
        const existingFeedback = this.getFeedbackFromStorage();
        existingFeedback.unshift(feedbackData); // Add to beginning of array
        localStorage.setItem(this.feedbackStorageKey, JSON.stringify(existingFeedback));
    }

    getFeedbackFromStorage() {
        const stored = localStorage.getItem(this.feedbackStorageKey);
        let feedback = [];
        
        try {
            feedback = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error parsing stored feedback data:', error);
            feedback = [];
            // Clear corrupted data
            localStorage.removeItem(this.feedbackStorageKey);
        }
        
        // Add sample feedback if no feedback exists (for demo purposes)
        if (feedback.length === 0) {
            feedback = this.getSampleFeedback();
            localStorage.setItem(this.feedbackStorageKey, JSON.stringify(feedback));
        }
        
        return feedback;
    }

    getSampleFeedback() {
        return [
            {
                id: 'sample1',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
                name: 'Ahmed Al-Rahman',
                email: '',
                rating: '5',
                feedbackType: 'praise',
                subject: 'Excellent Islamic Will Tool',
                message: 'Jazakallahu khair for creating this wonderful tool. It made creating my Islamic will very easy and I feel confident it follows Shariah principles correctly. The inheritance calculator is particularly helpful!',
                browser: 'Chrome 118',
                device: 'desktop',
                approved: true
            },
            {
                id: 'sample2',
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                name: 'Fatima',
                email: '',
                rating: '4',
                feedbackType: 'feature',
                subject: 'Great tool, small suggestion',
                message: 'MashaAllah, this is very helpful for the Muslim community. Could you add more languages in the future? It would be great to have Arabic and Urdu translations.',
                browser: 'Safari 17',
                device: 'tablet',
                approved: true
            },
            {
                id: 'sample3',
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
                name: 'Muslim Brother',
                email: '',
                rating: '5',
                feedbackType: 'praise',
                subject: 'Barakallahu feek',
                message: 'This tool is a blessing for our Ummah. Very user-friendly and comprehensive. The step-by-step guide helped me understand the Islamic inheritance laws better.',
                browser: 'Firefox 119',
                device: 'mobile',
                approved: true
            }
        ];
    }

    getCommentsFromStorage() {
        const stored = localStorage.getItem(this.commentStorageKey);
        let comments = {};
        
        try {
            comments = stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error parsing stored comment data:', error);
            comments = {};
            // Clear corrupted data
            localStorage.removeItem(this.commentStorageKey);
        }
        
        // Add sample comments if none exist (for demo purposes)
        if (Object.keys(comments).length === 0) {
            comments = this.getSampleComments();
            localStorage.setItem(this.commentStorageKey, JSON.stringify(comments));
        }
        
        return comments;
    }

    getSampleComments() {
        return {
            'sample1': [
                {
                    id: 'comment1',
                    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    name: 'Khadija',
                    message: 'I completely agree! This tool made the process so much easier for me as well. JazakAllahu khair to the developers.'
                },
                {
                    id: 'comment2',
                    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
                    name: 'Omar',
                    message: 'Same here! The inheritance calculator helped me understand how to distribute my assets according to Islamic law. Very beneficial.'
                }
            ],
            'sample2': [
                {
                    id: 'comment3',
                    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                    name: 'Islamic Will Team',
                    message: 'JazakAllahu khair for your feedback! We are working on multi-language support. Arabic translation is planned for the next update, inshaaAllah.'
                }
            ]
        };
    }

    saveComment(feedbackId, commentData) {
        const comments = this.getCommentsFromStorage();
        if (!comments[feedbackId]) {
            comments[feedbackId] = [];
        }
        comments[feedbackId].push({
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            ...commentData
        });
        localStorage.setItem(this.commentStorageKey, JSON.stringify(comments));
    }

    loadAndDisplayFeedback() {
        const feedbackContainer = document.getElementById('feedback-display');
        const noFeedbackMessage = document.getElementById('no-feedback-message');
        const feedbackList = this.getFeedbackFromStorage();

        if (feedbackList.length === 0) {
            feedbackContainer.style.display = 'none';
            noFeedbackMessage.style.display = 'block';
            return;
        }

        feedbackContainer.style.display = 'block';
        noFeedbackMessage.style.display = 'none';
        
        feedbackContainer.innerHTML = feedbackList.map(feedback => this.createFeedbackHTML(feedback)).join('');
        
        // Add event listeners for comment forms
        this.setupCommentEventListeners();
    }

    createFeedbackHTML(feedback) {
        const comments = this.getCommentsFromStorage()[feedback.id] || [];
        const timeAgo = this.getTimeAgo(new Date(feedback.timestamp));
        const stars = this.createStarRating(parseInt(feedback.rating));
        
        return `
            <div class="feedback-item" data-feedback-id="${feedback.id}">
                <div class="feedback-header">
                    <div class="feedback-author">
                        <div class="author-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="author-info">
                            <h4>${this.escapeHtml(feedback.name)}</h4>
                            <span class="feedback-meta">
                                ${timeAgo} • ${this.escapeHtml(feedback.feedbackType)}
                                ${feedback.device ? ` • ${this.escapeHtml(feedback.device)}` : ''}
                            </span>
                        </div>
                    </div>
                    <div class="feedback-rating">
                        ${stars}
                    </div>
                </div>
                
                <div class="feedback-content">
                    <h5>${this.escapeHtml(feedback.subject)}</h5>
                    <p>${this.escapeHtml(feedback.message)}</p>
                </div>
                
                <div class="feedback-actions">
                    <button class="action-btn like-btn" onclick="feedbackSystem.likeFeedback('${feedback.id}')">
                        <i class="fas fa-thumbs-up"></i> Like (<span id="likes-${feedback.id}">0</span>)
                    </button>
                    <button class="action-btn reply-btn" onclick="feedbackSystem.toggleReplyForm('${feedback.id}')">
                        <i class="fas fa-reply"></i> Reply (${comments.length})
                    </button>
                </div>
                
                <!-- Comments Section -->
                <div class="comments-section ${comments.length > 0 ? 'has-comments' : ''}">
                    <div class="comments-list">
                        ${comments.map(comment => this.createCommentHTML(comment)).join('')}
                    </div>
                    
                    <!-- Reply Form -->
                    <div id="reply-form-${feedback.id}" class="reply-form" style="display: none;">
                        <div class="reply-input-group">
                            <input type="text" id="reply-name-${feedback.id}" placeholder="Your name (optional)" class="reply-name-input">
                            <textarea id="reply-message-${feedback.id}" placeholder="Write a reply..." class="reply-textarea" rows="2"></textarea>
                            <div class="reply-actions">
                                <button class="btn-secondary" onclick="feedbackSystem.toggleReplyForm('${feedback.id}')">
                                    <i class="fas fa-times"></i> Cancel
                                </button>
                                <button class="btn-primary" onclick="feedbackSystem.submitReply('${feedback.id}')">
                                    <i class="fas fa-paper-plane"></i> Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createCommentHTML(comment) {
        const timeAgo = this.getTimeAgo(new Date(comment.timestamp));
        
        return `
            <div class="comment-item">
                <div class="comment-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${this.escapeHtml(comment.name)}</span>
                        <span class="comment-time">${timeAgo}</span>
                    </div>
                    <p class="comment-message">${this.escapeHtml(comment.message)}</p>
                </div>
            </div>
        `;
    }

    createStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star ${i <= rating ? 'filled' : ''}"></i>`;
        }
        return stars;
    }

    toggleReplyForm(feedbackId) {
        const replyForm = document.getElementById(`reply-form-${feedbackId}`);
        if (replyForm.style.display === 'none') {
            replyForm.style.display = 'block';
            document.getElementById(`reply-message-${feedbackId}`).focus();
        } else {
            replyForm.style.display = 'none';
            // Clear form
            document.getElementById(`reply-name-${feedbackId}`).value = '';
            document.getElementById(`reply-message-${feedbackId}`).value = '';
        }
    }

    submitReply(feedbackId) {
        const nameInput = document.getElementById(`reply-name-${feedbackId}`);
        const messageInput = document.getElementById(`reply-message-${feedbackId}`);
        
        const name = nameInput.value.trim() || 'Anonymous';
        const message = messageInput.value.trim();
        
        if (!message) {
            alert('Please enter a reply message.');
            return;
        }
        
        // Save comment
        this.saveComment(feedbackId, { name, message });
        
        // Clear form
        nameInput.value = '';
        messageInput.value = '';
        
        // Hide reply form
        this.toggleReplyForm(feedbackId);
        
        // Reload feedback display
        this.loadAndDisplayFeedback();
        
        // Show success message
        if (typeof showAlert === 'function') {
            showAlert('Reply posted successfully!', 'success');
        }
    }

    likeFeedback(feedbackId) {
        // Simple like counter using localStorage
        const likesKey = `likes_${feedbackId}`;
        let likes = parseInt(localStorage.getItem(likesKey) || '0');
        likes++;
        localStorage.setItem(likesKey, likes.toString());
        
        // Update display
        const likesSpan = document.getElementById(`likes-${feedbackId}`);
        if (likesSpan) {
            likesSpan.textContent = likes;
        }
        
        if (typeof showAlert === 'function') {
            showAlert('Thanks for your feedback!', 'success');
        }
    }

    setupCommentEventListeners() {
        // Update like counts from localStorage
        const feedbackList = this.getFeedbackFromStorage();
        feedbackList.forEach(feedback => {
            const likesSpan = document.getElementById(`likes-${feedback.id}`);
            if (likesSpan) {
                const likes = localStorage.getItem(`likes_${feedback.id}`) || '0';
                likesSpan.textContent = likes;
            }
        });
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        
        return date.toLocaleDateString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showSuccessMessage() {
        if (typeof showAlert === 'function') {
            showAlert('Feedback published successfully! Thank you for sharing your thoughts.', 'success');
        }
    }

    showErrorMessage() {
        if (typeof showAlert === 'function') {
            showAlert('Error publishing feedback. Please try again.', 'error');
        }
    }

    resetForm() {
        const form = document.getElementById('feedback-form');
        if (form) {
            form.reset();
            // Clear star ratings
            const ratingInputs = form.querySelectorAll('input[name="rating"]');
            ratingInputs.forEach(input => input.checked = false);
        }
    }
}

// Reset feedback form function (called by reset button)
function resetFeedbackForm() {
    if (window.feedbackSystem) {
        window.feedbackSystem.resetForm();
        if (typeof showAlert === 'function') {
            showAlert('Form reset successfully.', 'info');
        }
    }
}

// Initialize feedback system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.feedbackSystem = new FeedbackSystem();
});

// Also initialize if script is loaded after DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.feedbackSystem = new FeedbackSystem();
    });
} else {
    window.feedbackSystem = new FeedbackSystem();
}