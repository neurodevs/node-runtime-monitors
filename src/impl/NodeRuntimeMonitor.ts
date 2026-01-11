import { Client as QuickStatClient } from '@quickstat/core'
import { NodeJsPlugin } from '@quickstat/nodejs'
import { PrometheusDataSource, ScrapeStrategy } from '@quickstat/prometheus'

export default class NodeRuntimeMonitor implements RuntimeMonitor {
    public static Class?: RuntimeMonitorConstructor
    public static Client = QuickStatClient

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public start() {
        new this.Client({
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

    private get Client() {
        return NodeRuntimeMonitor.Client<PrometheusDataSource<ScrapeStrategy>>
    }
}

export interface RuntimeMonitor {
    start(): void
}

export type RuntimeMonitorConstructor = new () => RuntimeMonitor
