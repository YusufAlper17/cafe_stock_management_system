document.addEventListener('DOMContentLoaded', () => {
    // Clear any existing session data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            console.log('Attempting login...');
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            console.log('Login response:', data);
            
            if (!response.ok) {
                throw new Error(data.message || 'Giriş yapılırken bir hata oluştu');
            }
            
            // Validate user data
            if (!data.token || !data.user) {
                throw new Error('Sunucudan geçersiz yanıt alındı');
            }

            // Validate store_id
            if (!data.user.store_id) {
                throw new Error('Kullanıcı mağaza bilgisi eksik');
            }
            
            console.log('Login successful, storing session data...');
            
            // Store session data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            console.log('Session data stored, redirecting...');
            
            // Redirect to products page
            window.location.href = '/stock';
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('d-none');
            
            // Clear any partial session data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    });
}); 