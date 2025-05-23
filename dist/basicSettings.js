'use strict';
import General from './general.js';
class Light extends General {
    constructor() {
        super();
        this.notificationTimer = null;
    }
    notification(message) {
        return `
      <div class="notification">
        <div>
          <img src="./assets/svgs/checked.svg" alt="checked svg icon on notifications">
        </div>
        <p>${message}</p>
        <button class="notification-close">✕</button>
      </div>
    `;
    }
    displayNotification(message, position, container) {
        const existingNotification = container.querySelector('.notification');
        if (existingNotification) {
            const messageElement = existingNotification.querySelector('p');
            if (messageElement) {
                messageElement.textContent = message;
            }
            if (this.notificationTimer) {
                clearTimeout(this.notificationTimer);
            }
            this.notificationTimer = setTimeout(() => {
                existingNotification.remove();
                this.notificationTimer = null;
            }, 5000);
            return;
        }
        const html = this.notification(message);
        this.renderHTML(html, position, container);
        const notificationElement = container.querySelector('.notification:last-child');
        const closeButton = notificationElement.querySelector('.notification-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                notificationElement.remove();
                if (this.notificationTimer) {
                    clearTimeout(this.notificationTimer);
                    this.notificationTimer = null;
                }
            });
        }
        this.notificationTimer = setTimeout(() => {
            notificationElement.remove();
            this.notificationTimer = null;
        }, 5000);
    }
    removeNotification(element) {
        setTimeout(() => {
            element.remove();
        }, 5000);
    }
    lightSwitchOn(lightButtonElement) {
        lightButtonElement.setAttribute('src', './assets/svgs/light_bulb.svg');
        lightButtonElement.setAttribute('data-lightOn', './assets/svgs/light_bulb_off.svg');
    }
    lightSwitchOff(lightButtonElement) {
        lightButtonElement.setAttribute('src', './assets/svgs/light_bulb_off.svg');
        lightButtonElement.setAttribute('data-lightOn', './assets/svgs/light_bulb.svg');
    }
    lightComponentSelectors(lightButtonElement) {
        const room = this.getSelectedComponentName(lightButtonElement);
        const componentData = this.getComponent(room || '');
        const childElement = lightButtonElement.firstElementChild;
        const background = this.closestSelector(lightButtonElement, '.rooms', 'img');
        return { room, componentData, childElement, background };
    }
    toggleLightSwitch(lightButtonElement, timeStr = false) {
        const { componentData: component, childElement, background } = this.lightComponentSelectors(lightButtonElement);
        const slider = this.closestSelector(lightButtonElement, '.rooms', '#light_intensity');
        if (!component || !childElement || !background || !slider)
            return;
        if (!timeStr && !window.isWifiActive) {
            this.displayNotification('Wi-Fi is inactive. Please enable Wi-Fi to toggle lights.', 'beforeend', document.querySelector('body'));
            return;
        }
        component.isLightOn = !component.isLightOn;
        if (component.isLightOn) {
            this.lightSwitchOn(childElement);
            component.lightIntensity = component.lightIntensity > 0 ? component.lightIntensity : 5;
            const lightIntensity = component.lightIntensity / 10;
            this.handleLightIntensity(background, lightIntensity);
            slider.value = component.lightIntensity.toString();
        }
        else {
            this.lightSwitchOff(childElement);
            this.handleLightIntensity(background, 0);
            slider.value = '0';
        }
        if (!timeStr) {
            const action = component.isLightOn ? 'turned on' : 'turned off';
            const message = `Light ${action} in ${component.name}`;
            this.displayNotification(message, 'beforeend', document.querySelector('body'));
        }
    }
    toggleAllLights(turnOn) {
        const lightSwitches = document.querySelectorAll('.light-switch');
        let anyLightWasOff = false;
        lightSwitches.forEach((lightSwitch) => {
            const { componentData: component, childElement, background } = this.lightComponentSelectors(lightSwitch);
            const slider = this.closestSelector(lightSwitch, '.rooms', '#light_intensity');
            if (!component || !childElement || !background || !slider)
                return;
            if (turnOn && !component.isLightOn) {
                component.isLightOn = true;
                this.lightSwitchOn(childElement);
                component.lightIntensity = component.lightIntensity > 0 ? component.lightIntensity : 5;
                const lightIntensity = component.lightIntensity / 10;
                this.handleLightIntensity(background, lightIntensity);
                slider.value = component.lightIntensity.toString();
                anyLightWasOff = true;
            }
            else if (!turnOn) {
                component.isLightOn = false;
                this.lightSwitchOff(childElement);
                this.handleLightIntensity(background, 0);
                slider.value = '0';
            }
        });
        return anyLightWasOff;
    }
    handleLightIntensitySlider(element, intensity) {
        const { componentData, background } = this.lightComponentSelectors(element);
        const lightSwitch = this.closestSelector(element, '.rooms', '.light-switch');
        if (!componentData || isNaN(intensity) || intensity < 0 || intensity > 10)
            return;
        componentData.lightIntensity = intensity;
        componentData.isLightOn = intensity > 0;
        const lightIntensity = intensity / 10;
        this.handleLightIntensity(background, lightIntensity);
        this.sliderLight(componentData.isLightOn, lightSwitch);
    }
    sliderLight(isLightOn, lightButtonElement) {
        const { childElement } = this.lightComponentSelectors(lightButtonElement);
        if (!childElement)
            return;
        if (isLightOn) {
            this.lightSwitchOn(childElement);
        }
        else {
            this.lightSwitchOff(childElement);
        }
    }
}
export default Light;
