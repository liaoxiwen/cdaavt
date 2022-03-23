import dependencyAnalysis from '../dependency-analysis'

export default function(fileName: string) {
    const dependencyMap = dependencyAnalysis();
    let res = dependencyMap[fileName];
    const visited: string[] = [];
    for(let i = 0; i < res.length; i++) {
        // 防止出现循环引用，造成死循环
        if(visited.indexOf(res[i]) !== -1) {
            continue;
        }
        visited.push(res[i]);

        if(dependencyMap[res[i]]?.length) {
            res = res.concat(dependencyMap[res[i]]);
        }
    }
    return res;
}