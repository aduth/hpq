/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import getPath from '../src/get-path';

describe('getPath()', () => {
	it('should return simple path value', () => {
		const value = getPath({ a: 1 }, 'a');

		expect(value).to.equal(1);
	});

	it('should return deep value', () => {
		const value = getPath({ a: { b: 1 } }, 'a.b');

		expect(value).to.equal(1);
	});

	it('should return undefined on missing simple path value', () => {
		const value = getPath({}, 'a');

		expect(value).to.be.undefined;
	});

	it('should return undefined on missing deep path value', () => {
		const value = getPath({}, 'a.b');

		expect(value).to.be.undefined;
	});

	it('should allow retrieving by prototype', () => {
		const value = getPath({}, 'valueOf');

		expect(value).to.be.a('function');
	});

	it('should allow deep retrieving by prototype', () => {
		const value = getPath({ a: {} }, 'a.valueOf');

		expect(value).to.be.a('function');
	});
});
