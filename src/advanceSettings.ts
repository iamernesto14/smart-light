'use strict';

import General from './general.js';
import { ComponentData, ComponentsData } from './types';
import Light from './basicSettings.js';
// import Chart from 'chart.js/auto';

interface Timer {
  autoOn?: number;
  autoOff?: number;
}

interface Timers {
  [key: string]: Timer;
}

class AdvanceSettings extends Light {
  timers: Timers;

  constructor() {
    super();
    this.timers = {};
  }

  private markup(component: ComponentData): string {
    const { name, numOfLights, autoOn, autoOff } = component;
    return `
      <div class="advanced_features">
        <h3>Advanced features</h3>
        <section class="component_summary">
          <div>
            <p class="component_name">${this.capFirstLetter(name)}</p>
            <p class="number_of_lights">${numOfLights}</p>
          </div>
          <div>
            <p class="auto_on">
              <span>Automatic turn on:</span>
              <span>${autoOn}</span>
            </p>
            <p class="auto_off">
              <span>Automatic turn off:</span>
              <span>${autoOff}</span>
            </p>
          </div>
        </section>
        <section class="customization">
          <div class="edit">
            <p>Customize</p>
            <button class="customization-btn">
              <img src="./assets/svgs/edit.svg" alt="customize settings svg icon">
            </button>
          </div>
          <section class="customization-details hidden">
            <div>
              <h4>Automatic on/off settings</h4>
              <div class="defaultOn">
                <label for="">Turn on</label>
                <input type="time" name="autoOnTime" id="autoOnTime">
                <div>
                  <button class="defaultOn-okay">Okay</button>
                  <button class="defaultOn-cancel">Cancel</button>
                </div>
              </div>
              <div class="defaultOff">
                <label for="">Go off</label>
                <input type="time" name="autoOffTime" id="autoOffTime">
                <div>
                  <button class="defaultOff-okay">Okay</button>
                  <button class="defaultOff-cancel">Cancel</button>
                </div>
              </div>
            </div>
          </section>
          <section class="summary">
            <h3>Summary</h3>
            <div class="chart-container">
              <canvas id="myChart"></canvas>
            </div>
          </section>
          <button class="close-btn">
            <img src="./assets/svgs/close.svg" alt="close button svg icon">
          </button>
        </section>
        <button class="close-btn">
          <img src="./assets/svgs/close.svg" alt="close button svg icon">
        </button>
      </div>
    `;
  }

  // private analyticsUsage(data: number[]): void {
  //   const ctx = this.selector('#myChart') as HTMLCanvasElement;
  //   new Chart(ctx, {
  //     type: 'line',
  //     data: {
  //       labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
  //       datasets: [{
  //         label: 'Hours of usage',
  //         data,
  //         borderWidth: 1,
  //       }],
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //         },
  //       },
  //     },
  //   });
  // }

  modalPopUp(element: HTMLElement): void {
    const selectedRoom = this.getSelectedComponentName(element);
    const componentData = this.getComponent(selectedRoom || '');
    const parentElement = this.selector('.advanced_features_container') as HTMLElement;
    this.removeHidden(parentElement);

    if (!componentData) return;

    this.renderHTML(this.markup(componentData), 'afterbegin', parentElement);
    // this.analyticsUsage(componentData.usage);
  }

  displayCustomization(selectedElement: HTMLElement): void {
    const element = this.closestSelector(selectedElement, '.customization', '.customization-details') as HTMLElement;
    this.toggleHidden(element);
  }

  closeModalPopUp(): void {
    const parentElement = this.selector('.advanced_features_container') as HTMLElement;
    const childElement = this.selector('.advanced_features') as HTMLElement;

    childElement.remove();
    this.addHidden(parentElement);
  }

  customizationCancelled(selectedElement: HTMLElement, parentSelectorIdentifier: string): void {
    const element = this.closestSelector(selectedElement, parentSelectorIdentifier, 'input') as HTMLInputElement;
    element.value = '';
  }

