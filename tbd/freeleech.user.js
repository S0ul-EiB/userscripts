// ==UserScript==
// @name         TorrentBD - FreeLeech Mode
// @namespace    http://tampermonkey.net/
// @version      2026-05-16
// @description  try to take over the world!
// @author       S0ul
// @match        https://www.torrentbd.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torrentbd.net
// @downloadURL  https://raw.githubusercontent.com/S0ul-EiB/userscripts/main/tbd/freeleech.user.js
// @updateURL    https://raw.githubusercontent.com/S0ul-EiB/userscripts/main/tbd/freeleech.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const contentTitles = document.querySelectorAll('.content-title');
    let torrentsHeading = null;

    /* =========================
   CONFIG
========================= */

    const FREELEECH_ICON_SIZE = 30;

    const SWITCH_OFF_TOP = '#334155';
    const SWITCH_OFF_BOTTOM = '#1e293b';

    const SWITCH_ON_TOP = '#009292';
    const SWITCH_ON_BOTTOM = '#007a7a';

    /* ========================= */

    for (const titleDiv of contentTitles) {
        const heading = titleDiv.querySelector('h6.left');

        if (heading && heading.textContent.trim() === 'Torrents') {
            torrentsHeading = heading;
            break;
        }
    }

    if (torrentsHeading) {
        const style = document.createElement('style');

        style.textContent = `
        :root {
            --fl-icon-size: ${FREELEECH_ICON_SIZE}px;

            --fl-switch-off-top: ${SWITCH_OFF_TOP};
            --fl-switch-off-bottom: ${SWITCH_OFF_BOTTOM};

            --fl-switch-on-top: ${SWITCH_ON_TOP};
            --fl-switch-on-bottom: ${SWITCH_ON_BOTTOM};
        }

        .fl-switch-container {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-left: 14px;
            vertical-align: middle;
            position: relative;
            top: -1px;
            user-select: none;
        }

        .fl-switch-icon {
            width: var(--fl-icon-size);
            height: auto;
            display: block;
            opacity: 0.95;
            pointer-events: none;
        }

        .fl-switch {
            all: unset;
            box-sizing: border-box;
            width: 46px;
            height: 26px;
            border-radius: 999px;
            position: relative;
            cursor: pointer;

            background: linear-gradient(
                180deg,
                var(--fl-switch-off-top) 0%,
                var(--fl-switch-off-bottom) 100%
            );

            border: 1px solid rgba(255, 255, 255, 0.06);

            box-shadow:
                inset 0 1px 1px rgba(255, 255, 255, 0.06),
                0 1px 2px rgba(0, 0, 0, 0.25);

            transition:
                background 0.2s ease,
                box-shadow 0.2s ease;
        }

        .fl-switch[data-state="checked"] {
            background: linear-gradient(
                180deg,
                var(--fl-switch-on-top) 0%,
                var(--fl-switch-on-bottom) 100%
            );
        }

        .fl-switch-thumb {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            border-radius: 999px;

            background: linear-gradient(
                180deg,
                #ffffff 0%,
                #e5e7eb 100%
            );

            box-shadow:
                0 1px 2px rgba(0, 0, 0, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.7);

            transition:
                transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
                background 0.2s ease;
        }

        .fl-switch[data-state="checked"] .fl-switch-thumb {
            transform: translateX(20px);
        }

        .fl-switch:focus-visible {
            outline: 2px solid rgba(0, 122, 122, 0.45);
            outline-offset: 3px;
        }
    `;

    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'fl-switch-container';

    const freeleechIcon = document.createElement('img');
    freeleechIcon.className = 'fl-switch-icon';
    freeleechIcon.src = 'https://www.torrentbd.net/images/free.gif';
    freeleechIcon.alt = 'Freeleech';

    const switchBtn = document.createElement('button');
    switchBtn.type = 'button';
    switchBtn.className = 'fl-switch';
    switchBtn.setAttribute('role', 'switch');
    switchBtn.setAttribute('data-state', 'unchecked');
    switchBtn.setAttribute('aria-checked', 'false');
    switchBtn.id = 'freeleech-switch';

    const switchThumb = document.createElement('span');
    switchThumb.className = 'fl-switch-thumb';

    switchBtn.appendChild(switchThumb);

    container.appendChild(freeleechIcon);
    container.appendChild(switchBtn);

    torrentsHeading.insertAdjacentElement('afterend', container);

    const checkTargetBoxes = () => {
        const filterCheckbox = document.querySelector('#freeleech_filter');

        const attrCheckbox = document.querySelector(
            '[name="kuddus_tertiary_attributes"][value="freeleech"]'
        );

        if (filterCheckbox) {
            filterCheckbox.checked = true;

            filterCheckbox.dispatchEvent(
                new Event('change', { bubbles: true })
            );
        }

        if (attrCheckbox) {
            attrCheckbox.checked = true;

            attrCheckbox.dispatchEvent(
                new Event('change', { bubbles: true })
            );
        }
    };

    const toggleSwitch = (forceState) => {
        const currentState = switchBtn.getAttribute('data-state');

        const newState =
              forceState ||
              (currentState === 'checked' ? 'unchecked' : 'checked');

        switchBtn.setAttribute('data-state', newState);

        switchBtn.setAttribute(
            'aria-checked',
            newState === 'checked' ? 'true' : 'false'
        );

        localStorage.setItem(
            'freeleech_mode_enabled',
            newState === 'checked'
        );

        if (newState === 'checked') {
            checkTargetBoxes();
        }
    };

    switchBtn.addEventListener('click', () => toggleSwitch());

    if (localStorage.getItem('freeleech_mode_enabled') === 'true') {
        toggleSwitch('checked');
    }
}
})();
