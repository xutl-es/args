import type { Parameter, Parameters } from './types';

export function triggers(name: string, triggers: string[]) {
	if (!name) throw new RangeError(`invalid name for parameter: ${name}`);
	if (!triggers.length) {
		if (name.length > 1) triggers.push(`--${name}`);
		triggers.push(`-${name[0]}`);
	}
	for (const trigger of triggers) {
		if (!trigger.match(/^(?:-\w|--\w{2,99})$/)) throw new RangeError(`invalid trigger ${trigger} for parameter: ${name}`);
	}
	return triggers;
}

export function defaultify(params: Parameters, name: string, value?: Parameter) {
	if ('undefined' !== typeof params[name]) return;
	if ('undefined' === typeof value) return;
	params[name] = value;
}
