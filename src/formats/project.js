/*globals exports */

'use strict';

exports.format = format;

function format (result) {
    return JSON.stringify({
        averageFunctionLogicalSloc: result.loc,
        averageFunctionParams: result.params,
        averageFunctionComplexity: result.cyclomatic,
        averageFunctionEffort: result.effort,
        averageModuleMaintainability: result.maintainability,
        firstOrderDensity: result.firstOrderDensity,
        changeCost: result.changeCost,
        coreSize: result.coreSize
    })
}
