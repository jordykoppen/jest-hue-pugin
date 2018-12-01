import { HueApi, lightState } from 'node-hue-api'

class HueSyncPlugin {
  constructor ({ config: { user, host, brightness } }) {
    this.hueApi = new HueApi(host, user)
    this.brightness = brightness
    this.enabled = true
  }
  // Add hooks to Jest lifecycle events
  apply (jestHooks) {
    jestHooks.onTestRunComplete(({ success }) => {
      const { enabled, brightness, hueApi } = this.brightness
      if (enabled) {
        if (success) {
          const state = lightState.create().on().hsl(100, 100, brightness || 50)
          hueApi.setLightState(2, state)
        } else if (!success) {
          const state = lightState.create().on().hsl(0, 100, brightness || 50)
          hueApi.setLightState(2, state)
        }
      }
    })
  }

  // Get the prompt information for interactive plugins
  getUsageInfo (globalConfig) {}

  // Executed when the key from `getUsageInfo` is input
  run (globalConfig, updateConfigAndRun) {}
}

module.exports = HueSyncPlugin
