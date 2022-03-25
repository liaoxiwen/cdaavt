import { IAnalysisRes } from '../utils/type';
import dataProcessing from './dataProcessing';
import createHtml from './html';

export default function(data: IAnalysisRes, files: string[]): string {
    const visualData = dataProcessing(data, files);
    const visualizationResults = createHtml(visualData);
    return visualizationResults;
}