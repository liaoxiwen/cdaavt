import { IReferenceRelation, IEdge, IVisualData } from "../utils/type";

export default function (data: IReferenceRelation, files: string[]): IVisualData {
    const SYMBOLSIZE = 5;
    const modules = Array.from(new Set([...Object.keys(data), ...files]));
    const nodes = modules.map(module => {
        const dependencys = data[module] ?? {};
        const len = Object.keys(dependencys).length;
        return {
            id: module,
            name: module,
            symbolSize: SYMBOLSIZE + len % SYMBOLSIZE + parseInt(String(len / SYMBOLSIZE)),
        }
    });
    const edges: IEdge[] = [];
    for (const key in data) {
        const dependencys = data[key];
        Object.keys(dependencys).forEach(dependencyKey => {
            const dependencyNames = dependencys[dependencyKey];
            edges.push({
                source: key,
                target: dependencyKey,
                tooltip: {
                    formatter: `module: ${(dependencyNames.join(','))}`,
                },
                label: {
                    formatter: dependencyNames.join(','),
                },
            });
        });
    }
    return {
        nodes,
        edges
    };
}