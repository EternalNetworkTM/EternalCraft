'use strict';

const LOADING_OVERLAY_FADE_DURATION = 250;

const ANIMATION_CLASSES = ['animation-fade-in', 'animation-slide-down', 'animation-zoom-out'];

const HEADER_IMAGE_OPACITY = 0.4;
const HEADER_IMAGE_TRANSLATE_PERCENT = 50;
const HEADER_IMAGE_SCALE_FACTOR = 0.2;

function setupAnimations() {
    const animationObserver = new IntersectionObserver((entries) => {
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (entry.isIntersecting) {
                entry.target.classList.remove(...ANIMATION_CLASSES);
                animationObserver.unobserve(entry.target);
            }
        }
    });
    const animatedElements = document.querySelectorAll('.animation');
    animatedElements.forEach((element) => animationObserver.observe(element));
}

function setupHeaderImageParallax() {
    const header = document.querySelector('header');
    const headerImage = document.querySelector('.background-image');

    function scrollHandler() {
        const headerRect = header.getBoundingClientRect();
        const percentVisible = Math.max((headerRect.height + headerRect.top) / headerRect.height, 0);
        headerImage.style.opacity = HEADER_IMAGE_OPACITY * percentVisible;
        const translateY = (1 - percentVisible) * HEADER_IMAGE_TRANSLATE_PERCENT;
        const scale = 1 + (1 - percentVisible) * HEADER_IMAGE_SCALE_FACTOR;
        headerImage.style.transform = `translateY(${translateY}%) scale(${scale})`;
    }

    const headerObserver = new IntersectionObserver((entries) => {
        const headerImageEntry = entries[0];
        if (headerImageEntry && headerImageEntry.isIntersecting) {
            document.addEventListener('scroll', scrollHandler);
        } else {
            document.removeEventListener('scroll', scrollHandler);
        }
    });
    headerObserver.observe(header);

    scrollHandler();
}

const ruleObjects = [];

function setupRules() {
    const ruleEntries = document.querySelector('.rules-container').children;

    for (let i = 0; i < ruleEntries.length; i++) {
        const rule = ruleEntries[i];
        const body = rule.querySelector('.body');

        if (!body) {
            continue;
        }

        const label = rule.querySelector('.label');
        const icons = label.querySelectorAll('.icon');

        const ruleObject = {
            element: rule,
            icons: icons,
            body: body
        };
        ruleObjects.push(ruleObject);
        rule.addEventListener('click', () => toggleRule(ruleObject));
    }
}

function toggleRule(ruleObject) {
    for (let i = 0; i < ruleObjects.length; i++) {
        const otherRuleObject = ruleObjects[i];
        const otherRule = otherRuleObject.element;
        if (otherRule !== ruleObject.element && otherRule.classList.contains('expanded')) {
            collapseRule(otherRuleObject);
        }
    }

    if (ruleObject.element.classList.contains('expanded')) {
        ruleObject.body.style.height = '0px';
    } else {
        ruleObject.body.style.height = `${ruleObject.body.scrollHeight}px`;
    }
    ruleObject.element.classList.toggle('expanded');
    for (let j = 0; j < ruleObject.icons.length; j++) {
        ruleObject.icons[j].classList.toggle('hidden');
    }
}

function collapseRule(ruleObject) {
    ruleObject.body.style.height = '0px';
    ruleObject.element.classList.remove('expanded');
    for (let i = 0; i < ruleObject.icons.length; i++) {
        ruleObject.icons[i].classList.toggle('hidden');
    }
}

function doneLoading() {
    document.documentElement.classList.remove('loading');

    const loadingOverlay = document.querySelector('.loading-overlay');
    const animation = loadingOverlay.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        {
            duration: LOADING_OVERLAY_FADE_DURATION,
            easing: 'ease',
            fill: 'forwards'
        }
    );

    function onAnimationEnd() {
        loadingOverlay.classList.add('hidden');
    }

    animation.addEventListener('finish', onAnimationEnd);
    animation.addEventListener('cancel', onAnimationEnd);
}

window.addEventListener('load', () => {
    setupAnimations();
    setupHeaderImageParallax();
    setupRules();
    doneLoading();
});
