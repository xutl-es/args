import { resolve, basename } from 'path';

const re_assignment = /^(--\w+)=(.*)$/;
const re_flag = /^-(\w+)$/;

export function extract(argv: string[]): string[] {
	const args = [...argv];
	if (args[0] && (resolve(args[0]) === resolve(process.argv0) || basename(args[0]) === 'node')) args.shift();
	if (args[0] && require.main && resolve(args[0]) === resolve(require.main.filename)) args.shift();
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
