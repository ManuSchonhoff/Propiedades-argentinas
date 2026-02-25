// Classic interaction
document.addEventListener('DOMContentLoaded', () => {

    // Search Tabs Interaction
    const tabs = document.querySelectorAll('.search-tabs button');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Simple Hover Effects
    const cards = document.querySelectorAll('.prop-card-minimal');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.3s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Hero Text Fade In
    const title = document.querySelector('.display-title');
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        setTimeout(() => {
            title.style.transition = 'all 1s ease';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 100);
    }
});
