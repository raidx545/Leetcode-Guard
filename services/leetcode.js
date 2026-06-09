const axios = require('axios');

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

const RETRY_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 2000;

// ─── GraphQL Query ────────────────────────────────────────────────────────────

const USER_PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

// ─── Helper Functions ─────────────────────────────────────────────────────────

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getBackoffDelay(attempt) {
    return RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1); // 2s, 4s, 8s
}

// ─── Core API Call ────────────────────────────────────────────────────────────

async function callLeetCodeAPI(username) {
    const response = await axios.post(
        LEETCODE_API_URL,
        {
            query: USER_PROFILE_QUERY,
            variables: { username },
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                Referer: 'https://leetcode.com',
            },
            timeout: 10000,
        }
    );

    const matchedUser = response.data?.data?.matchedUser;

    if (!matchedUser) {
        const err = new Error(`LeetCode user "${username}" not found`);
        err.code = 'USER_NOT_FOUND';
        throw err;
    }

    if (!matchedUser.submitStats?.acSubmissionNum) {
        const err = new Error(`Invalid profile data for "${username}"`);
        err.code = 'INVALID_PROFILE_DATA';
        throw err;
    }

    return matchedUser;
}

// ─── Public: Fetch User Stats with Retry ──────────────────────────────────────

async function fetchUserStats(username) {
    let lastError;

    for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
        try {
            return await callLeetCodeAPI(username);
        } catch (err) {
            lastError = err;

            if (err.code === 'USER_NOT_FOUND' || err.code === 'INVALID_PROFILE_DATA') {
                throw err;
            }

            if (attempt === RETRY_ATTEMPTS) {
                console.error(
                    `[LeetCode] All ${RETRY_ATTEMPTS} attempts failed for "${username}":`,
                    err.message
                );
                break;
            }

            const delayMs = getBackoffDelay(attempt);
            console.warn(
                `[LeetCode] Attempt ${attempt}/${RETRY_ATTEMPTS} failed for "${username}". ` +
                `Retrying in ${delayMs / 1000}s... (${err.message})`
            );
            await sleep(delayMs);
        }
    }

    throw lastError;
}

// ─── Public: Get Total Solved Count ───────────────────────────────────────────

async function getTotalSolved(username) {
    const userData = await fetchUserStats(username);

    const allEntry = userData.submitStats.acSubmissionNum.find(
        (entry) => entry.difficulty === 'All'
    );

    return allEntry ? allEntry.count : 0;
}

// ─── Public: Validate Username for Registration ───────────────────────────────

async function validateLeetCodeUsername(username) {
    try {
        const totalSolved = await getTotalSolved(username);
        return { valid: true, totalSolved };
    } catch (err) {
        if (err.code === 'USER_NOT_FOUND') {
            return {
                valid: false,
                error: 'LeetCode username not found. Please check and try again.'
            };
        }
        if (err.code === 'INVALID_PROFILE_DATA') {
            return {
                valid: false,
                error: 'Unable to fetch LeetCode data. Please make sure your profile is public.'
            };
        }
        return {
            valid: false,
            error: 'Could not reach LeetCode API. Please try again in a moment.'
        };
    }
}

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
    fetchUserStats,
    getTotalSolved,
    validateLeetCodeUsername,
    sleep,
};