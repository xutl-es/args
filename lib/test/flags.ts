import { describe, it } from '@xutl/test';
import { strict as assert } from 'assert';

import { parse, flag } from '../args';

const args = [process.argv0, process.argv[1] as string];
describe('args', () => {
	describe('flags', () => {
		it('combined', () => {
			const parsed = parse([...args, '-dxz'], flag('dynamic'), flag('extract', true, '-x', '--extract'), flag('zoom'), flag('numpty'));
			assert.deepStrictEqual(parsed.params, {
				dynamic: true,
				extract: false,
				zoom: true,
				numpty: false,
			});
		});
		it('separated', () => {
			const parsed = parse([...args, '-d', '-x', '-z'], flag('dynamic'), flag('extract', true, '-x', '--extract'), flag('zoom'), flag('numpty'));
			assert.deepStrictEqual(parsed.params, {
				dynamic: true,
				extract: false,
				zoom: true,
				numpty: false,
			});
		});
		it('long', () => {
			const parsed = parse([...args, '--numpty'], flag('dynamic', false, '-d'), flag('extract', true, '-x'), flag('zoom', false, '-z'), flag('numpty', false, '-n', '--numpty'));
			assert.deepStrictEqual(parsed.params, {
				dynamic: false,
				extract: true,
				zoom: false,
				numpty: true,
			});
		});
		it('multi', () => {
			const parsed = parse([...args, '-n', '--numpty'], flag('dynamic', false, '-d'), flag('extract', true, '-x'), flag('zoom', false, '-z'), flag('numpty', false, '-n', '--numpty'));
			assert.deepStrictEqual(parsed.params, {
				dynamic: false,
				extract: true,
				zoom: false,
				numpty: false,
			});
		});
		it('args', () => {
			const expected = ['hullo', 'ma', 'wee', 'darlins'];
			const parsed = parse([...args, '-dxz', ...expected], flag('dynamic'), flag('extract', true, '-x', '--extract'), flag('zoom'), flag('numpty'));
			assert.deepStrictEqual(parsed.params, {
				dynamic: true,
				extract: false,
				zoom: true,
				numpty: false,
			});
			assert.deepStrictEqual([...parsed], expected);
		});
	});
});
