import ora from 'ora';
// import chalk from 'chalk';
import projectConfigAnalysis from './projectConfigAnalysis/index';
import depAnalysis from './dependencyAnalysis/index';
import impactScopeAnalysis from './/dependencyAnalysis/impactScopeAnalysis';
import visualization from './visualization/index';
import { ICDAAVTOPTIONS, ENUM_FORMAT, IReferenceRelation, ENUM_TYPE } from './utils/type';
import { writeHtml, writeJson } from './utils/common';

const LOG_TEXT = {
	START_TEXT: 'Start analysis.',
	ANALYSISING_CONFIG_TEXT: 'Resolving configuration.',
	ANALYSIS_CONFIG_SUCCESS_TEXT: 'Configuration resolution succeeded.',
	ANALYSISING_DEPENDENCY_TEXT: 'Dependency analysis in progress.',
	ANALYSISING_DEPENDENCY_SUCCESS_TEXT: 'Dependency analysis complete.',
	VISUALIZING_RESULT_TEXT: 'Visualizing dependencies.',
	VISUALIZING_SUCCESS_TEXT: 'Visual completion.',
	ANALYSISING_SUCCESS_TEXT: 'Analysising Succeed.',
};

function getFilePaths(data: IReferenceRelation, filePaths: string[], type: string) {
	const dataKeys = Object.keys(data);
	let paths: string[] = dataKeys;
	if (type === ENUM_TYPE.SCOPE_TYPE) {
		dataKeys.forEach(key => {
			const dependencyKeys = Object.keys(data[key]);
			paths = paths.concat(dependencyKeys);
		});
		return Array.from(new Set(paths));
	}
	return Array.from(new Set([...paths, ...filePaths]));
}

export default function(options: ICDAAVTOPTIONS) {
	let tableRes: IReferenceRelation = {}; // 用于列表显示的依赖关系
	let forceRes: IReferenceRelation = {}; // 用于力导向图显示的依赖关系
	const spinner = ora(LOG_TEXT.START_TEXT).start();
	const spinnerConfig = ora(LOG_TEXT.ANALYSISING_CONFIG_TEXT).start();
	const config = projectConfigAnalysis();
	spinnerConfig.succeed(LOG_TEXT.ANALYSIS_CONFIG_SUCCESS_TEXT);

	const spinnerDependency = ora(LOG_TEXT.ANALYSISING_DEPENDENCY_TEXT).start();
	let analysisRes = depAnalysis(config);
	spinnerDependency.succeed(LOG_TEXT.ANALYSISING_DEPENDENCY_SUCCESS_TEXT);

	const analysisType = options.path ? ENUM_TYPE.SCOPE_TYPE : ENUM_TYPE.GLOBAL_TYPE;
	const analysisOutput = options.output;
	const analysisFormat = options.format ?? ENUM_FORMAT.JSON;

	if (!options.path) {
		Object.keys(analysisRes).map(key => {
			tableRes[key] = impactScopeAnalysis(analysisRes, key).tableRes[key];
		});
		forceRes = analysisRes;
	} else {
		tableRes = impactScopeAnalysis(analysisRes, options.path).tableRes;
		forceRes = impactScopeAnalysis(analysisRes, options.path).forceRes;
	}
	if (analysisOutput) {
		if (analysisFormat === ENUM_FORMAT.HTML) {
			const spinnerVis = ora(LOG_TEXT.VISUALIZING_RESULT_TEXT).start();
			const fileName = `${analysisOutput}.${analysisFormat}`;

			const filePaths = getFilePaths(forceRes, config.files, analysisType);
			const visualizationResults = visualization(forceRes, tableRes, filePaths);
			writeHtml(fileName, visualizationResults);
			spinnerVis.succeed(LOG_TEXT.VISUALIZING_SUCCESS_TEXT);
		} else {
			const fileName = `${analysisOutput}.${analysisFormat ?? ENUM_FORMAT.FORMAT}`;
			writeJson(fileName, tableRes);
		}
	} else {
		console.log(tableRes);
	}
	spinner.succeed(LOG_TEXT.ANALYSISING_SUCCESS_TEXT);
}
