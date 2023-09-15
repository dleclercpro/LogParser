import Graph from './Graph';
import { Performance } from '../runtimes/PerformanceRuntime';
import { StrategyName } from '../strategies/Strategy';

class PerformanceGraph extends Graph<Performance> {

    public async draw(data: Performance[]) {
        const opts = {
            title: 'Strategy Performance based on Number of Logs to Process',
            xAxisLabel: 'Number of Logs (-)',
            yAxisLabel: 'Duration (ms)',
        };

        const lines = [{
            label: StrategyName.Memory,
            data: data.map(d => ({ x: d.size, y: d.durations[StrategyName.Memory].toMs().getAmount() })),
            color: 'orange',
        }, {
            label: StrategyName.Streams,
            data: data.map(d => ({ x: d.size, y: d.durations[StrategyName.Streams].toMs().getAmount() })),
            color: 'purple',
        }];

        await this.generate(lines, opts);
    }
}

export default PerformanceGraph;