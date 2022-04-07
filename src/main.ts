
import ora from 'ora';
import chalk from 'chalk';
import projectConfigAnalysis from './projectConfigAnalysis/index';
import depAnalysis from './dependencyAnalysis/index';
import visualization from './visualization/index';
import { ICDAAVTOPTIONS, ENUM_FORMAT } from './utils/type';
import { writeHtml, writeJson } from './utils/common';

export default function (options: ICDAAVTOPTIONS) {
    let depAnalysisRes = {};
    const spinner = ora(chalk.green('Start analysis')).start();
    spinner.text = 'Analysising config.';
    const config = projectConfigAnalysis();
    spinner.text = 'Config analysised!'
    spinner.text = 'Analysising dependency.'
    depAnalysisRes = depAnalysis(config);
    if (options.output) {
        spinner.text = 'Visualizing analysis results.';
        if (options.format === ENUM_FORMAT.HTML) {
            const fileName = `${options.output}.${options.format}`;
            const visualizationResults = visualization(depAnalysisRes, config.files);
            writeHtml(fileName, visualizationResults);
        } else {
            const fileName = `${options.output}.${options.format ?? ENUM_FORMAT.FORMAT}`;
            writeJson(fileName, depAnalysisRes);
        }
    } else {
        // console.log(depAnalysisRes);
    }
    spinner.succeed(chalk.green('Analysising Succeed!'));
    spinner.stop();
}