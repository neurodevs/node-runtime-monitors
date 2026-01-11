import { test, assert } from '@neurodevs/node-tdd'

import { Client as QuickStatClient } from '@quickstat/core'
import { NodeJsPlugin } from '@quickstat/nodejs'
import { PrometheusDataSource, ScrapeStrategy } from '@quickstat/prometheus'
import NodeRuntimeMonitor, {
    RuntimeMonitor,
} from '../../impl/NodeRuntimeMonitor.js'
import FakeQuickStatClient from '../../testDoubles/QuickStat/FakeQuickStatClient.js'
import AbstractPackageTest from '../AbstractPackageTest.js'

export default class NodeRuntimeMonitorTest extends AbstractPackageTest {
    private static instance: RuntimeMonitor

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeQuickStatClient()

        this.instance = this.NodeRuntimeMonitor()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Failed to create instance!')
    }

    @test()
    protected static async startCreatesQuickStatClient() {
        this.instance.start()

        assert.isEqualDeep(
            FakeQuickStatClient.callsToConstructor[0],
            {
                metrics: [],
                plugins: [
                    new NodeJsPlugin({
                        excludeMetrics: [],
                    }),
                ],
                dataSource: new PrometheusDataSource({
                    strategy: new ScrapeStrategy(),
                }),
            },
            'QuickStat client was not created with expected options!'
        )
    }

    protected static setFakeQuickStatClient() {
        NodeRuntimeMonitor.Client =
            FakeQuickStatClient as unknown as typeof QuickStatClient
        FakeQuickStatClient.resetTestDouble()
    }

    private static NodeRuntimeMonitor() {
        return NodeRuntimeMonitor.Create()
    }
}
