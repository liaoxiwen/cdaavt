import projectConfigAnalysis from './projectConfigAnalysis';
import getAst from './getAst';
import astAnalysis from './astAnalysis';
import dependencyAnalysis from './dependency-analysis';

export default function() {
    const config = projectConfigAnalysis();
    const ast = getAst(config.tsJsFiles);
    const astAnalysisRes = astAnalysis(ast, config);
    const dependencyAnalysisRes = dependencyAnalysis(astAnalysisRes);
    return dependencyAnalysisRes;
}