  customizeAutomaticOnPreset(selectedElement: HTMLElement): void {
    const element = this.closestSelector(selectedElement, '.defaultOn', 'input') as HTMLInputElement;
    const { value } = element;

    if (!value || !/^\d{2}:\d{2}$/.test(value)) return;

    const component = this.getComponentData(element, '.advanced_features', '.component_name');
    if (!component) return;

    component.autoOn = value;
    element.value = '';

    const spanElement = this.closestSelector(selectedElement, '.advanced_features', '.auto_on > span:last-child') as HTMLElement;
    this.updateMarkupValue(spanElement, component.autoOn);

    this.setComponentElement(component);

    if (this.timers[component.name]?.autoOn) {
      clearInterval(this.timers[component.name].autoOn);
    }

    this.automateLight(component.autoOn, component);

    this.displayNotification(`Automatic turn on time set to ${value} for ${component.name}`, 'beforeend', document.querySelector('body') as HTMLElement);
  }

  customizeAutomaticOffPreset(selectedElement: HTMLElement): void {
    const element = this.closestSelector(selectedElement, '.defaultOff', 'input') as HTMLInputElement;
    const { value } = element;

    if (!value || !/^\d{2}:\d{2}$/.test(value)) return;

    const component = this.getComponentData(element, '.advanced_features', '.component_name');
    if (!component) return;

    component.autoOff = value;
    element.value = '';

    const spanElement = this.closestSelector(selectedElement, '.advanced_features', '.auto_off > span:last-child') as HTMLElement;
    this.updateMarkupValue(spanElement, component.autoOff);

    this.setComponentElement(component);

    if (this.timers[component.name]?.autoOff) {
      clearInterval(this.timers[component.name].autoOff);
    }

    this.automateLight(component.autoOff, component);

    this.displayNotification(`Automatic turn off time set to ${value} for ${component.name}`, 'beforeend', document.querySelector('body') as HTMLElement);
  }

  getSelectedComponent(componentName: string): ComponentData | ComponentsData {
    if (!componentName) return this.componentsData;
    return this.componentsData[componentName.toLowerCase()];
  }

  getSelectedSettings(componentName: string): string {
    const component = this.getSelectedComponent(componentName) as ComponentData;
    return this.markup(component);
  }

  setNewData<K extends keyof ComponentData>(component: keyof ComponentsData, key: K, data: ComponentData[K]): void {
    const selectedComponent = this.componentsData[component];
    selectedComponent[key] = data;
  }

  capFirstLetter(word: string): string {
    return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
  }

  getObjectDetails(): this {
    return this;
  }

  formatTime(time: string): Date {
    const [hour, min] = time.split(':');
    const dailyAlarmTime = new Date();
    dailyAlarmTime.setHours(parseInt(hour));
    dailyAlarmTime.setMinutes(parseInt(min));
    dailyAlarmTime.setSeconds(0);
    return dailyAlarmTime;
  }

  timeDifference(selectedTime: string): number {
    const now = new Date();
    const setTime = this.formatTime(selectedTime).getTime() - now.getTime();
    return setTime;
  }

  timer(time: Date, message: boolean, component: ComponentData): number {
    const checkAndTriggerAlarm = () => {
      const now = new Date();
      if (
        now.getHours() === time.getHours() &&
        now.getMinutes() === time.getMinutes() &&
        now.getSeconds() === time.getSeconds()
      ) {
        if (component.element && document.contains(component.element)) {
          const timeStr = `${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}`;
          this.toggleLightSwitch(component.element, timeStr);
          const action = component.isLightOn ? 'turned on' : 'turned off';
          this.displayNotification(`Light ${action} in ${component.name} by automation`, 'beforeend', document.querySelector('body') as HTMLElement);
        }
        clearInterval(intervalId);
        if (this.timers[component.name]) {
          const timeStr = `${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}`;
          if (component.autoOn === timeStr) {
            delete this.timers[component.name].autoOn;
          } else {
            delete this.timers[component.name].autoOff;
          }
          if (!this.timers[component.name].autoOn && !this.timers[component.name].autoOff) {
            delete this.timers[component.name];
          }
        }
      }
    };
    const intervalId = setInterval(checkAndTriggerAlarm, 1000);
    return intervalId as unknown as number;
  }

  automateLight(time: string, component: ComponentData): void {
    const formattedTime = this.formatTime(time);
    const intervalId = this.timer(formattedTime, true, component);
    if (!this.timers[component.name]) {
      this.timers[component.name] = {};
    }
    const isAutoOn = component.autoOn === time;
    this.timers[component.name][isAutoOn ? 'autoOn' : 'autoOff'] = intervalId;
  }
}

export default AdvanceSettings;