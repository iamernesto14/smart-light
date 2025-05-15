# Bug Documentation

## Bug 1: Slider Functionality

### Description
The slider for adjusting light intensity in each room does not update the light intensity in real-time as the user moves it. The light intensity only updates after the user releases the slider, and the light is incorrectly turned off for non-zero intensity values. Additionally, the slider functions even when Wi-Fi is inactive, and the brightness scaling is inconsistent.

### Symptoms
- Light intensity does not update while dragging the slider.
- Slider input is ignored due to string-to-number type mismatch.
- Light turns off when adjusting to non-zero intensity.
- Inconsistent brightness changes in the room’s background image.
- Slider works when Wi-Fi is inactive, which should be blocked.

### Steps to Reproduce
1. Open the application and click "Click to begin" to access the room controls.
2. Select a room (e.g., Hall) and move its light intensity slider.
3. Observe that the background brightness does not change while dragging, only after releasing.
4. Move the slider to a non-zero value (e.g., 7) and note that the light bulb icon turns off.
5. Disable Wi-Fi (set `isWifiActive = false` in `main.js`) and verify that the slider still adjusts the UI.

### Fix Applied
- **main.js**:
  - Changed the event listener from `change` to `input` to capture real-time slider movements.
  - Parsed `slider.value` to a number using `parseInt(slider.value, 10)`.
  - Added a check for `isWifiActive` to block slider actions when Wi-Fi is off, displaying a notification.
  - Added `slider.matches('#light_intensity')` to ensure only range inputs trigger the handler.
- **basicSettings.js**:
  - Updated `handleLightIntensitySlider` to set `isLightOn = true` for `intensity > 0`.
  - Added validation for `isNaN(intensity)` and range `0 <= intensity <= 10`.
  - Simplified `sliderLight` to only update the light switch icon, with brightness handled in `handleLightIntensitySlider`.
  - Ensured brightness is scaled consistently by passing `intensity / 10` to `handleLightIntensity`.
  - Fixed notification auto-removal in `displayNotification`.
- **general.js**:
  - Modified `handleLightIntensity` to validate `lightIntensity` and bound it between 0 and 1 for the CSS `brightness` filter.

### Files Modified
- `main.js`: Updated event listener and added Wi-Fi check.
- `basicSettings.js`: Fixed logic in `handleLightIntensitySlider` and `sliderLight`.
- `general.js`: Improved `handleLightIntensity` for consistent scaling.
- `Bugs.md`: Created to document the bug and fix.

### Status
Fixed and tested. The slider now updates light intensity in real-time, respects Wi-Fi dependency, and provides consistent brightness scaling.

## Bug 2: Light Switch

### Description
The light switch (light bulb icon) for each room toggles the light on or off but does not respect Wi-Fi dependency, fails for rooms with multi-word names (e.g., "guest room"), lacks notifications for toggle actions, and resets the slider to a fixed intensity (5) when turning the light on, ignoring previous settings. Additionally, multiple notifications stack when toggling lights in different rooms quickly, instead of updating the existing notification.

### Symptoms
- Light switch toggles lights when Wi-Fi is inactive.
- Light switch fails to toggle lights for rooms like "guest room", "outdoor lights", or "walkway & corridor".
- No notification appears when toggling the light switch initially; after adding notifications, multiple notifications stack on top of each other.
- Slider resets to intensity 5 when turning the light on, even if previously set to a different value (e.g., 8).
- Potential errors if DOM elements or room data are missing.

### Steps to Reproduce
1. Open the application and click "Click to begin" to access the room controls.
2. Click the light switch for a room like "guest room" and observe that the light does not toggle.
3. Disable Wi-Fi (set `isWifiActive = false` in `main.js`) and click a light switch (e.g., for "hall"); note that it still toggles.
4. Set the slider for a room (e.g., "hall") to 8, turn the light off, then on, and observe the slider resets to 5.
5. Click the light switch for one room (e.g., "hall"), then quickly for another (e.g., "bedroom"), and note that multiple notifications stack.
6. Remove a room’s `<p>` element in the DOM and click its light switch to simulate missing data, potentially causing errors.

### Fix Applied
#### Main Light Switch Issues
- **main.js**:
  - Added a check for `isWifiActive` to block light switch toggles when Wi-Fi is off, displaying a notification.
  - Added a notification after toggling the light switch, showing the room name and light state (on/off).
- **basicSettings.js**:
  - Modified `toggleLightSwitch` to preserve the last non-zero `lightIntensity` when turning the light on, defaulting to 5 only if the current intensity is 0.
  - Added edge case handling to check for missing `componentData`, `childElement`, `background`, and `slider`.
- **general.js**:
  - Updated `getSelectedComponentName` to handle multi-word room names by checking against a list of known names (`['outdoor lights', 'guest room', 'walkway & corridor']`) and returning the correct key for `componentsData`.
  - Added a null check for missing DOM elements.

#### Notification Stacking Sub-Issue
- **basicSettings.js**:
  - Updated `displayNotification` to check for an existing `.notification` element in the container.
  - If found, updated the `<p>` element’s text with the new message and reset the 5-second removal timer using `clearTimeout` and a new `setTimeout`.
  - If not found, created a new notification with a 5-second removal timer.
  - Added `notificationTimer` property in the constructor to store the timer ID for clearing.
  - Kept `removeNotification` for compatibility but no longer called directly.

### Files Modified
- `main.js`: Added Wi-Fi check and notification for light switch toggles.
- `basicSettings.js`: Updated `toggleLightSwitch` for intensity preservation, edge case handling, and fixed notification stacking in `displayNotification`.
- `general.js`: Fixed `getSelectedComponentName` for multi-word room names.
- `Bugs.md`: Updated to document the light switch bug, including the notification stacking sub-issue.

### Status
Fixed and tested. The light switch now respects Wi-Fi dependency, works for all rooms, displays a single updating notification, preserves slider intensity, and handles edge cases robustly.

## Bug 3: Time Display Not Updating in Advanced Settings
- **Description**: In the Advanced Settings modal (`.advanced_features_container`), the displayed automation times (e.g., “Light On: 18:00” in `.auto_on` or `.auto_off`) may not update after the user sets a new time via `.defaultOn-okay` or `.defaultOff-okay`. The UI might show the previous time or fail to parse the `<input type="time">` value in `advanceSettings.js`.
- **Impact**: Users cannot confirm their automation settings, potentially causing lights to turn on/off at incorrect times.
- **Fix**: In `advanceSettings.js`, modify `customizeAutomaticOnPreset` and `customizeAutomaticOffPreset` to update the `.component_summary` UI (e.g., `.auto_on span:last-child`) with the new time input value after saving. Validate time input parsing and refresh the modal content.
- **Status**: Pending confirmation; test by setting new times and checking UI updates.
