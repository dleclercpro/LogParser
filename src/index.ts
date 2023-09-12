import { Environment } from './types';
import { ENV } from './config';
import minimist from 'minimist';
import RuntimeManager from './models/runtimes/RuntimeManager';



const execute = async () => {
    const args: { [arg: string]: any } = minimist(process.argv.slice(2));

    // Remove any argument without value
    delete args._;

    const runtime = RuntimeManager.getRuntimeByArgs(args);
    await runtime.execute(args);
}



if ([Environment.Development].includes(ENV)) {
    execute();
}



export default execute;