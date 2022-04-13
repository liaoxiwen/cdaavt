import {
    IAstAnalysisRes,
    IAnalysisRes,
    IFilesExports,
    IReferenceRelation,
    IFilesImports,
    INeedFindRealDependency
} from "../utils/type";

function getFilesImports(astAnalysisRes: IAstAnalysisRes[]): IFilesImports {
    const filesImports: IFilesImports = {};

    astAnalysisRes.forEach(item => {
        filesImports[item.module] = item.dependency;
    });

    return filesImports;
}

function getFilesExports(astAnalysisRes: IAstAnalysisRes[]): IFilesExports {
    const filesExports: IFilesExports = {};

    astAnalysisRes.forEach(item => {
        filesExports[item.module] = item.exports;
    });

    return filesExports;
}

function getReferenceRelation(astAnalysisRes: IAstAnalysisRes[]): IReferenceRelation {
    const referenceRelation: IReferenceRelation = {};

    astAnalysisRes.forEach(item => {
        const dependencyDetail = item.dependencyDetail;
        const module = item.module;
        dependencyDetail.forEach(detail => {
            const referenceRelationKeys = Object.keys(referenceRelation);
            const path = detail.path;
            const names = detail.names;

            if (referenceRelationKeys.indexOf(path) === -1) {
                referenceRelation[path] = [{
                    path: module,
                    names
                }];
            } else {
                referenceRelation[path].push({
                    path: module,
                    names,
                });
            }
        });
    });

    return referenceRelation;
}

function findRealDependencyModule(referenceRelation: IReferenceRelation, filesExports: IFilesExports, filesImports: IFilesImports) {
    const needFindRealDependency: INeedFindRealDependency[] = [];

    for (const module in referenceRelation) {
        const exports = filesExports[module];
        if (exports) {
            const moduleInfoes = referenceRelation[module];
            referenceRelation[module] = moduleInfoes.filter(info => {
                const { path, names } = info;
                info.names = names.filter(name => {
                    if (exports.indexOf(name) === -1) {
                        needFindRealDependency.push({
                            path,
                            name,
                            dependencys: filesImports[module]
                        });
                        return false;
                    }
                    return true;
                });
                if (info.names.length) {
                    return true;
                }
                return false;
            });
        }
    }

    needFindRealDependency.forEach(item => {
        const { path, name, dependencys } = item;
        dependencys.forEach(dependency => {
            const dependencyExports = filesExports[dependency];
            if (dependencyExports) {
                if (dependencyExports.indexOf(name) !== -1) {
                    const newReferenceRelation = {
                        path: path,
                        names: [name]
                    }
                    if (referenceRelation[dependency]) {
                        referenceRelation[dependency].push(newReferenceRelation);
                    } else {
                        referenceRelation[dependency] = [newReferenceRelation];
                    }
                }
            }
        });
    });

    
}

export default function (astAnalysisRes: IAstAnalysisRes[]): IAnalysisRes {
    const analysisRes: IAnalysisRes = {};
    const filesImports = getFilesImports(astAnalysisRes);
    const filesExports = getFilesExports(astAnalysisRes);
    const referenceRelation = getReferenceRelation(astAnalysisRes);
    console.log(referenceRelation);
    findRealDependencyModule(referenceRelation, filesExports, filesImports);
    console.log(referenceRelation);
    return analysisRes;
}