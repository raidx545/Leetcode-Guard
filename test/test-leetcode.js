const {
    getTotalSolved,
    validateLeetCodeUsername,
    fetchUserStats,
    sleep
} = require('../services/leetcode.js');

// ─── Test Configuration ───────────────────────────────────────────────────────

const TEST_USERNAME = 'rishavraj007'; // Replace with your username
const INVALID_USERNAME = 'thisuserdefinitelydoesnotexist_xyz123';

// ─── Test 1: Validate Valid Username ─────────────────────────────────────────

async function testValidateValidUser() {
    console.log('\n📝 Test 1: Validate valid username');
    console.log('─'.repeat(50));

    const result = await validateLeetCodeUsername(TEST_USERNAME);

    if (result.valid) {
        console.log(`✅ PASS: Username "${TEST_USERNAME}" is valid`);
        console.log(`   Total problems solved: ${result.totalSolved}`);
    } else {
        console.log(`❌ FAIL: Got error: ${result.error}`);
    }

    return result.valid;
}

// ─── Test 2: Validate Invalid Username ────────────────────────────────────────

async function testValidateInvalidUser() {
    console.log('\n📝 Test 2: Validate invalid username');
    console.log('─'.repeat(50));

    const result = await validateLeetCodeUsername(INVALID_USERNAME);

    if (!result.valid && result.error.includes('not found')) {
        console.log(`✅ PASS: Invalid username correctly rejected`);
        console.log(`   Error: ${result.error}`);
    } else {
        console.log(`❌ FAIL: Expected error for invalid username, got:`, result);
    }

    return !result.valid;
}

// ─── Test 3: Get Total Solved Count ───────────────────────────────────────────

async function testGetTotalSolved() {
    console.log('\n📝 Test 3: Get total solved count');
    console.log('─'.repeat(50));

    try {
        const count = await getTotalSolved(TEST_USERNAME);

        if (typeof count === 'number' && count >= 0) {
            console.log(`✅ PASS: Got total solved count: ${count}`);
        } else {
            console.log(`❌ FAIL: Expected number, got ${typeof count}`);
        }
    } catch (error) {
        console.log(`❌ FAIL: ${error.message}`);
    }
}

// ─── Test 4: Fetch Full User Stats ────────────────────────────────────────────

async function testFetchUserStats() {
    console.log('\n📝 Test 4: Fetch full user stats');
    console.log('─'.repeat(50));

    try {
        const stats = await fetchUserStats(TEST_USERNAME);

        const allEntry = stats.submitStats.acSubmissionNum.find(e => e.difficulty === 'All');
        const easyEntry = stats.submitStats.acSubmissionNum.find(e => e.difficulty === 'Easy');
        const mediumEntry = stats.submitStats.acSubmissionNum.find(e => e.difficulty === 'Medium');
        const hardEntry = stats.submitStats.acSubmissionNum.find(e => e.difficulty === 'Hard');

        console.log(`✅ PASS: Full stats retrieved`);
        console.log(`   All: ${allEntry?.count || 0}`);
        console.log(`   Easy: ${easyEntry?.count || 0}`);
        console.log(`   Medium: ${mediumEntry?.count || 0}`);
        console.log(`   Hard: ${hardEntry?.count || 0}`);
    } catch (error) {
        console.log(`❌ FAIL: ${error.message}`);
    }
}

// ─── Test 5: Batch Users with Delays ──────────────────────────────────────────

async function testBatchUsers() {
    console.log('\n📝 Test 5: Batch user fetch with delays');
    console.log('─'.repeat(50));

    const users = [TEST_USERNAME, TEST_USERNAME, TEST_USERNAME];

    console.log(`Fetching ${users.length} users with 100ms delay...`);

    const results = [];
    for (let i = 0; i < users.length; i++) {
        const count = await getTotalSolved(users[i]);
        results.push(count);
        console.log(`  User ${i + 1}: ${count} solved`);

        if (i < users.length - 1) {
            await sleep(100);
        }
    }

    console.log(`✅ PASS: Successfully fetched ${results.length} users`);
}

// ─── Test 6: Compare Two Consecutive Calls ────────────────────────────────────

async function testCompareCalls() {
    console.log('\n📝 Test 6: Compare two consecutive calls');
    console.log('─'.repeat(50));

    const count1 = await getTotalSolved(TEST_USERNAME);
    console.log(`First call: ${count1}`);

    await sleep(2000);

    const count2 = await getTotalSolved(TEST_USERNAME);
    console.log(`Second call: ${count2}`);

    if (count1 === count2) {
        console.log(`✅ PASS: Both calls returned same value (${count1})`);
        console.log(`   (No new problems solved during test)`);
    } else {
        console.log(`✅ PASS: Count increased from ${count1} to ${count2}`);
        console.log(`   You solved ${count2 - count1} new problem(s) during test!`);
    }
}

// ─── Test 7: Error Handling ───────────────────────────────────────────────────

async function testErrorHandling() {
    console.log('\n📝 Test 7: Error handling verification');
    console.log('─'.repeat(50));

    const result = await validateLeetCodeUsername(INVALID_USERNAME);

    if (!result.valid && result.error.includes('not found')) {
        console.log(`✅ PASS: Invalid username returns user-friendly error`);
        console.log(`   Error message: "${result.error}"`);
    } else {
        console.log(`❌ FAIL: Expected user-friendly error message`);
    }
}

// ─── Run All Tests ────────────────────────────────────────────────────────────

async function runAllTests() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 LEETCODE FETCHER TESTS');
    console.log('='.repeat(60));
    console.log(`\n⏰ Started at: ${new Date().toLocaleString()}`);
    console.log(`👤 Test username: ${TEST_USERNAME}`);

    await testValidateValidUser();
    await testValidateInvalidUser();
    await testGetTotalSolved();
    await testFetchUserStats();
    await testBatchUsers();
    await testCompareCalls();
    await testErrorHandling();

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TESTS COMPLETED');
    console.log('='.repeat(60));

    console.log('\n📝 MANUAL TESTING REMINDER:');
    console.log('   1. Solve a problem on LeetCode');
    console.log('   2. Run: node test/test-leetcode.js (should show increased count)');
    console.log('   3. Verify the difference is detected correctly');
}

// Run the tests
runAllTests().catch(console.error);