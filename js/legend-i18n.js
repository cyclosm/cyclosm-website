const banana = new Banana();

/**
 * @private
 * @param {string[]} locales 
 * @returns {Promise<[object, string]>} Returns a promise that resolves to the localization data for the first available locale.
 */
async function loadLocalizationData(locales) {
    for (const loc of locales) {
        if (loc === 'en') {
            return [{}, 'en']; // No localization needed for English
        }
        const response = await fetch(`/i18n/${loc}.json`);
        if (!response.ok) {
            console.warn(`Localization file not found for ${loc}`);
            continue; // Try the next locale
        }
        try {
            const data = await response.json();
            console.info(`Loaded localization for ${loc}`);
            return [data, loc];
        } catch (error) {
            console.error(`Error parsing localization file for ${loc}:`, error);
            continue; // Try the next locale
        }
    }
    console.warn('Defaulting to English localization');
    return [{}, 'en'];
}

async function loadLocalization(locales) {
    const [data, loc] = await loadLocalizationData(locales);

    banana.load(data, loc);
    banana.setLocale(loc);

    document.querySelectorAll('.i18n').forEach(element => {
        const message = element.dataset.i18n;
        if (message === undefined) {
            return;
        }
        const localizedMessage = banana.i18n(message);
        if (message !== localizedMessage) {
            element.innerText = localizedMessage;
        }
    });
}

window.addEventListener('load', () => {
    loadLocalization(navigator.languages)
});
