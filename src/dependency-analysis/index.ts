import projectConfigAnalysis from './projectConfigAnalysis';
import getAst from './getAst';
import astAnalysis from './astAnalysis';
import dependencyAnalysis from './dependency-analysis';
import { writeJson } from '../utils/common';

export default function() {
    const config = projectConfigAnalysis();
    const ast = getAst(config.tsJsFiles);
    const analysis = astAnalysis(ast, config);
    const res = dependencyAnalysis(analysis);
    writeJson('testReport.json', res);
}
