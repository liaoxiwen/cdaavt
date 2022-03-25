import projectConfigAnalysis from './projectConfigAnalysis/index';
import depAnalysis from './dependencyAnalysis/index';
import visualization from './visualization/index';
// import { writeHtml } from './utils/common';

export default function () {
    const config = projectConfigAnalysis();
    const depAnalysisRes = depAnalysis(config);
    visualization(depAnalysisRes, config.files);
    // writeHtml('testReport.html', visualizationResults);
}