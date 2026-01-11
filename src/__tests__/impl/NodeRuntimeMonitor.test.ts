import http from 'node:http'

import {
    callsToHttpCreateServer,
    fakeHttp,
    resetFakeHttp,
} from '@neurodevs/fake-node-core'
import { test, assert } from '@neurodevs/node-tdd'
import { Client as QuickStatClient } from '@quickstat/core'
import { NodeJsPlugin } from '@quickstat/nodejs'
import { PrometheusDataSource, ScrapeStrategy } from '@quickstat/prometheus'

import NodeRuntimeMonitor from '../../impl/NodeRuntimeMonitor.js'
import FakeQuickStatClient from '../../testDoubles/QuickStat/FakeQuickStatClient.js'
import SpyNodeRuntimeMonitor from '../../testDoubles/RuntimeMonitor/SpyNodeRuntimeMonitor.js'
import AbstractPackageTest from '../AbstractPackageTest.js'

export default class NodeRuntimeMonitorTest extends AbstractPackageTest {
    private static instance: SpyNodeRuntimeMonitor

    private static readonly fakeHeaders = {
        [this.generateId()]: this.generateId(),
    }

    private static readonly fakeFile = this.generateId()

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeQuickStatClient()
        this.setFakeHttp()
        this.setSpyNodeRuntimeMonitor()

        this.instance = this.NodeRuntimeMonitor()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Failed to create instance!')
    }

    @test()
    protected static async startCreatesQuickStatClient() {
        this.start()

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

    @test()
    protected static async startCreatesHttpServer() {
        this.start()

        assert.isEqualDeep(
            callsToHttpCreateServer.length,
            1,
            'HTTP server was not created!'
        )
    }

    @test()
    protected static async callsGetResponseOnClient() {
        this.fakeGetResponseResult()
        this.start()

        await this.invokeListener()

        assert.isEqual(
            FakeQuickStatClient.numCallsToGetResponse,
            1,
            'getResponse should be called on start!'
        )
    }

    @test()
    protected static async responseWritesHeadWithStatusCodeAndHeaders() {
        this.fakeGetResponseResult()
        this.start()

        const { callsToWriteHead } = await this.invokeListener()

        assert.isEqualDeep(
            callsToWriteHead[0],
            {
                statusCode: 200,
                headers: this.fakeHeaders,
            },
            'writeHead(...) was not called with expected arguments!'
        )
    }

    @test()
    protected static async responseEndsWithFile() {
        this.fakeGetResponseResult()
        this.start()

        const { callsToEnd } = await this.invokeListener()

        assert.isEqualDeep(
            callsToEnd[0],
            this.fakeFile,
            'end(...) was not called with expected arguments!'
        )
    }

    private static start() {
        this.instance.start()
    }

    private static async invokeListener() {
        const callsToWriteHead: {
            statusCode: number
            headers: http.OutgoingHttpHeaders
        }[] = []

        const callsToEnd: string[] = []

        await this.instance['listener'](
            {} as http.IncomingMessage,
            {
                writeHead: (
                    statusCode: number,
                    headers: http.OutgoingHttpHeaders
                ) => {
                    callsToWriteHead.push({
                        statusCode,
                        headers,
                    })
                },
                end: (data: string) => {
                    callsToEnd.push(data)
                },
            } as http.ServerResponse
        )

        return {
            callsToWriteHead,
            callsToEnd,
        }
    }

    private static fakeGetResponseResult() {
        FakeQuickStatClient.fakeGetResponseResult = {
            headers: this.fakeHeaders,
            file: this.fakeFile,
        }
    }

    protected static setFakeQuickStatClient() {
        NodeRuntimeMonitor.Client =
            FakeQuickStatClient as unknown as typeof QuickStatClient
        FakeQuickStatClient.resetTestDouble()
    }

    protected static setFakeHttp() {
        NodeRuntimeMonitor.http = fakeHttp as unknown as typeof http
        resetFakeHttp()
    }

    protected static setSpyNodeRuntimeMonitor() {
        NodeRuntimeMonitor.Class = SpyNodeRuntimeMonitor
    }

    private static NodeRuntimeMonitor() {
        return NodeRuntimeMonitor.Create() as SpyNodeRuntimeMonitor
    }
}
