export enum SUFFIX {
    TS = '.ts',
    TSX = '.tsx',
    JS = '.js',
    JSX = '.jsx',
    INDEXTS = 'index.ts',
    INDEXTSX = 'index.tsx',
    INDEXJS = 'index.js',
    INDEXJSX = 'index.jsx',
}

export interface IConfig {
    pathConfig: any;
    files: string[];
    tsJsFiles: string[];
    otherFiles: string[];
}

export interface ICdaavtConfig {
    include: string[];
    exclude: string[];
}

export interface IModuleDependency {
    module: string;
    dependency: string[];
}

export interface IAnalysisRes {
    [key: string]: string[];
}

export interface IPathConfig {
    [key: string]: string[]
}

export interface INode {
    id: string;
    name: string;
    symbolSize: number;
    [key: string]: unknown;
}

export interface IEdge {
    source: string;
    target: string;
}

export interface IVisualData {
    nodes: INode[];
    edges: IEdge[];
}

