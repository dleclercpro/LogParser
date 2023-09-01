import { SEVERITY_ORDERING } from '../../src/constants';
import JSONExporter from '../../src/models/exporters/JSONExporter';
import { Severity } from '../../src/types';
import { isValidEpochDate, isValidISODate } from '../../src/utils/time';
import { loadTestLogHistory } from '../actions';

test(`JSON exporter should output logs in the expected format`, async () => {
    const history = await loadTestLogHistory();

    const exporter = new JSONExporter();
    const output = exporter.serialize(history);

    // Since exporter exports JSON, its output should be JSON-parsable
    const logs = JSON.parse(output);

    // Ensure all logs respect the pre-defined format
    logs.forEach(log => {
        expect(log.timestamp).toBeDefined();
        expect(isValidEpochDate(log.timestamp)).toBeTruthy();

        expect(log.loglevel).toBeDefined();
        expect(SEVERITY_ORDERING.includes(log.loglevel)).toBeTruthy();

        expect(log.transactionId).toBeDefined();
    });
});

test(`JSON exporter should output error logs in the expected format`, async () => {
    const history = await loadTestLogHistory();

    const exporter = new JSONExporter();
    const output = exporter.serialize(history.of(Severity.Error));

    // Since exporter exports JSON, its output should be JSON-parsable
    const logs = JSON.parse(output);

    // Ensure all logs respect the pre-defined format
    logs.forEach(log => {
        expect(log.err).toBeDefined();
        expect(log.err).not.toBeFalsy();
    });
});