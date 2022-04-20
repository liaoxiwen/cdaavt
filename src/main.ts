import ora from 'ora';
import chalk from 'chalk';
import projectConfigAnalysis from './projectConfigAnalysis/index';
import depAnalysis from './dependencyAnalysis/index';
import impactScopeAnalysis from './/dependencyAnalysis/impactScopeAnalysis';
import visualization from './visualization/index';
import { ICDAAVTOPTIONS, ENUM_FORMAT, IReferenceRelation, ENUM_TYPE } from './utils/type';
import { writeHtml, writeJson } from './utils/common';

const LOG_TEXT = {
    START_TEXT: 'Start analysis.',
    ANALYSISING_CONFIG_TEXT: 'Analysising config.',
    ANALYSIS_CONFIG_SUCCESS_TEXT: 'Analysising config success.',
    ANALYSISING_DEPENDENCY_TEXT: 'Analysising dependecy.',
    VISUALIZING_RESULT_TEXT: 'Visualizing analysis results.',
    ANALYSISING_SUCCESS_TEXT: 'Analysising Succeed!',
};

function getFilePaths(data: IReferenceRelation, filePaths: string[], type: string) {
    const dataKeys = Object.keys(data);
    let paths:string[] = dataKeys;
    if(type === ENUM_TYPE.SCOPE_TYPE) {
        dataKeys.forEach(key => {
            const dependencyKeys = Object.keys(data[key]);
            paths = paths.concat(dependencyKeys);
        });
        return Array.from(new Set(paths));
    }
    return Array.from(new Set([...paths, ...filePaths]));
}

export default function (options: ICDAAVTOPTIONS) {
    const spinner = ora(chalk.green(LOG_TEXT.START_TEXT)).start();
    spinner.text = LOG_TEXT.ANALYSISING_CONFIG_TEXT;
    const config = projectConfigAnalysis();
    spinner.text = LOG_TEXT.ANALYSIS_CONFIG_SUCCESS_TEXT;
    spinner.text = LOG_TEXT.ANALYSISING_DEPENDENCY_TEXT;

    let analysisRes = depAnalysis(config);
    let analysisType = ENUM_TYPE.GLOBAL_TYPE;
    if(options.path) {
        analysisRes = impactScopeAnalysis(analysisRes, options.path);
        analysisType = ENUM_TYPE.SCOPE_TYPE;
    }
    if (options.output) {
        spinner.text = LOG_TEXT.VISUALIZING_RESULT_TEXT;
        if (options.format === ENUM_FORMAT.HTML) {
            const fileName = `${options.output}.${options.format}`;
            const filePaths = getFilePaths(analysisRes, config.files, analysisType);
            const visualizationResults = visualization(analysisRes, filePaths);
            writeHtml(fileName, visualizationResults);
        } else {
            const fileName = `${options.output}.${options.format ?? ENUM_FORMAT.FORMAT}`;
            writeJson(fileName, analysisRes);
        }
    } else {
        console.log(analysisRes);
    }
    spinner.succeed(chalk.green(LOG_TEXT.ANALYSISING_SUCCESS_TEXT));
    spinner.stop();
}