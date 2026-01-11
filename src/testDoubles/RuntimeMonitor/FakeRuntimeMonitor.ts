import { RuntimeMonitor } from '../../impl/NodeRuntimeMonitor.js'

export default class FakeRuntimeMonitor implements RuntimeMonitor {
    public static numCallsToConstructor = 0

    public constructor() {
        FakeRuntimeMonitor.numCallsToConstructor++
    }

    public static resetTestDouble() {
        FakeRuntimeMonitor.numCallsToConstructor = 0
    }
}
