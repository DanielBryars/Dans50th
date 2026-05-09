// CEEFAX Page Navigation System

const pages = {
    '500': 'page501.html',
    '501': 'page501.html',
    '502': 'page502.html',
    '503': 'page503.html',
    '504': 'page504.html',
    '505': 'page505.html',
    '506': 'page506.html',
    '600': 'page600.html',
    '601': 'page601.html',
    '602': 'page602.html',
    '603': 'page603.html',
    '604': 'page604.html',
    '605': 'page605.html',
    '606': 'page606.html',
    '700': 'page700.html',
    '800': 'page800.html'
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

// Party kicks off Saturday 8th August 2026, 12 noon BST (UTC+1)
const PARTY_DATE = new Date('2026-08-08T12:00:00+01:00');

function updateCountdown() {
    const cdEl = document.getElementById('countdown');
    if (!cdEl) return;

    const diff = PARTY_DATE - new Date();

    if (diff <= 0) {
        cdEl.innerHTML = '<span class="cd-live yellow blink">██ PARTY TIME ██</span>';
        return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const mins = Math.floor((diff / 60000) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const set = (id, val, pad) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(val).padStart(pad, '0');
    };
    set('cd-days', days, 3);
    set('cd-hours', hours, 2);
    set('cd-mins', mins, 2);
    set('cd-secs', secs, 2);
}

// Page counter animation - shows in header
// Quick flicker through a few numbers then land on target
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

    // Flicker through 8 random-ish numbers then land on target
    const steps = 8;
    let i = 0;

    function tick() {
        if (i >= steps) {
            counter.textContent = target;
            setTimeout(() => {
                callback();
            }, 100);
            return;
        }

        const base = Math.floor(target / 100) * 100;
        counter.textContent = base + Math.floor(Math.random() * 100);
        i++;
        setTimeout(tick, 60);
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
    navigator.clipboard.writeText('danfest@bryars.com').then(function() {
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

    setInterval(updateCountdown, 1000);
    updateCountdown();

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
