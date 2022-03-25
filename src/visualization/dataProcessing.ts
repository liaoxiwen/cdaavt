import { IAnalysisRes, IEdge, IVisualData } from "../utils/type";

export default function (data: IAnalysisRes, files: string[]): IVisualData {
    const SYMBOLSIZE = 5;
    const modules = Array.from(new Set([...Object.keys(data), ...files]));
    const nodes = modules.map(module => ({
        id: module,
        name: module,
        symbolSize: SYMBOLSIZE
    }));
    const edges: IEdge[] = [];
    Object.keys(data).forEach(key => {
        data[key].forEach(value => {
            edges.push({
                source: key,
                target: value
            });
        });
    });
    return {
        nodes,
        edges
    };
}