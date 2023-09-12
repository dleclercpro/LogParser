# LogParser
## Description
Node application which can either use a stream-based or an in-memory strategy in order to read application logs, parse, filter, and format them, before outputting them to a JSON file.

## Strategies
### Memory
The entirety of the application logs is read from a given text file before said logs are output to the specified JSON file. This strategy relies on the fact that there is enough memory on the host to contain all the logs, otherwise it will crash.

In order to run the parser in this mode, execute the following command in the terminal:
```
npm run start:normal:memory
```

### Streams
The application logs are read and output using streams. This makes handling of very large log files possible, which isn't possible with the in-memory strategy.

In order to run the parser in this mode, execute the following command in the terminal:
```
npm run start:normal:streams
```

## Performance Comparison
The available strategies' respective performances can be compared in terms of execution speed. To do so, run the following command:
```
npm run start:performance
```

A graph will be generated in the data directory, where each strategy's required time of execution as a function of number of logs to process will be plotted. Here is an example of the image generated:
![Performance Comparison between Parsing Strategies][./resources/PerformanceComparison.png]

## Testing
Some unit tests have been written. They can be run using:
```
npm test
```

## Note
If you want to run all strategies sequentially, you can execute the following:
```
npm start
```