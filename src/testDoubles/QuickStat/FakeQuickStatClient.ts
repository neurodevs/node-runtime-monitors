import { ClientOptions } from '@quickstat/core'

export default class FakeQuickStatClient {
    public static callsToConstructor: ClientOptions[] = []
    public static numCallsToGetResponse = 0

    public static fakeGetResponseResult?: any

    public dataSource = {
        strategy: {
            getResponse: async () => {
                FakeQuickStatClient.numCallsToGetResponse++
                return FakeQuickStatClient.fakeGetResponseResult
            },
        },
    }

    public constructor(options: ClientOptions) {
        FakeQuickStatClient.callsToConstructor.push(options)
    }

    public static resetTestDouble() {
        FakeQuickStatClient.callsToConstructor = []
        FakeQuickStatClient.numCallsToGetResponse = 0
    }
}
