import { writeJson } from './utils/common';

interface IJSON {
    [key: string]: unknown,
}
export function initConfig() {
    const configJson: IJSON = {
        include: ['src']
    };
    writeJson<IJSON>('./cdaavt.config.json', configJson);
}