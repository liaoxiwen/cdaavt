import projectConfigAnalysis from './projectConfigAnalysis';
import getAst from './getAst';
import astAnalysis from './astAnalysis';

export default function() {
    const config = projectConfigAnalysis();
    console.log(config);
    const ast = getAst(config.tsJsFiles);
    astAnalysis(ast, config);
}
