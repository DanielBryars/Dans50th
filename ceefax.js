// CEEFAX Page Navigation System

const pages = {
    '500': 'index.html',
    '501': '501.html',
    '502': '502.html',
    '503': '503.html',
    '504': '504.html',
    '505': '505.html'
};

function updateClock() {
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    const clockEl = document.getElementById('clock');
    if (clockEl) clockEl.textContent = time;
}

function goToPage(pageNum) {
    const num = pageNum.toString().trim();
    if (pages[num]) {
        window.location.href = pages[num];
        return true;
    }
    return false;
}

function handlePageInput(e) {
    if (e.key === 'Enter') {
        const input = e.target;
        const pageNum = input.value.trim();
        if (goToPage(pageNum)) {
            input.classList.add('valid');
        } else {
            input.classList.add('invalid');
            setTimeout(() => {
                input.classList.remove('invalid');
                input.value = '';
            }, 500);
        }
    }
}

function copyEmail() {
    navigator.clipboard.writeText('dans50th@bryars.com').then(function() {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = '✓';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = '⎘';
            btn.classList.remove('copied');
        }, 2000);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setInterval(updateClock, 1000);
    updateClock();

    // Page input listener
    const pageInput = document.getElementById('page-input');
    if (pageInput) {
        pageInput.addEventListener('keydown', handlePageInput);
        // Only allow numbers
        pageInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
});
