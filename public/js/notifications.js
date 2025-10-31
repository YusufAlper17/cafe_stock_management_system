class ToastNotification {
    static init() {
        // Create container for notifications
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }

    static show(options) {
        const container = document.getElementById('toast-container');
        if (!container) {
            this.init();
        }

        const {
            message = 'Bildirim',
            type = 'info',
            duration = 4000,
            position = 'top-right'
        } = typeof options === 'string' ? { message: options } : options;

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `toast-notification toast-${type}`;
        
        // Get icon based on type
        const icons = {
            success: 'bi-check-circle-fill',
            error: 'bi-exclamation-triangle-fill',
            warning: 'bi-exclamation-circle-fill',
            info: 'bi-info-circle-fill'
        };

        notification.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    <i class="bi ${icons[type] || icons.info}"></i>
                </div>
                <div class="toast-message">${message}</div>
                <button class="toast-close" type="button">
                    <i class="bi bi-x"></i>
                </button>
            </div>
            <div class="toast-progress"></div>
        `;

        // Add to container
        container.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto remove
        const progressBar = notification.querySelector('.toast-progress');
        progressBar.style.animation = `toast-progress ${duration}ms linear forwards`;

        setTimeout(() => {
            this.hide(notification);
        }, duration);

        // Manual close
        const closeBtn = notification.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hide(notification);
        });

        return notification;
    }

    static hide(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Convenience methods
    static success(message, duration = 4000) {
        return this.show({ message, type: 'success', duration });
    }

    static error(message, duration = 5000) {
        return this.show({ message, type: 'error', duration });
    }

    static warning(message, duration = 4000) {
        return this.show({ message, type: 'warning', duration });
    }

    static info(message, duration = 3000) {
        return this.show({ message, type: 'info', duration });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    ToastNotification.init();
});

// Add CSS for toast notifications
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast-notification {
        background: var(--card-background);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        overflow: hidden;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        min-width: 300px;
        max-width: 400px;
    }

    .toast-notification.show {
        transform: translateX(0);
        opacity: 1;
    }

    .toast-notification.hide {
        transform: translateX(100%);
        opacity: 0;
    }

    .toast-content {
        display: flex;
        align-items: center;
        padding: 16px;
        gap: 12px;
    }

    .toast-icon {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .toast-icon i {
        font-size: 20px;
    }

    .toast-message {
        flex: 1;
        color: var(--text-color);
        font-weight: 500;
        line-height: 1.4;
    }

    .toast-close {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s;
        flex-shrink: 0;
    }

    .toast-close:hover {
        background: rgba(0, 0, 0, 0.1);
        color: var(--text-color);
    }

    .toast-progress {
        height: 3px;
        background: var(--primary-color);
        width: 100%;
        transform-origin: left;
        animation: toast-progress 4000ms linear forwards;
    }

    .toast-success .toast-icon i {
        color: var(--success-color);
    }

    .toast-success .toast-progress {
        background: var(--success-color);
    }

    .toast-error .toast-icon i {
        color: var(--danger-color);
    }

    .toast-error .toast-progress {
        background: var(--danger-color);
    }

    .toast-warning .toast-icon i {
        color: var(--warning-color);
    }

    .toast-warning .toast-progress {
        background: var(--warning-color);
    }

    .toast-info .toast-icon i {
        color: var(--info-color);
    }

    .toast-info .toast-progress {
        background: var(--info-color);
    }

    @keyframes toast-progress {
        from {
            transform: scaleX(1);
        }
        to {
            transform: scaleX(0);
        }
    }

    /* Dark theme adjustments */
    .dark-theme .toast-notification {
        background: var(--card-background);
        border-color: var(--border-color);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .dark-theme .toast-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;
document.head.appendChild(toastStyles);

// Legacy support
class Notifications {
    static init() {
        ToastNotification.init();
    }

    static show(message, type = 'info') {
        return ToastNotification.show({ message, type });
    }
} 