const characterModel = document.getElementById('characterModel');
const stage = document.querySelector('.character-stage');

if (characterModel && stage) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let scrollTarget = 0;
    let scrollCurrent = 0;
    let mouseX = 0;
    let mouseY = 0;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const updateFromScroll = () => {
        const rect = stage.getBoundingClientRect();
        const viewport = window.innerHeight || 1;
        const progress = clamp((viewport - rect.top) / (viewport + rect.height), 0, 1);
        scrollTarget = progress;
    };

    const updateFromMouse = (event) => {
        const rect = stage.getBoundingClientRect();
        const relativeX = ((event.clientX - rect.left) / rect.width) - 0.5;
        const relativeY = ((event.clientY - rect.top) / rect.height) - 0.5;
        mouseX = clamp(relativeX * 2, -1, 1);
        mouseY = clamp(relativeY * 2, -1, 1);
    };

    const animate = () => {
        scrollCurrent += (scrollTarget - scrollCurrent) * 0.08;

        if (!prefersReducedMotion) {
            const rotateY = -12 + scrollCurrent * 24 + mouseX * 6;
            const rotateX = 5 - scrollCurrent * 10 - mouseY * 4;
            const depth = 8 + scrollCurrent * 18;
            const floatY = Math.sin(scrollCurrent * Math.PI * 2) * -8;

            characterModel.style.transform = `perspective(1400px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, ${floatY.toFixed(2)}px, ${depth.toFixed(2)}px)`;
        }

        requestAnimationFrame(animate);
    };

    updateFromScroll();

    window.addEventListener('scroll', updateFromScroll, { passive: true });
    window.addEventListener('resize', updateFromScroll);
    stage.addEventListener('mousemove', updateFromMouse);
    stage.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
    });

    animate();
}
