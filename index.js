import {getCategory, isAmbiguous, isFullWidth, isWide} from './lookup.js';

function validate(codePoint) {
	if (!Number.isSafeInteger(codePoint)) {
		throw new TypeError(`Expected a code point, got \`${typeof codePoint}\`.`);
	}
}

// Cache for width calculations (LRU-style with size limit)
const widthCache = new Map();
const MAX_CACHE_SIZE = 1000;

export function eastAsianWidthType(codePoint) {
	validate(codePoint);

	return getCategory(codePoint);
}

export function eastAsianWidth(codePoint, {ambiguousAsWide = false} = {}) {
	validate(codePoint);

	// Fast path for ASCII characters (most common case)
	if (codePoint >= 0x20 && codePoint <= 0x7E) {
		return 1;
	}

	// Check cache
	const cacheKey = ambiguousAsWide ? `${codePoint}:w` : codePoint;
	if (widthCache.has(cacheKey)) {
		return widthCache.get(cacheKey);
	}

	// Calculate width
	const width = (
		isFullWidth(codePoint)
		|| isWide(codePoint)
		|| (ambiguousAsWide && isAmbiguous(codePoint))
	) ? 2 : 1;

	// Add to cache with LRU behavior
	if (widthCache.size >= MAX_CACHE_SIZE) {
		// Remove oldest entry (first key)
		const firstKey = widthCache.keys().next().value;
		widthCache.delete(firstKey);
	}

	widthCache.set(cacheKey, width);

	return width;
}

// Private exports for https://github.com/sindresorhus/is-fullwidth-code-point
export {isFullWidth as _isFullWidth, isWide as _isWide} from './lookup.js';
