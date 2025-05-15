'use strict';

import { ComponentData, ComponentsData } from './types';

interface WifiConnection {
  id: number;
  wifiName: string;
  signal: string;
}

class General {
  componentsData: ComponentsData = {
    hall: { name: 'hall', lightIntensity: 5, numOfLights: 6, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [22, 11, 12, 10, 12, 17, 22] },
    bedroom: { name: 'bedroom', lightIntensity: 5, numOfLights: 3, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [18, 5, 7, 5, 6, 6, 18] },
    bathroom: { name: 'bathroom', lightIntensity: 5, numOfLights: 1, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [2, 1, 1, 1, 1, 3, 3] },
    'outdoor lights': { name: 'outdoor lights', lightIntensity: 5, numOfLights: 6, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [15, 12, 13, 9, 12, 13, 18] },
    'guest room': { name: 'guest room', lightIntensity: 5, numOfLights: 4, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 10, 3, 9, 5, 5, 18] },
    kitchen: { name: 'kitchen', lightIntensity: 5, numOfLights: 3, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 19, 13, 11, 12, 13, 18] },
    'walkway & corridor': { name: 'walkway & corridor', lightIntensity: 5, numOfLights: 8, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 19, 13, 15, 22, 23, 18] },
  };

  wifiConnections: WifiConnection[] = [
    { id: 0, wifiName: 'Inet service', signal: 'excellent' },
    { id: 1, wifiName: 'Kojo_kwame121', signal: 'poor' },
    { id: 2, wifiName: 'spicyalice', signal: 'good' },
    { id: 3, wifiName: 'virus', signal: 'good' },
  ];

  isLightOn: boolean;
  lightIntensity: number;

  constructor() {
    this.isLightOn = false;
    this.lightIntensity = 5;
  }

  getComponent(name: string): ComponentData | undefined {
    return this.componentsData[name];
  }

  getWifi(): WifiConnection[] {
    return this.wifiConnections;
  }

  getSelectedComponentName(element: HTMLElement, ancestorIdentifier: string = '.rooms', elementSelector: string = 'p'): string | null {
    const selectedElement = this.closestSelector(element, ancestorIdentifier, elementSelector);
    if (!selectedElement) return null;
    const name = selectedElement.textContent?.toLowerCase() || '';
    const normalizedName = ['outdoor lights', 'guest room', 'walkway & corridor'].includes(name)
      ? name
      : name.replace(/\s+/, '');
    return normalizedName;
  }

  getComponentData(element: HTMLElement, ancestorIdentifier: string, childElement: string): ComponentData | undefined {
    const room = this.getSelectedComponentName(element, ancestorIdentifier, childElement);
    return room ? this.getComponent(room) : undefined;
  }

  renderHTML(element: string, position: InsertPosition, container: HTMLElement): void {
    container.insertAdjacentHTML(position, element);
  }

  notification(message: string): string {
    return `
      <div class="notification">
        <p>${message}</p>
      </div>
    `;
  }

  displayNotification(message: string, position: InsertPosition, container: HTMLElement): void {
    const html = this.notification(message);
    this.renderHTML(html, position, container);
  }

  removeNotification(element: HTMLElement): void {
    setTimeout(() => {
      element.remove();
    }, 2000);
  }

  selector(identifier: string): HTMLElement | null {
    return document.querySelector(identifier);
  }

  closestSelector(selectedElement: HTMLElement, ancestorIdentifier: string, childSelector: string): HTMLElement | null {
    const closestAncestor = selectedElement.closest(ancestorIdentifier);
    return closestAncestor ? closestAncestor.querySelector(childSelector) : null;
  }

  handleLightIntensity(element: HTMLElement, lightIntensity: number): void {
    if (typeof lightIntensity !== 'number' || isNaN(lightIntensity)) return;
    const boundedIntensity = Math.max(0, Math.min(1, lightIntensity));
    element.style.filter = `brightness(${boundedIntensity})`;
  }

  updateComponentData(data: ComponentsData): void {
    this.componentsData = data;
  }

  updateMarkupValue(element: HTMLElement, value: string): void {
    element.textContent = value;
  }

  toggleHidden(element: HTMLElement): void {
    element.classList.toggle('hidden');
  }

  removeHidden(element: HTMLElement): void {
    element.classList.remove('hidden');
  }

  addHidden(element: HTMLElement): void {
    element.classList.add('hidden');
  }

  setComponentElement(roomData: ComponentData): void {
    let parent: HTMLElement | null;
    if (roomData.name === 'walkway & corridor') {
      parent = this.selector('.corridor');
    } else if (roomData.name === 'guest room') {
      const elementClassName = this.formatTextToClassName(roomData.name);
      parent = this.selector(`.${elementClassName}`);
    } else if (roomData.name === 'outdoor lights') {
      parent = this.selector('.outside_lights');
    } else {
      parent = this.selector(`.${roomData.name}`);
    }

    const buttonElement = parent?.querySelector('.light-switch') as HTMLElement | null;

    if (roomData.element || !buttonElement) return;

    roomData.element = buttonElement;
  }

  formatTextToClassName(name: string): string {
    const words = name.split(' ');
    return words.join('_');
  }
}

export default General;