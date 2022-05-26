import { SourceFile, SyntaxKind, ObjectLiteralExpression } from 'ts-morph';
import { dependencyFileAbslutePathAnalysis } from '../utils/index';
import { IConfig, IImportValue, IAstAnalysisRes } from '../utils/type';

const DEFAULTIMPORTVALUE = 'default';

/**
 * 对以下的导出进行处理
 * export function funcName()
 * export class className{}
 * export interface interfaceName{}
 * export enum enumName{}
 * export const constName
 */
function getExportDefineDeclarationsInfo(sourceFile: SourceFile, exports: string[]) {
	const functionDeclarations = sourceFile.getFunctions();
	const interfaceDeclarations = sourceFile.getInterfaces();
	const enumDeclarations = sourceFile.getEnums();
	const classDeclarations = sourceFile.getClasses();
	const declarations = [...functionDeclarations, ...interfaceDeclarations, ...enumDeclarations, ...classDeclarations];

	declarations.forEach(declaration => {
		const name = declaration.getName() || DEFAULTIMPORTVALUE;
		let exportName = name;
		let isExport = false;
		const modifiers = declaration.getModifiers();
		modifiers.forEach(modifier => {
			const kind = modifier.getKind();
			if (kind === SyntaxKind.ExportKeyword) {
				isExport = true;
			}
			if (kind === SyntaxKind.DefaultKeyword) {
				exportName = DEFAULTIMPORTVALUE;
			}
		});
		if (isExport) {
			exports.push(exportName);
		}
	});

	const exportedVariableStatements = sourceFile
		.getVariableStatements()
		.filter(statement => statement.hasExportKeyword());
	exportedVariableStatements.forEach(statement => {
		const declarations = statement.getDeclarations();
		declarations.forEach(declaration => {
			exports.push(declaration.getName());
		});
	});
}

/**
 * 对以下的导出进行处理
 * export { xxx }
 */
function getExportDeclarationsInfo(sourceFile: SourceFile, exports: string[]) {
	const exportDeclarations = sourceFile.getExportDeclarations();
	exportDeclarations.forEach(exportDeclaration => {
		const moduleSpecifierValue = exportDeclaration.getModuleSpecifierValue();
		// 如果是"export * from 'xx'" 或者 "export { xx } from 'xx'"在导出部分不做处理
		if (!moduleSpecifierValue) {
			const namedExports = exportDeclaration.getNamedExports();
			namedExports.forEach(namedExport => {
				exports.push(namedExport.getName());
			});
		}
	});
}

/**
 * 对以下的导出进行处理
 * export default xxx
 * export default {xxx, xxx}
 */
function getExportAssignmentsInfo(sourceFile: SourceFile, exports: string[]) {
	const exportAssignments = sourceFile.getExportAssignments();
	exportAssignments.forEach(exportAssignment => {
		const expression = exportAssignment.getExpression();
		const expressionKind = expression.getKind();
		if (expressionKind === SyntaxKind.Identifier) {
			exports.push(DEFAULTIMPORTVALUE);
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
}

function getExportValues(sourceFile: SourceFile): string[] {
	const exports: string[] = [];

	// 获取导出节点的名称
	getExportDefineDeclarationsInfo(sourceFile, exports);
	getExportDeclarationsInfo(sourceFile, exports);
	getExportAssignmentsInfo(sourceFile, exports);

	return exports;
}

function getImportValues(sourceFile: SourceFile, config: IConfig) {
	const modulePath = sourceFile.getFilePath();
	const importValues: IImportValue[] = [];
	const importDeclarations = sourceFile.getImportDeclarations();
	const moduleSpeciferValues = importDeclarations.map(importDeclaration => {
		// 获取导入节点的路径
		const moduleSpeciferValue = importDeclaration.getModuleSpecifierValue();
		const moduleSpeciferAbsoluteValue = dependencyFileAbslutePathAnalysis(
			modulePath,
			moduleSpeciferValue,
			config.pathConfig
		).replace(/\\/g, '/');
		// 获取导入节点的模块名称
		const defaultImport = importDeclaration.getDefaultImport();
		if (defaultImport) {
			importValues.push({
				path: moduleSpeciferAbsoluteValue,
				names: [DEFAULTIMPORTVALUE],
			});
		}
		const namedImports = importDeclaration.getNamedImports();
		const namedImportsValue: string[] = [];
		namedImports.forEach(namedImport => {
			namedImportsValue.push(namedImport.getText());
		});
		if (namedImportsValue.length) {
			importValues.push({
				path: moduleSpeciferAbsoluteValue,
				names: namedImportsValue,
			});
		}
		return moduleSpeciferAbsoluteValue;
	});
	return { moduleSpeciferValues, importValues };
}

function getPathsFromExportNodes(sourceFile: SourceFile, config: IConfig): string[] {
	const exportPaths: string[] = [];
	const modulePath = sourceFile.getFilePath();
	const exportDeclarations = sourceFile.getExportDeclarations();
	exportDeclarations.forEach(exportDeclaration => {
		const moduleSpecifierValue = exportDeclaration.getModuleSpecifierValue();
		// 处理"export * from 'xx'" 或者 "export { xx } from 'xx'"格式的导出
		if (moduleSpecifierValue) {
			const moduleSpeciferAbsoluteValue = dependencyFileAbslutePathAnalysis(
				modulePath,
				moduleSpecifierValue,
				config.pathConfig
			).replace(/\\/g, '/');
			exportPaths.push(moduleSpeciferAbsoluteValue);
		}
	});
	return exportPaths;
}

export default function(sourceFiles: SourceFile[], config: IConfig): IAstAnalysisRes[] {
	const res = sourceFiles.map(sourceFile => {
		const exports = getExportValues(sourceFile);
		const importAnalysisiRes = getImportValues(sourceFile, config);
		const pathsFromExport = getPathsFromExportNodes(sourceFile, config);
		const dependency = Array.from(new Set([...importAnalysisiRes.moduleSpeciferValues, ...pathsFromExport]));
		return {
			module: sourceFile.getFilePath(),
			exports,
			dependency,
			dependencyDetail: importAnalysisiRes.importValues,
		};
	});
	return res;
}
