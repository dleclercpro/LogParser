import { SEVERITY_ORDERING } from '../../src/constants';
import LogHistory from '../../src/models/LogHistory';
import { Severity } from '../../src/types';
import { loadTestLogHistory } from '../actions';
import { getRange } from '../../src/utils/array';

test(`Severity range selection of logs should be sane`, () => {
    const history = new LogHistory([]);

    const action = () => history.fromTo({ from: Severity.Error, to: Severity.Debug });

    expect(action).toThrow();
});

test(`Extracting logs of a given severity only should work`, async () => {
    const history = await loadTestLogHistory();

    // Check if severity selection works for all severities
    SEVERITY_ORDERING.forEach(level => {
        const logs = history.of(level);

        logs.getLogs().forEach(log => {
            expect(log.getLevel()).toEqual(level);
        });
    });
});

test(`Extracting logs of a given severity range should work`, async () => {
    const history = await loadTestLogHistory();

    const range = { from: Severity.Info, to: Severity.Error };
    const [ fromIndex, toIndex ] = [range.from, range.to].map(severity => SEVERITY_ORDERING.indexOf(severity));

    const validSeverities = getRange(fromIndex, toIndex)
        .map(i => SEVERITY_ORDERING[i]);
    
    history.fromTo(range).getLogs().forEach(log => {
        expect(validSeverities.includes(log.getLevel())).toBeTruthy();
    });
});