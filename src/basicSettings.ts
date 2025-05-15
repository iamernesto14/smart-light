'use strict';

import General from './general';
import { ComponentData } from './types';

declare global {
  interface Window {
    isWifiActive: boolean;
  }
}

class Light extends General {
  notificationTimer: number | null;

  constructor() {
    super();
    this.notificationTimer = null;
  }

  notification(message: string): string {
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

  displayNotification(message: string, position: InsertPosition, container: HTMLElement): void {
    const existingNotification = container.querySelector('.notification') as HTMLElement | null;
    if (existingNotification) {
      const messageElement = existingNotification.querySelector('p') as HTMLElement | null;
      if (messageElement) {
        messageElement.textContent = message;
      }
      if (this.notificationTimer) {
        clearTimeout(this.notificationTimer);
      }
      this.notificationTimer = setTimeout(() => {
        existingNotification.remove();
        this.notificationTimer = null;
      }, 5000) as unknown as number;
      return;
    }
    const html = this.notification(message);
    this.renderHTML(html, position, container);
    const notificationElement = container.querySelector('.notification:last-child') as HTMLElement;
    const closeButton = notificationElement.querySelector('.notification-close') as HTMLButtonElement;
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
    }, 5000) as unknown as number;
  }

  removeNotification(element: HTMLElement): void {
    setTimeout(() => {
      element.remove();
    }, 5000);
  }

  lightSwitchOn(lightButtonElement: HTMLImageElement): void {
    lightButtonElement.setAttribute('src', './assets/svgs/light_bulb.svg');
    lightButtonElement.setAttribute('data-lightOn', './assets/svgs/light_bulb_off.svg');
  }

  lightSwitchOff(lightButtonElement: HTMLImageElement): void {
    lightButtonElement.setAttribute('src', './assets/svgs/light_bulb_off.svg');
    lightButtonElement.setAttribute('data-lightOn', './assets/svgs/light_bulb.svg');
  }

  lightComponentSelectors(lightButtonElement: HTMLElement): {
    room: string | null;
    componentData: ComponentData | undefined;
    childElement: HTMLImageElement | null;
    background: HTMLImageElement | null;
  } {
    const room = this.getSelectedComponentName(lightButtonElement);
    const componentData = this.getComponent(room || '');
    const childElement = lightButtonElement.firstElementChild as HTMLImageElement | null;
    const background = this.closestSelector(lightButtonElement, '.rooms', 'img') as HTMLImageElement | null;
    return { room, componentData, childElement, background };
  }

  toggleLightSwitch(lightButtonElement: HTMLElement, timeStr: string | false = false): void {
    const { componentData: component, childElement, background } = this.lightComponentSelectors(lightButtonElement);
    const slider = this.closestSelector(lightButtonElement, '.rooms', '#light_intensity') as HTMLInputElement | null;

    if (!component || !childElement || !background || !slider) return;

    if (!timeStr && !window.isWifiActive) {
      this.displayNotification('Wi-Fi is inactive. Please enable Wi-Fi to toggle lights.', 'beforeend', document.querySelector('body') as HTMLElement);
      return;
    }

    component.isLightOn = !component.isLightOn;

    if (component.isLightOn) {
      this.lightSwitchOn(childElement);
      component.lightIntensity = component.lightIntensity > 0 ? component.lightIntensity : 5;
      const lightIntensity = component.lightIntensity / 10;
      this.handleLightIntensity(background, lightIntensity);
      slider.value = component.lightIntensity.toString();
    } else {
      this.lightSwitchOff(childElement);
      this.handleLightIntensity(background, 0);
      slider.value = '0';
    }

    if (!timeStr) {
      const action = component.isLightOn ? 'turned on' : 'turned off';
      const message = `Light ${action} in ${component.name}`;
      this.displayNotification(message, 'beforeend', document.querySelector('body') as HTMLElement);
    }
  }

  toggleAllLights(turnOn: boolean): boolean {
    const lightSwitches = document.querySelectorAll('.light-switch') as NodeListOf<HTMLElement>;
    let anyLightWasOff = false;

    lightSwitches.forEach((lightSwitch) => {
      const { componentData: component, childElement, background } = this.lightComponentSelectors(lightSwitch);
      const slider = this.closestSelector(lightSwitch, '.rooms', '#light_intensity') as HTMLInputElement | null;

      if (!component || !childElement || !background || !slider) return;

      if (turnOn && !component.isLightOn) {
        component.isLightOn = true;
        this.lightSwitchOn(childElement);
        component.lightIntensity = component.lightIntensity > 0 ? component.lightIntensity : 5;
        const lightIntensity = component.lightIntensity / 10;
        this.handleLightIntensity(background, lightIntensity);
        slider.value = component.lightIntensity.toString();
        anyLightWasOff = true;
      } else if (!turnOn) {
        component.isLightOn = false;
        this.lightSwitchOff(childElement);
        this.handleLightIntensity(background, 0);
        slider.value = '0';
      }
    });

    return anyLightWasOff;
  }

  handleLightIntensitySlider(element: HTMLInputElement, intensity: number): void {
    const { componentData, background } = this.lightComponentSelectors(element);
    const lightSwitch = this.closestSelector(element, '.rooms', '.light-switch') as HTMLElement | null;

    if (!componentData || isNaN(intensity) || intensity < 0 || intensity > 10) return;

    componentData.lightIntensity = intensity;
    componentData.isLightOn = intensity > 0;

    const lightIntensity = intensity / 10;
    this.handleLightIntensity(background as HTMLImageElement, lightIntensity);
    this.sliderLight(componentData.isLightOn, lightSwitch as HTMLElement);
  }

  sliderLight(isLightOn: boolean, lightButtonElement: HTMLElement): void {
    const { childElement } = this.lightComponentSelectors(lightButtonElement);

    if (!childElement) return;

    if (isLightOn) {
      this.lightSwitchOn(childElement);
    } else {
      this.lightSwitchOff(childElement);
    }
  }
}

export default Light;