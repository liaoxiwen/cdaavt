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

export interface IFileModule {
    module: string;
    dependency: string[];
}

export interface IPathConfig {
    [key: string]: string[]
}