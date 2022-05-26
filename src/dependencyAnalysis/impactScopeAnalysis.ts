import { IReferenceRelation } from '../utils/type';

interface IImpactScope {
	tableRes: IReferenceRelation;
	forceRes: IReferenceRelation;
}

export default function(
	analysisRes: IReferenceRelation,
	fileName: string
): IImpactScope {
	const tableRes: IReferenceRelation = {};
	const forceRes: IReferenceRelation = {};
	const visitedPath: string[] = [];
	const cursionFunc = (path: string) => {
		const dependency = analysisRes[path];
		if (visitedPath.indexOf(path) === -1) {
			visitedPath.push(path);
			if (dependency && dependency !== {}) {
				tableRes[fileName] = { ...tableRes[fileName], ...dependency };
				forceRes[path] = dependency;
				const dependencyKeys = Object.keys(dependency);
				dependencyKeys.forEach(key => cursionFunc(key));
			}
		}
	};
	cursionFunc(fileName);
	return { tableRes, forceRes };
}
