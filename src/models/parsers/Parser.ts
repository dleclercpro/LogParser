export interface IParser<R> {
    parse(file: string): R;
}

abstract class Parser<R> implements IParser<R> {
    public abstract parse(file: string): R;
}

export default Parser;