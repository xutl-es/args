import { describe, it } from '@xutl/test';
import { strict as assert } from 'assert';

import { extract } from '../extract';

const args = [process.argv0, process.argv[1] as string];
describe('extract', () => {
	const expect = ['hullo', 'me', 'wee', 'darlins'];
	it('node-style', () => {
		const parsed = extract([...args, ...expect]);
		assert.deepStrictEqual(parsed, expect);
	});
	it('plain-style', () => {
		const parsed = extract([...expect]);
		assert.deepStrictEqual(parsed, expect);
	});
	it('combined flags', () => {
		const parsed = extract([...args, '-dxz']);
		assert.equal(parsed.length, 3);
		assert.deepStrictEqual(parsed, ['-d', '-x', '-z']);
	});
});
