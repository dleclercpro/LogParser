import { Args, ValidArgs } from '../models/runtimes/Runtime';

export const areArgsValid = (args: Args, validArgs: ValidArgs) => {
    const argNames = Object.keys(args);
    const validArgNames = Object.keys(validArgs);
    const requiredArgNames = validArgNames.filter(arg => validArgs[arg].isRequired);

    // No unknown argument is provided
    if (!argNames.every(arg => validArgNames.includes(arg))) {
        return false;
    }

    // All required arguments must be found
    if (!requiredArgNames.every(arg => argNames.includes(arg))) {
        return false;
    }

    // Validate all provided arguments
    if (!argNames.every(arg => validArgs[arg].validate(args[arg]))) {
        return false;
    }

    return true;
}