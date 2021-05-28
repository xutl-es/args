export type Parameter = boolean | string | number | string[];
export interface Parameters {
	[name: string]: Parameter | undefined;
}
export interface Extractor {
	(params: Parameters, args: string[]): string[];
}
export interface CustomParser {
	(item: string): Parameter;
}
