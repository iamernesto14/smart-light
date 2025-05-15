import { describe, it, expect, beforeEach } from '@jest/globals';
import General from '../general';
import { ComponentData } from '../types';

describe('General', () => {
  let general: General;

  beforeEach(() => {
    general = new General();
    document.body.innerHTML = ''; // Reset DOM
  });

  // Existing tests
  it('getComponent returns correct component data', () => {
    const component: ComponentData | undefined = general.getComponent('hall');
    expect(component).toBeDefined();
    expect(component?.name).toBe('hall');
    expect(component?.lightIntensity).toBe(5);
    expect(component?.isLightOn).toBe(false);
  });

  it('getComponent returns undefined for invalid component', () => {
    const component = general.getComponent('invalid');
    expect(component).toBeUndefined();
  });

  it('displayNotification adds notification to DOM', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    general.displayNotification('Test message', 'beforeend', container);

    const notification = container.querySelector('.notification p');
    expect(notification).not.toBeNull();
    expect(notification?.textContent).toBe('Test message');
  });

  // New tests
  it('renderHTML inserts HTML at specified position', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const html = '<p>Test</p>';
    general.renderHTML(html, 'beforeend', container);

    expect(container.innerHTML).toBe('<p>Test</p>');
  });

  it('handleLightIntensity sets brightness filter', () => {
    const element = document.createElement('img');
    general.handleLightIntensity(element, 0.5);

    expect(element.style.filter).toBe('brightness(0.5)');
  });

  it('handleLightIntensity ignores invalid intensity', () => {
    const element = document.createElement('img');
    element.style.filter = 'brightness(1)';
    general.handleLightIntensity(element, NaN);

    expect(element.style.filter).toBe('brightness(1)');
  });

  it('getSelectedComponentName retrieves room name', () => {
    document.body.innerHTML = `
      <div class="rooms">
        <p>hall</p>
        <div class="light-switch"></div>
      </div>
    `;
    const lightSwitch = document.querySelector('.light-switch') as HTMLElement;
    const name = general.getSelectedComponentName(lightSwitch);

    expect(name).toBe('hall');
  });

  it('getSelectedComponentName returns null if no name found', () => {
    document.body.innerHTML = `
      <div class="rooms">
        <div class="light-switch"></div>
      </div>
    `;
    const lightSwitch = document.querySelector('.light-switch') as HTMLElement;
    const name = general.getSelectedComponentName(lightSwitch);

    expect(name).toBeNull();
  });

  it('closestSelector finds closest matching element', () => {
    document.body.innerHTML = `
      <div class="rooms">
        <div class="light-switch">
          <img src="bulb.png">
        </div>
      </div>
    `;
    const img = document.querySelector('img') as HTMLElement;
    const lightSwitch = general.closestSelector(img, '.rooms', '.light-switch') as HTMLElement;

    expect(lightSwitch).not.toBeNull();
    expect(lightSwitch.classList.contains('light-switch')).toBe(true);
  });

  it('closestSelector returns null if no match found', () => {
    document.body.innerHTML = `
      <div class="rooms">
        <div class="light-switch">
          <img src="bulb.png">
        </div>
      </div>
    `;
    const img = document.querySelector('img') as HTMLElement;
    const result = general.closestSelector(img, '.rooms', '.missing');

    expect(result).toBeNull();
  });
});