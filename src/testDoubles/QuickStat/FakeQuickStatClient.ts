import { ClientOptions } from '@quickstat/core'

export default class FakeQuickStatClient {
    public static callsToConstructor: ClientOptions[] = []

    public constructor(options: ClientOptions) {
        FakeQuickStatClient.callsToConstructor.push(options)
    }

    public static resetTestDouble() {
        FakeQuickStatClient.callsToConstructor = []
    }
}
