class General {
    componentsData = {
        hall: { name: 'hall', lightIntensity: 5, numOfLights: 6, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [22, 11, 12, 10, 12, 17, 22] }, 
        bedroom: { name: 'bedroom', lightIntensity: 5,  numOfLights: 3, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [18, 5, 7, 5, 6, 6, 18] },
        bathroom: { name: 'bathroom', lightIntensity: 5,  numOfLights: 1, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [2, 1, 1, 1, 1, 3, 3] },
        ['outdoor lights']: { name: 'outdoor lights', lightIntensity: 5,  numOfLights: 6, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [15, 12, 13, 9, 12, 13, 18] },
        ['guest room']: { name: 'guest room', lightIntensity: 5,  numOfLights: 4, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 10, 3, 9, 5, 5, 18] },
        kitchen: { name: 'kitchen', lightIntensity: 5,  numOfLights: 3, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 19, 13, 11, 12, 13, 18] },
        [['walkway & corridor']]: { name: 'walkway & corridor', lightIntensity: 5,  numOfLights: 8, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 19, 13, 15, 22, 23, 18] },
    }

    wifiConnections = [
        {id: 0, wifiName: 'Inet service', signal: 'excellent'},
        {id: 1, wifiName: 'Kojo_kwame121', signal: 'poor'},
        {id: 2, wifiName: 'spicyalice', signal: 'good'},
        {id: 3, wifiName: 'virus', signal: 'good'},
    ]

    constructor () {
        this.isLightOn = false;
        this.lightIntensity = 5;
    }

    getComponent(name) {
        return this.componentsData[name];
    }

    getWifi() {
        return this.wifiConnections;
    }

    getSelectedComponentName(element, ancestorIdentifier='.rooms', elementSelector='p') {
        const selectedElement = this.closestSelector(element, ancestorIdentifier, elementSelector);
        const name = selectedElement.textContent.toLowerCase();
        return name;
    }

    getComponentData(element, ancestorIdentifier, childElement) {
        const room = this.getSelectedComponentName(element, ancestorIdentifier, childElement);
        const data = this.getComponent(room);
        return data;
    }

    renderHTML (element, position, container) {
        container.insertAdjacentHTML(position, element);
    }

    notification (message) {
        return `
            <div class="notification">
                <p>${message}</p>
            </div>
        `;

    }

    displayNotification (message, position, container) {
        const html = this.notification(message);
        this.renderHTML(html, position, container);
    }

    removeNotification (element) {
        setTimeout(() => {
            element.remove();
        }, 2000);
    }

    selector(identifier) {
        return document.querySelector(identifier);       
    }

    closestSelector(selectedElement, ancestorIdentifier, childSelector) {
        const closestAncestor = selectedElement.closest(ancestorIdentifier);
        return closestAncestor ? closestAncestor.querySelector(childSelector) : null;
    }

    handleLightIntensity(element, lightIntensity) {
        element.style.filter = `brightness(${lightIntensity})`;
    }

    updateComponentData(data) {
        this.componentsData
    }

    updateMarkupValue(element, value) {
        element.textContent = value;
    }

    toggleHidden(element) {
        element.classList.toggle('hidden');
    }

    removeHidden(element) {
        element.classList.remove('hidden');
    }
    addHidden(element) {
        element.classList.add('hidden');
    }

    setComponentElement(roomData) {
        let parent; 
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
        
        const buttonElement = parent.querySelector('.light-switch');

        if (roomData['element']) return;
        
        roomData['element'] = buttonElement;
    }

    formatTextToClassName(name) {
        const words = name.split(' ');
        const newWord = words.join('_');
        return newWord;
    }
}

export default General