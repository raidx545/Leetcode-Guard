/**
 * Simple LeetCode Service - v1.1
 * Just fetches total problems solved by a user
 */

const axios = require('axios');

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
        const { data } = await axios.post(
            'https://leetcode.com/graphql',
            {
                query,
                variables: { username: username.trim() }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                    'Referer': 'https://leetcode.com',
                },
                timeout: 15000,
            }
        );

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