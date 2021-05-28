import { statSync } from 'fs';
import { resolve as resolvePath } from 'path';

import { extract } from './extract';
import { triggers, defaultify } from './utils';

import type { Extractor, CustomParser, Parameter, Parameters } from './types';

export function parse(args: string[], ...extractors: Extractor[]): string[] & { params: Parameters } {
	const params = {};
	args = extract(args);
	extractors.forEach((e) => e(params, []));
	while (args[0] && args[0][0] === '-') {
		const args0 = args[0];
		if (args0 === '--') break;
		for (const extractor of extractors) {
			const arg0: string = args[0];
			args = extractor(params, args);
			if (arg0 !== args[0]) break;
		}
		if (args0 === args[0]) break;
	}
	if (args[0] === '--') {
		args.shift();
	}

	const result: string[] & { params?: Parameters } = [...args];
	result.params = params;
	return result as string[] & { params: Parameters };
}

export function flag(name: string, deflt?: boolean, ...trigger: string[]): Extractor {
	trigger = triggers(name, trigger);
	return (params: Parameters, args: string[]) => {
		defaultify(params, name, deflt);
		params[name] = !!params[name];
		if (!trigger.includes(args[0] as string)) return args;
		params[name] = !params[name];
		return args.slice(1);
	};
}

export function string(name: string, deflt?: string, ...trigger: string[]): Extractor {
	trigger = triggers(name, trigger);
	return (params: Parameters, args: string[]) => {
		defaultify(params, name, deflt);
		if (!trigger.includes(args[0] as string)) return args;
		if (args.length < 2) throw new RangeError(`invalid parameter: ${args[0]}`);
		const value = args[1] as string;
		params[name] = value;
		return args.slice(2);
	};
}

export function file(name: string, deflt?: string, ...trigger: string[]): Extractor {
	trigger = triggers(name, trigger);
	if (deflt) {
		deflt = resolvePath(deflt);
		const stat = statSync(deflt);
		if (!stat || !stat.isFile()) throw new RangeError(`invalid value for file ${name}: ${deflt}`);
	}
	return (params: Parameters, args: string[]) => {
		defaultify(params, name, deflt);
		if (!trigger.includes(args[0] as string)) return args;
		if (args.length < 2) throw new RangeError(`invalid parameter: ${args[0]}`);
		let value = resolvePath(args[1] as string);
		const stat = statSync(value, { throwIfNoEntry: false });
		if (!stat || !stat.isFile()) throw new RangeError(`invalid value for file ${name}: ${value}`);
		params[name] = value;
		return args.slice(2);
	};
}
export function folder(name: string, deflt?: string, ...trigger: string[]): Extractor {
	trigger = triggers(name, trigger);
	if (deflt) {
		deflt = resolvePath(deflt);
		const stat = statSync(deflt);
		if (!stat || !stat.isDirectory()) throw new RangeError(`invalid value for directory ${name}: ${deflt}`);
	}
	return (params: Parameters, args: string[]) => {
		defaultify(params, name, deflt);
		if (!trigger.includes(args[0] as string)) return args;
		if (args.length < 2) throw new RangeError(`invalid parameter: ${args[0]}`);
		let value = resolvePath(args[1] as string);
		const stat = statSync(value, { throwIfNoEntry: false });
		if (!stat || !stat.isDirectory()) throw new RangeError(`invalid value for directory ${name}: ${value}`);
		params[name] = value;
		return args.slice(2);
	};
}

export function number(name: string, deflt?: number, ...trigger: string[]): Extractor {
	trigger = triggers(name, trigger);
	return (params: Parameters, args: string[]) => {
		defaultify(params, name, deflt);
		if (!trigger.includes(args[0] as string)) return args;
		if (args.length < 2) throw new RangeError(`invalid parameter: ${args[0]}`);
		const value = args[1];
		if ('string' !== typeof value) throw new RangeError(`invalid value for number ${name}: ${value}`);
		const number = parseFloat(value);
		if (Number.isNaN(number)) throw new RangeError(`invalid value for number ${name}: ${value}`);
		params[name] = number;
		return args.slice(2);
	};
}

export function strings(name: string, deflt: string[] = [], ...trigger: string[]): Extractor {
	trigger = triggers(name, trigger);
	return (params: Parameters, args: string[]) => {
		defaultify(params, name, deflt);
		if (!trigger.includes(args[0] as string)) return args;
		if (args.length < 2) throw new RangeError(`invalid parameter: ${args[0]}`);
		const value = args[1];
		if ('string' !== typeof value) throw new RangeError(`invalid value for strings ${name}: ${value}`);
		if (!Array.isArray(params[name])) throw new RangeError(`invalid value for strings ${name}: ${params[name]}`);
		(params[name] as string[]).push(value);
		return args.slice(2);
	};
}

export function custom(name: string, parser: CustomParser, deflt?: Parameter, ...trigger: string[]): Extractor {
	trigger = triggers(name, trigger);
	return (params: Parameters, args: string[]) => {
		defaultify(params, name, deflt);
		if (!trigger.includes(args[0] as string)) return args;
		if (args.length < 2) throw new RangeError(`invalid parameter: ${args[0]}`);
		params[name] = parser(args[1] as string);
		return args.slice(2);
	};
}

export type { Extractor, CustomParser, Parameter, Parameters };
export default Object.assign(parse, { flag, string, file, folder, number, strings, custom });
