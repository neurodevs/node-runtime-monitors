export default class NodeRuntimeMonitor implements RuntimeMonitor {
    public static Class?: RuntimeMonitorConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface RuntimeMonitor {}

export type RuntimeMonitorConstructor = new () => RuntimeMonitor
