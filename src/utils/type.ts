export interface ICDAAVTOPTIONS {
    run?: boolean;
    output?: string;
    format?: string;
    path?:  string;
}

export enum ENUM_FORMAT {
    JSON = 'json',
    HTML = 'html',
    OUTPUT = 'testReport',
    FORMAT = 'json',
}

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

export interface IPathConfig {
    [key: string]: string[]
}

export interface INode {
    id: string;
    name: string;
    symbolSize: number;
    [key: string]: unknown;
}

export interface IImportValue {
    path: string;
    names: string[];
}

export interface INeedFindRealDependency {
    path: string;
    name: string;
    dependencys: string[];
}

export interface IAstAnalysisRes {
    module: string;
    exports: string[];
    dependency: string[];
    dependencyDetail: IImportValue[];
}

export interface IFilesImports {
    [key: string]: string[];
}

export interface IFilesExports {
    [key: string]: string[];
}

export interface IReferenceRelation {
    [key: string]: {
        [key: string]: string[];
    };
}

export interface IAnalysisRes {
    [key: string]: string[];
}

export enum ENUM_TYPE {
    SCOPE_TYPE = 'scope',
    GLOBAL_TYPE = 'golbal',
}

export interface IEdge {
    source: string;
    target: string;
    value?: number;
    tooltip?: {
        formatter: string | Function;
    },
    label?: {
        show?: boolean,
        formatter?: string | Function;
    }
}

export interface IVisualData {
    nodes: INode[];
    edges: IEdge[];
}

