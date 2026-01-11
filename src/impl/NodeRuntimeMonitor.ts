import http, { IncomingMessage, ServerResponse } from 'node:http'

import { Client as QuickStatClient } from '@quickstat/core'
import { NodeJsPlugin } from '@quickstat/nodejs'
import { PrometheusDataSource, ScrapeStrategy } from '@quickstat/prometheus'

export default class NodeRuntimeMonitor implements RuntimeMonitor {
    public static Class?: RuntimeMonitorConstructor
    public static Client = QuickStatClient
    public static http = http

    protected client!: QuickStatClient<PrometheusDataSource<ScrapeStrategy>>

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public start() {
        this.client = this.QuickStatClient()

        this.createHttpServer()
    }

    private QuickStatClient() {
        return new this.Client({
            metrics: [],
            plugins: [
                new NodeJsPlugin({
                    excludeMetrics: [],
                }),
            ],
            dataSource: new PrometheusDataSource({
                strategy: new ScrapeStrategy(),
            }),
        })
    }

    private createHttpServer() {
        this.http.createServer(this.handleRequest)
    }

    protected handleRequest = async (
        _req: IncomingMessage,
        res: ServerResponse
    ) => {
        const response = await this.getResponseFromClient()

        if (response) {
            res.writeHead(200, response.headers)
            res.end(response.file)
        }
    }

    private getResponseFromClient() {
        return this.client.dataSource?.strategy?.getResponse()
    }

    private get Client() {
        return NodeRuntimeMonitor.Client
    }

    private get http() {
        return NodeRuntimeMonitor.http
    }
}

export interface RuntimeMonitor {
    start(): void
}

export type RuntimeMonitorConstructor = new () => RuntimeMonitor
