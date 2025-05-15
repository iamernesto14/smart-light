import Light from '../basicSettings';
import General from '../general';

describe('Light Class', () => {
  let light: Light;

  beforeEach(() => {
    light = new Light();
    document.body.innerHTML = `
      <div class="rooms">
      <p>Hall</p>
      <div class="basic_settings_buttons">
        <button class="light-switch">
          <img src="./assets/svgs/light_bulb_off.svg" data-lightOn="./assets/svgs/light_bulb.svg">
        </button>
      </div>
      <input type="range" id="light_intensity" min="0" max="10" value="5">
      <img class="room-background" src="" style="filter: brightness(0)">
    </div>
    <div class="notification-container"></div>
    `;

    const hallComponent = light.getComponent('hall');
  if (hallComponent) {
    hallComponent.element = document.querySelector('.light-switch') as HTMLElement;
  }
  });

  test('should extend General class', () => {
    expect(light instanceof General).toBe(true);
  });

  test('toggleLightSwitch should toggle light state', () => {
    const lightSwitch = document.querySelector('.light-switch') as HTMLElement;
    const img = lightSwitch.querySelector('img') as HTMLImageElement;
    const component = light.getComponent('hall');
    
    // Initial state
    expect(component?.isLightOn).toBe(false);
    expect(img.src).toContain('light_bulb_off.svg');
    
    // First toggle - turn on
    light.toggleLightSwitch(lightSwitch);
    expect(component?.isLightOn).toBe(true);
    expect(img.src).toContain('light_bulb.svg');
    
    // Second toggle - turn off
    light.toggleLightSwitch(lightSwitch);
    expect(component?.isLightOn).toBe(false);
    expect(img.src).toContain('light_bulb_off.svg');
  });


  test('handleLightIntensitySlider should update light intensity', () => {
    const slider = document.getElementById('light_intensity') as HTMLInputElement;
    const component = light.getComponent('hall');
    
    slider.value = '8';
    light.handleLightIntensitySlider(slider, 8);
    
    expect(component?.lightIntensity).toBe(8);
    expect(component?.isLightOn).toBe(true);
  });

  test('displayNotification should show notification', () => {
    const container = document.querySelector('.notification-container') as HTMLElement;
    light.displayNotification('Test message', 'beforeend', container);
    
    const notification = container.querySelector('.notification');
    expect(notification).toBeDefined();
    expect(notification?.textContent).toContain('Test message');
  });

});