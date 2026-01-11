import { RuntimeMonitor } from '../../impl/NodeRuntimeMonitor.js'

export default class FakeRuntimeMonitor implements RuntimeMonitor {
    public static numCallsToConstructor = 0
    public static numCallsToStart = 0

    public constructor() {
        FakeRuntimeMonitor.numCallsToConstructor++
    }

    public start() {
        FakeRuntimeMonitor.numCallsToStart++
    }

    public static resetTestDouble() {
        FakeRuntimeMonitor.numCallsToConstructor = 0
        FakeRuntimeMonitor.numCallsToStart = 0
    }
}
