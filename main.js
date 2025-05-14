'use strict';

// elements declarations
const homepageButton = document.querySelector('.entry_point');
const homepage = document.querySelector('main');
const mainRoomsContainer = document.querySelector('.application_container');
const advanceFeaturesContainer = document.querySelector('.advanced_features_container');
const nav = document.querySelector('nav');
const loader = document.querySelector('.loader-container');
const generalLightSwitch = document.querySelector('.general-light-switch');

// imports
import Light from './js/basicSettings.js';
import AdvanceSettings from './js/advanceSettings.js';

// object creation
const lightController = new Light();
const advancedSettings = new AdvanceSettings();

// global variables
let selectedComponent;
let isWifiActive = true;
window.isWifiActive = isWifiActive; // Expose for basicSettings.js

// Event handlers
// hide homepage after button is clicked
homepageButton.addEventListener('click', function(e) {
    lightController.addHidden(homepage);
    lightController.removeHidden(loader);
    
    setTimeout(() => {
        lightController.removeHidden(mainRoomsContainer);
        lightController.removeHidden(nav);
    }, 1000);
});

mainRoomsContainer.addEventListener('click', (e) => {
    const selectedElement = e.target;

    // when click occurs on light switch
    if (selectedElement.closest(".light-switch")) {
        if (!isWifiActive) {
            lightController.displayNotification('Wi-Fi is inactive. Please enable Wi-Fi to toggle lights.', 'beforeend', document.querySelector('body'));
            return;
        }
        const lightSwitch = selectedElement.closest(".basic_settings_buttons").firstElementChild;
        lightController.toggleLightSwitch(lightSwitch);
        const roomName = lightController.getSelectedComponentName(lightSwitch);
        const message = `Light ${lightController.getComponent(roomName).isLightOn ? 'turned on' : 'turned off'} in ${roomName}`;
        lightController.displayNotification(message, 'beforeend', document.querySelector('body'));
        return;
    }

    // when click occurs on advance modal
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
        lightController.handleLightIntensitySlider(sliders, value);
    }
});

// advance settings modal
advanceFeaturesContainer.addEventListener('click', (e) => {
    const selectedElement = e.target;

    if (selectedElement.closest('.close-btn')) {
       advancedSettings.closeModalPopUp();
    }

    // display customization markup
    if (selectedElement.closest('.customization-btn')) {
        advancedSettings.displayCustomization(selectedElement);
    }

    // set light on time customization
    if (selectedElement.matches('.defaultOn-okay')) {
        if (!isWifiActive) {
            const notificationContainer = document.querySelector('body');
            advancedSettings.displayNotification('Wi-Fi is inactive. Please enable Wi-Fi to set automated times.', 'beforeend', notificationContainer);
            return;
        }
        advancedSettings.customizeAutomaticOnPreset(selectedElement);
    }
    
    // set light off time customization
    if (selectedElement.matches('.defaultOff-okay')) {
        if (!isWifiActive) {
            const notificationContainer = document.querySelector('body');
            advancedSettings.displayNotification('Wi-Fi is inactive. Please enable Wi-Fi to set automated times.', 'beforeend', notificationContainer);
            return;
        }
        advancedSettings.customizeAutomaticOffPreset(selectedElement);
    }

    // cancel light time customization
    if (selectedElement.textContent.includes("Cancel")) {
        if (selectedElement.matches('.defaultOn-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOn');
        } else if (selectedElement.matches('.defaultOff-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOff');
        }
    }
});

// general light switch
nav.addEventListener('click', (e) => {
    const selectedElement = e.target;
    if (selectedElement.closest('.general-light-switch')) {
        if (!isWifiActive) {
            lightController.displayNotification('Wi-Fi is inactive. Please enable Wi-Fi to toggle all lights.', 'beforeend', document.querySelector('body'));
            return;
        }
        const bulbImage = generalLightSwitch.querySelector('img');
        const allLightsOn = Object.values(lightController.componentsData).every(room => room.isLightOn);
        
        if (allLightsOn) {
            // Turn all lights off
            lightController.toggleAllLights(false);
            lightController.lightSwitchOff(bulbImage);
            lightController.displayNotification('All lights turned off', 'beforeend', document.querySelector('body'));
        } else {
            // Turn on only lights that are off
            const anyLightWasOff = lightController.toggleAllLights(true);
            lightController.lightSwitchOn(bulbImage);
            if (anyLightWasOff) {
                lightController.displayNotification('All lights turned on', 'beforeend', document.querySelector('body'));
            }
        }
    }
});