export type Listener<D> = (data: D) => void;



class Observer<Event> {
    protected listeners: Map<Event, Listener<any>[]>;

    public constructor() {
        this.listeners = new Map();

        // Initialize listener storage by event
        Object.values(Event).forEach((event) => {
            this.listeners.set(event, []);
        });
    }

    public addListener<Data>(event: Event, listener: Listener<Data>) {
        const prevListeners = this.listeners.get(event) as Listener<Data>[];

        this.listeners.set(event, [...prevListeners, listener]);

        return () => this.removeListener(event, listener);
    }

    protected removeListener<Data>(event: Event, listener: Listener<Data>) {
        const prevListeners = this.listeners.get(event) as Listener<Data>[];

        this.listeners.set(event, prevListeners.filter(prevListener => prevListener !== listener));
    }
    
    protected notifyListeners<Data>(event: Event, data: Data) {
        const listeners = this.listeners.get(event) as Listener<Data>[];

        listeners.forEach((listener: Listener<Data>) => {
            listener(data);
        });
    }
}

export default Observer;