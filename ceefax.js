// CEEFAX Page Navigation System

const pages = {
    '500': '501.html',
    '501': '501.html',
    '502': '502.html',
    '503': '503.html',
    '504': '504.html',
    '505': '505.html'
};

// Get current page number from the input
function getCurrentPage() {
    const input = document.getElementById('page-input');
    return input ? parseInt(input.value) : 501;
}

function updateClock() {
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    const clockEl = document.getElementById('clock');
    if (clockEl) clockEl.textContent = time;
}

// Page counter animation - shows in header
// Annoyingly counts up to 600 then lands on target
function animateToPage(targetPage, callback) {
    const inputBox = document.querySelector('.page-input-box');
    const counter = document.getElementById('page-counter');

    if (!inputBox || !counter) {
        callback();
        return;
    }

    const currentPage = getCurrentPage();
    const target = parseInt(targetPage);

    if (currentPage === target) {
        callback();
        return;
    }

    // Hide input, show counter
    inputBox.style.display = 'none';
    counter.classList.add('active');

    // Count from current up to 600
    const totalSteps = 600 - currentPage;
    const speed = Math.floor(3000 / totalSteps);

    let current = currentPage;

    function tick() {
        counter.textContent = current;

        if (current >= 600) {
            // Hit 600, now show target and go
            counter.textContent = target;
            setTimeout(() => {
                callback();
            }, 100);
            return;
        }

        current++;
        setTimeout(tick, speed);
    }

    tick();
}

function goToPage(pageNum) {
    const num = pageNum.toString().trim();
    if (pages[num]) {
        animateToPage(num, () => {
            window.location.href = pages[num];
        });
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
                input.value = getCurrentPage().toString();
            }, 500);
        }
    }
}

// Handle clicks on page index links
function handlePageClick(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    // Extract page number from href (e.g., "502.html" -> "502")
    const match = href.match(/(\d+)\.html/);
    if (match) {
        goToPage(match[1]);
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

    // Add click handlers to page index links (with slow animation)
    document.querySelectorAll('.idx').forEach(link => {
        link.addEventListener('click', handlePageClick);
    });

    // Fastext buttons are instant - no animation
    document.querySelectorAll('.fastext-btn').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            window.location.href = href;
        });
    });
});
