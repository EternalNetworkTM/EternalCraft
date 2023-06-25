'use strict';

const HEADER_IMAGE_OPACITY = 0.4;
const HEADER_IMAGE_TRANSLATE_PERCENT = 50;
const HEADER_IMAGE_SCALE_FACTOR = 0.2;

function setupHeaderImageAnimation() {
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

    const observer = new IntersectionObserver((entries) => {
        const headerImageEntry = entries[0];
        if (headerImageEntry && headerImageEntry.isIntersecting) {
            document.body.addEventListener('scroll', scrollHandler);
        } else {
            document.body.removeEventListener('scroll', scrollHandler);
        }
    });
    observer.observe(header);

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

window.addEventListener('load', () => {
    setupHeaderImageAnimation();
    setupRules();
});
