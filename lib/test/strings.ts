import { describe, it } from '@xutl/test';
import { strict as assert } from 'assert';

import { parse, strings, string } from '../args';

const args = [process.argv0, process.argv[1] as string];
describe('args', () => {
	describe('strings', () => {
		it('single', () => {
			const parsed = parse([...args, '--strs', 'hello'], strings('strs'));
			assert.deepStrictEqual(parsed.params, {
				strs: ['hello'],
			});
		});
		it('multi', () => {
			const parsed = parse([...args, '--strs', 'hello', '--strs', 'world'], strings('strs'));
			assert.deepStrictEqual(parsed.params, {
				strs: ['hello', 'world'],
			});
		});
		it('seperate', () => {
			const parsed = parse([...args, '--strs', 'hello', '--single', 'abc', '--strs', 'world'], string('single'), strings('strs'));
			assert.deepStrictEqual(parsed.params, {
				single: 'abc',
				strs: ['hello', 'world'],
			});
		});
		it('mix', () => {
			const parsed = parse([...args, '--s1', 'hello', '--s1', 'world', '--s2', 'abc', '--s2', '123'], strings('s1'), strings('s2'));
			assert.deepStrictEqual(parsed.params, {
				s1: ['hello', 'world'],
				s2: ['abc', '123'],
			});
		});
		it('mix2', () => {
			const parsed = parse([...args, '--s1', 'hello', '--s2', 'abc', '--s1', 'world', '--s2', '123'], strings('s1'), strings('s2'));
			assert.deepStrictEqual(parsed.params, {
				s1: ['hello', 'world'],
				s2: ['abc', '123'],
			});
		});
	});
});
