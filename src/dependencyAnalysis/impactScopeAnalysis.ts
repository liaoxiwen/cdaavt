import { IReferenceRelation } from '../utils/type';

export default function (depAnalysisRes: IReferenceRelation, fileName: string): IReferenceRelation {
    let res: IReferenceRelation = {};
    const visitedPath: string[] = [];
    const cursionFunc = (path: string) => {
        const dependency = depAnalysisRes[path];
        if (visitedPath.indexOf(path) === -1) {
            visitedPath.push(path);
            if (dependency && dependency !== {}) {
                res[path] = dependency;
                const dependencyKeys = Object.keys(dependency);
                dependencyKeys.forEach(key => cursionFunc(key));
            }
        }
    }
    cursionFunc(fileName);
    return res;
}