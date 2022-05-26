import getAst from './getAst';
import astAnalysis from './astAnalysis';
import dependencyAnalysis from './dependencyAnalysis';
import { IConfig } from '../utils/type';

export default function(config: IConfig) {
	const ast = getAst(config.tsJsFiles);
	const astAnalysisRes = astAnalysis(ast, config);
	const dependencyAnalysisRes = dependencyAnalysis(astAnalysisRes);
	return dependencyAnalysisRes;
}
