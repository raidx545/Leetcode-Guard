/**
 * Simple LeetCode Service - v1.1
 * Just fetches total problems solved by a user
 */

async function getTotalSolved(username) {
    // Validate username
    if (!username || username.trim() === '') {
        throw new Error('Username is required');
    }

    const query = `
        query getUserProfile($username: String!) {
            matchedUser(username: $username) {
                submitStats: submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { username: username.trim() }
            })
        });

        // Check HTTP status before parsing
        if (!response.ok) {
            throw new Error(`LeetCode API returned ${response.status}`);
        }

        const data = await response.json();

        // Check if user exists
        if (!data.data || !data.data.matchedUser) {
            throw new Error('User not found');
        }

        // Safely extract total solved count
        const stats = data.data.matchedUser.submitStats.acSubmissionNum;
        const totalEntry = stats.find(s => s.difficulty === 'All');

        if (!totalEntry) {
            throw new Error('Could not retrieve solved count');
        }

        const totalSolved = totalEntry.count;

        return {
            username: username.trim(),
            totalSolved: totalSolved
        };

    } catch (error) {
        throw error;
    }
}

// Simple export for Node.js only
module.exports = { getTotalSolved };