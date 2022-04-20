import { IReferenceRelation } from '../utils/type';
import dataProcessing from './dataProcessing';
import createHtml from './html';

export default function(data: IReferenceRelation, files: string[]): string {
    const visualData = dataProcessing(data, files);
    const visualizationResults = createHtml(visualData);
    return visualizationResults;
}