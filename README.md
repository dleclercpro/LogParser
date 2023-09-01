# StreamLogParser
## Description
Dummy Node application that uses streams in order to read from application logs, parse, filter, and format said logs, before outputting them in a JSON file.

## How to run
### Development mode
In order to run the log parser in development mode, simply execute the following command in the terminal:
```
npm run start
```

### Production mode
To run it in production mode (compiled TypeScript), run the following commands:
```
npm run build
npm run start:prod
```