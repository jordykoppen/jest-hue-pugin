import { HueApi, lightState } from 'node-hue-api'

class HueSyncPlugin {
  hueApi = undefined
  prompt = undefined
  lightId = undefined
  brightness = 50
  enabled = true

  constructor (
    { config: {
      user,
      host,
      brightness,
      lightId,
      enabled },
    stdout }) {
    this.hueApi = new HueApi(host, user)
    this.lightId = lightId

    if (brightness) {
      this.brightness = brightness
    }
  }

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
