/*globals exports */

'use strict';

exports.format = format;

function format (result) {
    /*
    return result.reports.reduce(function (formatted, report) {
        return formatted + formatModule(report) + '\n\n';
    }, formatProject(result));
    */
    return formatProject(result) + '\n\n' +
        '### Ten Functions with Highest Complexity \n\n' +
        createTableForFunctions(mostComplexFunctions(result)) + '\n\n' +
        '### Ten Longest Functions \n\n' +
        createTableForFunctionLengths(longestFunctions(result))
}

function formatProject (result) {
    return [
        '# CodeSherpas Complexity Report\n\n',
        'This repository has an average cyclomatic complexity of **', result.moduleAverage.methodAverage.cyclomatic, '** ',
        'and a maintainability index of **', result.moduleAverage.maintainability, '**.\n',
        'Each function has an average of ', result.moduleAverage.methodAverage.sloc.logical, ' lines of code and ',
        result.moduleAverage.methodAverage.paramCount, ' parameters.\n',
        'The Halstead Metrics are as follows: \n',
        '* Effort: ', result.moduleAverage.methodAverage.halstead.effort, '\n',
        '* Bugs: ', result.moduleAverage.methodAverage.halstead.bugs, '\n',
        '* Difficulty: ', result.moduleAverage.methodAverage.halstead.difficulty, '\n',
        '* Time: ', result.moduleAverage.methodAverage.halstead.time, '\n',
        '* Volume: ', result.moduleAverage.methodAverage.halstead.volume, '\n',
    ].join('');
}

function createTableForFunctions(anArrayOfFunctionReports) {
    return '|name|complexity|path|line|\n| --- | --- | --- | --- |\n' +
        anArrayOfFunctionReports.map(r => `|${r.name.replace(/<|>/g,'')}|${r.cyclomatic}|${r.srcPath}|${r.lineStart}|`).join('\n')
}

function createTableForFunctionLengths(anArrayOfFunctionReports) {
    return '|name|length|path|line|\n| --- | --- | --- | --- |\n' +
        anArrayOfFunctionReports.map(r => `|${r.name.replace(/<|>/g,'')}|${r.lineEnd - r.lineStart}|${r.srcPath}|${r.lineStart}|`).join('\n')
}


function getSortedFunctionReports (aComplexityReport, sortFunction) {
    return aggregateFunctionReports(aComplexityReport).sort(sortFunction)
}
function mostComplexFunctions(aComplexityReport, size = 10) {
    return getSortedFunctionReports(aComplexityReport, (a,b) => b.cyclomatic - a.cyclomatic).slice(0,size)
}

function longestFunctions(aComplexityReport, size = 10) {
    return getSortedFunctionReports(aComplexityReport, (a,b) => (b.lineEnd - b.lineStart) - (a.lineEnd - a.lineStart)).slice(0,size)
}

function aggregateFunctionReports(aComplexityReport) {
    const result = [];
    aComplexityReport.modules.forEach(m => m.methods.forEach(me => {
        me.srcPath = m.srcPath
        result.push(me)}
    ))
    return result;
}

function formatModule (report) {
    return [
        '## ', report.path, '\n\n',
        '* Physical LOC: ', report.aggregate.sloc.physical, '\n',
        '* Logical LOC: ', report.aggregate.sloc.logical, '\n',
        '* Mean parameter count: ', report.params, '\n',
        '* Cyclomatic complexity: ', report.aggregate.cyclomatic, '\n',
        '* Cyclomatic complexity density: ', report.aggregate.cyclomaticDensity, '%\n',
        '* Maintainability index: ', report.maintainability, '\n',
        '* Dependency count: ', report.dependencies.length,
        formatFunctions(report.functions)
    ].join('');
}

function formatFunctions (report) {
    return report.reduce(function (formatted, r) {
        return formatted + '\n' + formatFunction(r);
    }, '');
}

function formatFunction (report) {
    return [
        '* Function: **', report.name.replace('<', '&lt;'), '**\n',
        '    * Line No.: ', report.line, '\n',
        '    * Physical LOC: ', report.sloc.physical, '\n',
        '    * Logical LOC: ', report.sloc.logical, '\n',
        '    * Parameter count: ', report.params, '\n',
        '    * Cyclomatic complexity: ', report.cyclomatic, '\n',
        '    * Cyclomatic complexity density: ', report.cyclomaticDensity, '%\n',
        '    * Halstead difficulty: ', report.halstead.difficulty, '\n',
        '    * Halstead volume: ', report.halstead.volume, '\n',
        '    * Halstead effort: ', report.halstead.effort
    ].join('');
}

