import AbstractModuleTest, { test, assert } from '@neurodevs/node-tdd'

import NodeRuntimeMonitor, {
    RuntimeMonitor,
} from '../../impl/NodeRuntimeMonitor.js'

export default class NodeRuntimeMonitorTest extends AbstractModuleTest {
    private static instance: RuntimeMonitor

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.NodeRuntimeMonitor()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Failed to create instance!')
    }

    private static NodeRuntimeMonitor() {
        return NodeRuntimeMonitor.Create()
    }
}
