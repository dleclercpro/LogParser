try {
    const { default: execute } = require('./dist/src');
    
    execute();
} catch (err) {

    // Ensure project is compiled
    if (err.code === 'MODULE_NOT_FOUND') {
        console.error('Please compile project first.');
        return;
    }

    throw err;
}