import {eastAsianWidth, eastAsianWidthType} from './index.js';

// Test cases covering different character types
const testCases = [
	// ASCII (most common)
	...Array.from({length: 50}, () => Math.floor(Math.random() * (0x7E - 0x20) + 0x20)),
	// Wide characters (CJK)
	0x4E00, 0x4E01, 0x4E03, 0x4E07, 0x4E08, 0x4E09, 0x4E0A, 0x4E0B,
	// Ambiguous characters
	0xA1, 0xA4, 0xA7, 0xB0, 0xB1, 0xB2,
	// Fullwidth characters
	0xFF01, 0xFF02, 0xFF03, 0xFF20,
	// Emoji
	0x1F600, 0x1F601, 0x1F602, 0x1F603,
	// Narrow characters
	0xA2, 0xA3, 0xA5,
	// Neutral characters
	0x10, 0x11, 0x12, 0x13,
];

function benchmark(name, fn, iterations = 100000) {
	const start = performance.now();
	for (let i = 0; i < iterations; i++) {
		for (const codePoint of testCases) {
			fn(codePoint);
		}
	}
	const end = performance.now();
	const totalOps = iterations * testCases.length;
	const duration = end - start;
	const opsPerSecond = (totalOps / duration) * 1000;

	console.log(`${name}:`);
	console.log(`  Total time: ${duration.toFixed(2)}ms`);
	console.log(`  Operations: ${totalOps.toLocaleString()}`);
	console.log(`  Ops/sec: ${opsPerSecond.toLocaleString(undefined, {maximumFractionDigits: 0})}`);
	console.log(`  Time per op: ${(duration / totalOps * 1000000).toFixed(3)}ns`);
	console.log('');

	return {duration, totalOps, opsPerSecond};
}

console.log('=== Performance Benchmarks ===\n');
console.log(`Test cases: ${testCases.length} different code points`);
console.log(`Distribution:`);
console.log(`  - ASCII: ~50 (fast path)`);
console.log(`  - Wide (CJK): 8`);
console.log(`  - Ambiguous: 6`);
console.log(`  - Fullwidth: 4`);
console.log(`  - Emoji: 4`);
console.log(`  - Narrow: 3`);
console.log(`  - Neutral: 4`);
console.log('\n');

// Benchmark eastAsianWidth (most commonly used)
const widthResults = benchmark('eastAsianWidth()', eastAsianWidth, 100000);

// Benchmark eastAsianWidthType
const typeResults = benchmark('eastAsianWidthType()', eastAsianWidthType, 100000);

// Benchmark with ambiguousAsWide option
const widthAmbResults = benchmark(
	'eastAsianWidth() with ambiguousAsWide',
	(cp) => eastAsianWidth(cp, {ambiguousAsWide: true}),
	100000,
);

console.log('=== Summary ===');
console.log(`eastAsianWidth(): ${widthResults.opsPerSecond.toLocaleString(undefined, {maximumFractionDigits: 0})} ops/sec`);
console.log(`eastAsianWidthType(): ${typeResults.opsPerSecond.toLocaleString(undefined, {maximumFractionDigits: 0})} ops/sec`);
console.log(`eastAsianWidth(ambiguous): ${widthAmbResults.opsPerSecond.toLocaleString(undefined, {maximumFractionDigits: 0})} ops/sec`);
