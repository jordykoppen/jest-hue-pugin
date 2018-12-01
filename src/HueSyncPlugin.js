import { PatternPrompt } from 'jest-watcher'
import { HueApi, lightState } from 'node-hue-api'
import HueSyncPrompt from './HueSyncPrompt'

class HueSyncPlugin {
  hueApi = undefined
  prompt = undefined
  lightId = undefined
  brightness = 50
  enabled = true
  usageInfo = { key: 'h', prompt: 'for hue sync settings' }

  constructor ({ config: { user, host, brightness, key, lightId }, stdout }) {
    this.hueApi = new HueApi(host, user)
    this.prompt = new HueSyncPrompt(stdout, new PatternPrompt())
    this.lightId = lightId

    if (brightness) {
      this.brightness = brightness
    }
    if (key) {
      this.usageInfo = { key, ...this.usageInfo }
    }
  }
  // Add hooks to Jest lifecycle events
  apply (jestHooks) {
    jestHooks.onTestRunComplete(({ success }) => {
      if (this.enabled) {
        if (success) {
          this.setLightState(100)
        } else {
          this.setLightState(0)
        }
      }
    })
  }

  setLightState (hue) {
    const { brightness, hueApi, lightId } = this
    const state = lightState.create().on().hsl(hue, 100, brightness)
    hueApi.setLightState(lightId, state)
  }
}

export default HueSyncPlugin
