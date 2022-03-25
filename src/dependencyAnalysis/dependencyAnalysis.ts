import { IModuleDependency, IAnalysisRes } from "../utils/type";

export default function(fileModule: IModuleDependency[]): IAnalysisRes {
    const analysisRes: IAnalysisRes = {};
    fileModule.forEach(item => {
        const module = item.module;
        const dependency = item.dependency;
        const resKeys = Object.keys(analysisRes);
        dependency.forEach(depItem => {
            if(resKeys.includes(depItem)) {
                analysisRes[depItem].push(module);
            }else {
                analysisRes[depItem] = [module];
            }
        });
    });
    return analysisRes;
}