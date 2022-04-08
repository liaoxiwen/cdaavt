import { SourceFile, SyntaxKind, ObjectLiteralExpression } from 'ts-morph';
import { dependencyFileAbslutePathAnalysis } from '../utils/index';
import { IConfig, IImportValue, IModuleDependency } from '../utils/type';

const DEFAULTIMPORTVALUE = 'default';

function getExportValues(sourceFile: SourceFile): string[] {
    const exports: string[] = [];

    // 获取导出节点的名称，导出节点有三种情况
    const exportedDeclarations = sourceFile.getExportedDeclarations();
    for (const [name] of exportedDeclarations) {
        exports.push(name);
    }

    const exportDeclarations = sourceFile.getExportDeclarations();
    exportDeclarations.forEach(exportDeclaration => {
        const namedExports = exportDeclaration.getNamedExports();
        namedExports.forEach(namedExport => {
            exports.push(namedExport.getName());
        });
    });

    const exportAssignments = sourceFile.getExportAssignments();
    exportAssignments.forEach(exportAssignment => {
        const expression = exportAssignment.getExpression();
        const expressionKind = expression.getKind();
        if (expressionKind === SyntaxKind.Identifier) {
            exports.push(expression.getText());
        }
        if (expressionKind === SyntaxKind.ObjectLiteralExpression) {
            const properties = (expression as ObjectLiteralExpression).getProperties();
            properties.forEach(property => {
                const propertyKind = property.getKind();
                if (propertyKind === SyntaxKind.ShorthandPropertyAssignment) {
                    exports.push(expression.getText());
                }
            });
        }
    });
    return exports;
}

function getImportValues(sourceFile: SourceFile, config: IConfig) {
    const modulePath = sourceFile.getFilePath();
    // 获取导入节点的路径
    const importValues: IImportValue[] = [];
    const importDeclarations = sourceFile.getImportDeclarations();
    const moduleSpeciferValues = importDeclarations.map(importDeclaration => {
        const moduleSpeciferValue = importDeclaration.getModuleSpecifierValue();
        const moduleSpeciferAbsoluteValue =
            dependencyFileAbslutePathAnalysis(modulePath, moduleSpeciferValue, config.pathConfig)
                .replace(/\\/g, '/');
        const defaultImport = importDeclaration.getDefaultImport();
        if (defaultImport) {
            importValues.push({
                path: moduleSpeciferAbsoluteValue,
                name: DEFAULTIMPORTVALUE
            });
        }
        const namedImports = importDeclaration.getNamedImports();
        namedImports.forEach(namedImport => {
            importValues.push({
                path: moduleSpeciferAbsoluteValue,
                name: namedImport.getText()
            });
        });
        return moduleSpeciferAbsoluteValue;
    });
    return { moduleSpeciferValues, importValues };
}

export default function (sourceFiles: SourceFile[], config: IConfig): IModuleDependency[] {
    const res = sourceFiles.map(sourceFile => {
        const exports = getExportValues(sourceFile);
        const importAnalysisiRes = getImportValues(sourceFile, config);
        return {
            module: sourceFile.getFilePath(),
            exports,
            dependency: importAnalysisiRes.moduleSpeciferValues,
            dependencyDetail: importAnalysisiRes.importValues
        }
    });
    return res;
}