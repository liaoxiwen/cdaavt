import { ImportDeclaration, Project, SourceFile } from 'ts-morph';
import { isFileExists} from '../utils/common';

function getAst() {
    let project = new Project();
    const jsConfigPath = 'jsconfig.json';
    const tsConfigPath = 'tsconfig.json';
    if (isFileExists(jsConfigPath)) {
        project = new Project({
            tsConfigFilePath: jsConfigPath,
        });
    }
    if (isFileExists(tsConfigPath)) {
        project = new Project({
            tsConfigFilePath: tsConfigPath,
        });
    }
    const sourceFiles = project.getSourceFiles();
    return sourceFiles;
}

function analysisImportDeclarations(nodes: ImportDeclaration[]) {
    // 去掉样式引用
    const effectiveNodes = nodes.filter(node => {
        const reg = /\.less|\.css|\.scss/;
        // 获取引用路径
        const moduleSpecifierValue = node.getModuleSpecifierValue();
        return !reg.test(moduleSpecifierValue);
    });

    // 将路径转换为绝对路径
    const moduleSpecifierValues = effectiveNodes.map(node => {
        const reg = /(\@\/)|(\.\/)|(\.\.\/)/;
        const moduleSpecifierValue = node.getModuleSpecifierValue();
        if (reg.test(moduleSpecifierValue)) {
            // TODO: getModuleSpecifierSourceFile函数可能返回undefined
            return node.getModuleSpecifierSourceFile()?.getFilePath() || moduleSpecifierValue;
        }
        return moduleSpecifierValue;
    });
    return moduleSpecifierValues;
}

interface IFileNodes {
    path: string;
    children: string[];
}

function astAnalysis(sourceFiles: SourceFile[]): IFileNodes[] {
    return sourceFiles.map(item => {
        const importDeclarations = item.getImportDeclarations();
        const filePath = item.getFilePath();
        const moduleSpecifierValues = analysisImportDeclarations(importDeclarations);
        return {
            path: filePath,
            children: moduleSpecifierValues,
        };
    });
}

interface IDependencyNodes {
    [key: string]: {
        path: string;
        weight: number;
        children?: IDependencyNodes;
    }
}

function dependencyAnalyz(dependencyNodes: IFileNodes[]) {
    const dealedNodes: IDependencyNodes = {};
    dependencyNodes.forEach(node => {
        const keys = Object.keys(dealedNodes);
        if (keys.indexOf(node.path) === -1) {
            dealedNodes[node.path] = {
                path: node.path,
                weight: 0,
            }
        }
        node.children.forEach(child => {
            if (keys.indexOf(child) === -1) {
                dealedNodes[child] = {
                    path: child,
                    weight: 1,
                    children: {
                        [node.path]: {
                            path: node.path,
                            weight: 0,
                        },
                    },
                };
            } else {
                const children = dealedNodes[child].children || {};
                const insert = {
                    [node.path]: {
                        path: node.path,
                        weight: 0,
                    },
                };
                dealedNodes[child].weight += 1;
                dealedNodes[child].children = { ...children, ...insert };
            }
        });
    });
    // writeJson('analyz-result.json', dealedNodes);
    return dealedNodes;
}

function caculateWeight(nodes: IDependencyNodes) {
    for (const nodeKey in nodes) {
        const caculate = (key: string, visited: string[]) => {
            if (visited.indexOf(key) !== -1) {
                return 0;
            }
            visited.push(key);
            if (!nodes[key].children) {
                return 0;
            }
            let weight = nodes[key].weight;
            for (const childKey in nodes[key].children) {
                weight += caculate(childKey, visited);
            }
            return weight;
        }
        nodes[nodeKey].weight = caculate(nodeKey, []);
    }
}

interface INodes {
    x: number;
    y: number;
    id: string;
    label: string;
    size: number;
    color: string;
}

interface IEdges {
    sourceID: string;
    targetID: string;
}

function transEchartsNodesAndEdges(dealedNodes: IDependencyNodes) {
    const nodes: INodes[] = [];
    const edges: IEdges[] = [];
    const number = Object.keys(dealedNodes).length;
    for (const nodeKey in dealedNodes) {
        const x = parseInt((Math.random() * number).toString());
        const y = parseInt((Math.random() * number).toString());
        const size = 5;
        const node: INodes = {
            x,
            y,
            id: nodeKey,
            label: nodeKey,
            size,
            color: `#${('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6)}`,
        };
        nodes.push(node);

        for(const childKey in dealedNodes[nodeKey].children) {
            const edge: IEdges = {
                sourceID: childKey,
                targetID: nodeKey,
            };
            edges.push(edge);
        }
    }
    const echartsData = {
        nodes,
        edges
    };
    return echartsData;
}

export default function depAnalysis() {
    const sourceFiles = getAst();
    const dependencyNodes = astAnalysis(sourceFiles);
    const dealedNodes = dependencyAnalyz(dependencyNodes);
    caculateWeight(dealedNodes);
    return transEchartsNodesAndEdges(dealedNodes);
}
