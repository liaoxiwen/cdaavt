import {
    IAstAnalysisRes,
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
                referenceRelation[path] = {
                    [module]: names
                };
            } else {
                referenceRelation[path][module] = names;
            }
        });
    });

    return referenceRelation;
}

function findRealDependencyModule(referenceRelation: IReferenceRelation, filesExports: IFilesExports, filesImports: IFilesImports) {
    const needFindRealDependency: INeedFindRealDependency[] = [];

    for (const relation in referenceRelation) {
        const exports = filesExports[relation];
        if (exports) {
            const moduleInfoes = referenceRelation[relation];
            const moduleNames = Object.keys(moduleInfoes);
            moduleNames.forEach(name => {
                const dependencyModules = moduleInfoes[name];
                moduleInfoes[name] = dependencyModules.filter(module => {
                    if (exports.indexOf(module) === -1) {
                        needFindRealDependency.push({
                            path: name,
                            name: module,
                            dependencys: filesImports[relation]
                        });
                        return false;
                    }
                    return true;
                });
                if (moduleInfoes[name].length === 0) {
                    delete moduleInfoes[name];
                }
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
                        [path]: [name]
                    };
                    if (referenceRelation[dependency]) {
                        if (referenceRelation[dependency][path]) {
                            referenceRelation[dependency][path].push(name);
                        } else {
                            referenceRelation[dependency][path] = [name];
                        }
                    } else {
                        referenceRelation[dependency] = newReferenceRelation;
                    }
                }
            }
        });
    });
}

export default function (astAnalysisRes: IAstAnalysisRes[]): IReferenceRelation {
    const filesImports = getFilesImports(astAnalysisRes);
    const filesExports = getFilesExports(astAnalysisRes);
    const referenceRelation = getReferenceRelation(astAnalysisRes);
    findRealDependencyModule(referenceRelation, filesExports, filesImports);
    return referenceRelation;
}