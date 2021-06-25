import { resolve as resolvePath, basename, dirname, extname, join as joinPath } from 'path';

const re_assignment = /^(--\w+)=(.*)$/;
const re_flag = /^-(\w+)$/;

const resolved = Array.from(new Set([resolvePath(require?.main?.filename ?? ''), resolve(require?.main?.filename ?? '')]));
const unresolved = Array.from(new Set(resolved.map((s) => basename(s))));

export function extract(argv: string[]): string[] {
	const args = [...argv];
	if (args[0] && (resolve(args[0]) === resolve(process.argv0) || basename(args[0]) === 'node')) args.shift();
	if (args[0] && (resolved.includes(resolve(args[0])) || unresolved.includes(args[0]))) args.shift();
	const result: string[] = [];
	let done = false;
	for (const item of args) {
		if (done) {
			result.push(item);
			continue;
		}
		if (item === '--') {
			done = true;
			result.push(item);
			continue;
		}
		const ass = re_assignment.exec(item);
		if (ass) {
			result.push(ass[1] as string);
			result.push(ass[2] as string);
			continue;
		}
		const flg = re_flag.exec(item);
		if (flg) {
			result.push(...(flg[1] as string).split('').map((f) => `-${f}`));
			continue;
		}
		result.push(item);
	}
	return result;
}

function resolve(path: string): string {
	path = resolvePath(path);
	const dir = dirname(path);
	const ext = extname(path) || '.js';
	const bas = basename(path, ext);
	return joinPath(dir, `${bas}.${ext}`);
}
