'use strict';

const ruleEntries = document.querySelector('.rules-container').children;
const ruleObjects = [];

function setupRules() {
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
    setupRules();
});
