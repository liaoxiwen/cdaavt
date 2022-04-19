import ora from 'ora';
import chalk from 'chalk';
import projectConfigAnalysis from './projectConfigAnalysis/index';
import depAnalysis from './dependencyAnalysis/index';
import visualization from './visualization/index';
import { ICDAAVTOPTIONS, ENUM_FORMAT } from './utils/type';
import { writeHtml, writeJson } from './utils/common';

const LOG_TEXT = {
    START_TEXT: 'Start analysis.',
    ANALYSISING_CONFIG_TEXT: 'Analysising config.',
    ANALYSIS_CONFIG_SUCCESS_TEXT: 'Analysising config success.',
    ANALYSISING_DEPENDENCY_TEXT: 'Analysising dependecy.',
    VISUALIZING_RESULT_TEXT: 'Visualizing analysis results.',
    ANALYSISING_SUCCESS_TEXT: 'Analysising Succeed!',
};

export default function (options: ICDAAVTOPTIONS) {
    const spinner = ora(chalk.green(LOG_TEXT.START_TEXT)).start();
    spinner.text = LOG_TEXT.ANALYSISING_CONFIG_TEXT;
    const config = projectConfigAnalysis();
    spinner.text = LOG_TEXT.ANALYSIS_CONFIG_SUCCESS_TEXT;

    spinner.text = LOG_TEXT.ANALYSISING_DEPENDENCY_TEXT;
    const depAnalysisRes = depAnalysis(config);

    if (options.output) {
        spinner.text = LOG_TEXT.VISUALIZING_RESULT_TEXT;
        if (options.format === ENUM_FORMAT.HTML) {
            const fileName = `${options.output}.${options.format}`;
            const visualizationResults = visualization(depAnalysisRes, config.files);
            writeHtml(fileName, visualizationResults);
        } else {
            const fileName = `${options.output}.${options.format ?? ENUM_FORMAT.FORMAT}`;
            writeJson(fileName, depAnalysisRes);
        }
    } else {
        console.log(depAnalysisRes);
    }
    spinner.succeed(chalk.green(LOG_TEXT.ANALYSISING_SUCCESS_TEXT));
    spinner.stop();
}