'use strict';
import Light from './basicSettings.js';
import AdvanceSettings from './advanceSettings.js';
const homepageButton = document.querySelector('.entry_point');
const homepage = document.querySelector('main');
const mainRoomsContainer = document.querySelector('.application_container');
const advanceFeaturesContainer = document.querySelector('.advanced_features_container');
const nav = document.querySelector('nav');
const loader = document.querySelector('.loader-container');
const generalLightSwitch = document.querySelector('.general-light-switch');
const wifiToggle = document.querySelector('.wifi-toggle');
const wifiNotification = document.querySelector('.wifi_notification');
const wifiConnectionListContainer = document.querySelector('.wifi_connection_list_container');
const lightController = new Light();
const advancedSettings = new AdvanceSettings();
let selectedComponent;
let isWifiActive = true;
window.isWifiActive = isWifiActive;
const wifiNetworks = [
    'HomeWiFi', 'GuestNet', 'OfficeWiFi', 'CafeConnect', 'PublicWiFi',
    'NeighborNet', 'SecureHub', 'FastLink', 'FamilyWiFi', 'OpenNet',
];
const signalIcons = [
    './assets/svgs/wifi_signal_excellent.svg',
    './assets/svgs/wifi_signal_good.svg',
    './assets/svgs/wifi_signal_poor.svg',
];
function generateRandomNetworks() {
    if (!isWifiActive) {
        wifiConnectionListContainer.innerHTML = '';
        return;
    }
    const numNetworks = Math.floor(Math.random() * 4) + 2;
    const shuffledNetworks = wifiNetworks.sort(() => 0.5 - Math.random());
    const selectedNetworks = shuffledNetworks.slice(0, numNetworks);
    wifiConnectionListContainer.innerHTML = '';
    selectedNetworks.forEach((network) => {
        const signalIcon = signalIcons[Math.floor(Math.random() * signalIcons.length)];
        const isProtected = Math.random() > 0.3;
        const networkItem = `
      <div class="wifi_connections_list">
        <p>${network}</p>
        <div class="wifi-icons">
          <img src="${signalIcon}" alt="signal strength">
          ${isProtected ? '<img src="./assets/svgs/wifi_protected.svg" alt="protected">' : ''}
        </div>
      </div>
    `;
        wifiConnectionListContainer.insertAdjacentHTML('beforeend', networkItem);
    });
    lightController.displayNotification('Wi-Fi network list updated', 'beforeend', document.querySelector('body'));
}
homepageButton.addEventListener('click', () => {
    lightController.addHidden(homepage);
    lightController.removeHidden(loader);
    setTimeout(() => {
        lightController.removeHidden(mainRoomsContainer);
        lightController.removeHidden(nav);
    }, 1000);
});
mainRoomsContainer.addEventListener('click', (e) => {
    var _a;
    const selectedElement = e.target;
    if (selectedElement.closest('.light-switch')) {
        if (!isWifiActive) {
            lightController.displayNotification('Wi-Fi is inactive. Please enable Wi-Fi to toggle lights.', 'beforeend', document.querySelector('body'));
            return;
        }
        const lightSwitch = (_a = selectedElement.closest('.basic_settings_buttons')) === null || _a === void 0 ? void 0 : _a.firstElementChild;
        lightController.toggleLightSwitch(lightSwitch);
        const roomName = lightController.getSelectedComponentName(lightSwitch);
        const component = lightController.getComponent(roomName || '');
        if (component) {
            const message = `Light ${component.isLightOn ? 'turned on' : 'turned off'} in ${roomName}`;
            lightController.displayNotification(message, 'beforeend', document.querySelector('body'));
        }
        return;
    }
    if (selectedElement.closest('.advance-settings_modal')) {
        const advancedSettingsBtn = selectedElement.closest('.advance-settings_modal');
        advancedSettings.modalPopUp(advancedSettingsBtn);
    }
});
mainRoomsContainer.addEventListener('input', (e) => {
    const sliders = e.target;
    if (sliders.matches('#light_intensity')) {
        if (!isWifiActive) {
            const notificationContainer = document.querySelector('body');
            lightController.displayNotification('Wi-Fi is inactive. Please enable Wi-Fi to adjust lights.', 'beforeend', notificationContainer);
            return;
        }
        const value = parseInt(sliders.value, 10);
        const prevValue = parseInt(sliders.getAttribute('data-prev-value') || '0', 10);
        lightController.handleLightIntensitySlider(sliders, value);
        if (value > prevValue) {
            const roomName = lightController.getSelectedComponentName(sliders.closest('.rooms'));
            const message = roomName
                ? `Light intensity increased to ${value} in ${roomName}`
                : `Light intensity increased to ${value}`;
            lightController.displayNotification(message, 'beforeend', document.querySelector('body'));
        }
        sliders.setAttribute('data-prev-value', value.toString());
    }
});
advanceFeaturesContainer.addEventListener('click', (e) => {
    var _a;
    const selectedElement = e.target;
    if (selectedElement.closest('.close-btn')) {
        advancedSettings.closeModalPopUp();
    }
    if (selectedElement.closest('.customization-btn')) {
        advancedSettings.displayCustomization(selectedElement);
    }
    if (selectedElement.matches('.defaultOn-okay')) {
        if (!isWifiActive) {
            const notificationContainer = document.querySelector('body');
            advancedSettings.displayNotification('Wi-Fi is inactive. Please enable Wi-Fi to set automated times.', 'beforeend', notificationContainer);
            return;
        }
        advancedSettings.customizeAutomaticOnPreset(selectedElement);
    }
    if (selectedElement.matches('.defaultOff-okay')) {
        if (!isWifiActive) {
            const notificationContainer = document.querySelector('body');
            advancedSettings.displayNotification('Wi-Fi is inactive. Please enable Wi-Fi to set automated times.', 'beforeend', notificationContainer);
            return;
        }
        advancedSettings.customizeAutomaticOffPreset(selectedElement);
    }
    if ((_a = selectedElement.textContent) === null || _a === void 0 ? void 0 : _a.includes('Cancel')) {
        if (selectedElement.matches('.defaultOn-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOn');
        }
        else if (selectedElement.matches('.defaultOff-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOff');
        }
    }
});
nav.addEventListener('click', (e) => {
    const selectedElement = e.target;
    if (selectedElement.closest('.general-light-switch')) {
        if (!isWifiActive) {
            lightController.displayNotification('Wi-Fi is inactive. Please enable Wi-Fi to toggle all lights.', 'beforeend', document.querySelector('body'));
            return;
        }
        const bulbImage = generalLightSwitch.querySelector('img');
        const allLightsOn = Object.values(lightController.componentsData).every((room) => room.isLightOn);
        if (allLightsOn) {
            lightController.toggleAllLights(false);
            lightController.lightSwitchOff(bulbImage);
            lightController.displayNotification('All lights turned off', 'beforeend', document.querySelector('body'));
        }
        else {
            const anyLightWasOff = lightController.toggleAllLights(true);
            lightController.lightSwitchOn(bulbImage);
            if (anyLightWasOff) {
                lightController.displayNotification('All lights turned on', 'beforeend', document.querySelector('body'));
            }
        }
    }
    if (selectedElement.closest('.wifi-toggle')) {
        const wifiImage = wifiToggle.querySelector('img');
        isWifiActive = !isWifiActive;
        window.isWifiActive = isWifiActive;
        const wifiNotificationText = document.querySelector('.wifi_notification p');
        if (isWifiActive) {
            wifiImage.src = './assets/svgs/wifi.svg';
            wifiImage.setAttribute('data-wifiOff', './assets/svgs/wifi-disconnected.svg');
            wifiNotificationText.textContent = 'Wi-Fi is on';
            lightController.displayNotification('Wi-Fi turned on', 'beforeend', document.querySelector('body'));
            generateRandomNetworks();
        }
        else {
            wifiImage.src = './assets/svgs/wifi-disconnected.svg';
            wifiImage.setAttribute('data-wifiOff', './assets/svgs/wifi.svg');
            wifiNotificationText.textContent = 'Wi-Fi is off';
            lightController.displayNotification('Wi-Fi turned off', 'beforeend', document.querySelector('body'));
            wifiConnectionListContainer.innerHTML = '';
            lightController.addHidden(wifiConnectionListContainer);
        }
        document.querySelector('.wifi_notification img').src = isWifiActive ? './assets/svgs/wifi.svg' : './assets/svgs/wifi-disconnected.svg';
    }
});
wifiNotification.addEventListener('click', () => {
    if (!isWifiActive) {
        lightController.displayNotification('Wi-Fi is inactive. Please enable Wi-Fi to view networks.', 'beforeend', document.querySelector('body'));
        return;
    }
    if (wifiConnectionListContainer.classList.contains('hidden')) {
        lightController.removeHidden(wifiConnectionListContainer);
        generateRandomNetworks();
    }
    else {
        lightController.addHidden(wifiConnectionListContainer);
    }
});
setInterval(() => {
    if (isWifiActive && !wifiConnectionListContainer.classList.contains('hidden')) {
        generateRandomNetworks();
    }
}, 5 * 60 * 1000);
