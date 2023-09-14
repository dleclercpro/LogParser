import { areArgsValid } from '../../utils/cli';
import NormalRuntime from './NormalRuntime';
import PerformanceRuntime from './PerformanceRuntime';
import Runtime, { Args, RuntimeName } from './Runtime';

// Singleton
class RuntimeManager {
    private static instance: RuntimeManager;

    private runtimes: Runtime[] = [NormalRuntime, PerformanceRuntime];

    private constructor() {

    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new RuntimeManager();
        }

        return this.instance;
    }

    public getRuntimeByName(name: RuntimeName) {
        return this.runtimes.find(runtime => runtime.getName() === name);
    }

    public getRuntimeByArgs(args: Args) {
        const runtime = this.runtimes
            .find(runtime => areArgsValid(args, runtime.getValidArgs()));
    
        if (!runtime) {
            throw Error('Invalid arguments provided!');
        }
    
        return runtime;
    }
}

export default RuntimeManager.getInstance();