import http from 'node:http'

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
        this.client = new this.Client({
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

        this.http.createServer(async (_req, _res) => {})
    }

    private get Client() {
        return NodeRuntimeMonitor.Client<PrometheusDataSource<ScrapeStrategy>>
    }

    private get http() {
        return NodeRuntimeMonitor.http
    }
}

export interface RuntimeMonitor {
    start(): void
}

export type RuntimeMonitorConstructor = new () => RuntimeMonitor
