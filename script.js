document.addEventListener('DOMContentLoaded', function() {
    const checkBtn = document.getElementById('check-btn');
    const discordInput = document.getElementById('discord-username');
    const resultSection = document.getElementById('result');

    // Total supply of tokens
    const TOTAL_SUPPLY = 34000000000; // 34 billion tokens
    // Allocate 5% of total supply to Discord role holders
    const DISCORD_ALLOCATION = TOTAL_SUPPLY * 0.05; // 1.7 billion tokens
    
    // Store user allocations to ensure they don't change
    const userAllocations = {};
    // Store total contributions to calculate allocation percentages
    let totalCommunityContributions = 0;
    // Track if we've initialized the total contributions
    let initialized = false;

    checkBtn.addEventListener('click', checkAllocation);
    discordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAllocation();
        }
    });

    async function checkAllocation() {
        const username = discordInput.value.trim();
        
        if (!username) {
            showResult('Please enter your Discord username.', 'error');
            return;
        }

        // Show loading state
        showLoading();

        try {
            // Fetch user data from sentient-stats.xyz API
            const userData = await fetchUserData(username);
            
            // All users are eligible
            if (userData) {
                // Initialize total contributions if not done yet
                if (!initialized) {
                    await initializeTotalContributions();
                    initialized = true;
                }
                
                // Check if user already has an allocation assigned
                if (!userAllocations[username]) {
                    // Calculate allocation based on role and contributions
                    userAllocations[username] = calculateAllocation(userData.role, userData.contributions);
                }
                
                showResult(`Congratulations! You are eligible for the Sentient airdrop.`, 'eligible', userAllocations[username], userData.role, userData.contributions);
            } else {
                showResult(`Sorry, we couldn't find your Discord account in our records.`, 'not-eligible');
            }
        } catch (error) {
            console.error('Error checking eligibility:', error);
            showResult('Error checking eligibility. Please try again later.', 'error');
        }
    }

    async function fetchUserData(username) {
        try {
            // This is a placeholder implementation since the actual API structure is unknown
            // In a real implementation, this would call the sentient-stats.xyz API
            // Example: const response = await fetch(`https://api.sentient-stats.xyz/user/${username}`);
            
            // For demonstration purposes, we'll simulate API response
            // In a real scenario, replace this with actual API call
            const response = await simulateApiCall(username);
            return response;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }

    // Initialize total community contributions
    async function initializeTotalContributions() {
        // In a real implementation, this would fetch total contributions from the API
        // For simulation, we'll use a fixed value
        return new Promise((resolve) => {
            setTimeout(() => {
                totalCommunityContributions = 5000; // Simulated total contributions
                resolve();
            }, 500);
        });
    }

    // Calculate allocation based on role and contributions
    function calculateAllocation(role, contributions) {
        // Base allocation by specific roles
        const baseAllocations = {
            'sentient-agi': 80000,    // 80k tokens
            'advanced': 50000,        // 50k tokens
            'early': 20000,           // 20k tokens
            'moderator': 10000,
            'contributor': 5000,
            'member': 1000
        };
        
        const baseAllocation = baseAllocations[role] || 1000;
        
        // Calculate allocation: base role value + contribution bonus
        // Each contribution point adds 100 tokens
        const allocation = baseAllocation + (contributions * 100);
        
        return allocation;
    }

    // Simulate API call - replace with actual API integration
    function simulateApiCall(username) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate different users with different roles and contributions
                const users = {
                    'user1#1234': { role: 'sentient-agi', contributions: 150 },
                    'sentientfan#5678': { role: 'advanced', contributions: 85 },
                    'cryptoenthusiast#9012': { role: 'early', contributions: 42 },
                    'web3dev#3456': { role: 'moderator', contributions: 28 },
                    'blockchainlover#7890': { role: 'contributor', contributions: 12 }
                };
                
                // For demo purposes, if user not in list, assign random role and contributions
                const roles = ['sentient-agi', 'advanced', 'early', 'moderator', 'contributor', 'member'];
                const userData = users[username] || { 
                    role: roles[Math.floor(Math.random() * roles.length)], 
                    contributions: Math.floor(Math.random() * 200) 
                };
                resolve(userData);
            }, 1500);
        });
    }

    function showLoading() {
        resultSection.innerHTML = `
            <div class="loading">Checking eligibility</div>
            <div class="loading">.</div>
            <div class="loading">.</div>
        `;
    }

    function showResult(message, status, allocation = null, role = null, contributions = null) {
        let resultHTML = `
            <div class="allocation-info ${status === 'eligible' ? 'status-eligible' : status === 'error' ? 'status-not-eligible' : 'status-not-eligible'}">
                ${message}
            </div>
        `;

        if (allocation && status === 'eligible') {
            // Calculate percentage of total Discord allocation
            const percentage = ((allocation / DISCORD_ALLOCATION) * 100).toFixed(6);
            
            resultHTML += `
                <div class="allocation-amount">
                    ${allocation.toLocaleString()} SENT
                </div>
                <div class="allocation-details">
                    Based on your role (${role}) and ${contributions} contributions.<br>
                    This is ${percentage}% of the total Discord allocation (${DISCORD_ALLOCATION.toLocaleString()} SENT).<br>
                    Your allocation is fixed and won't change on subsequent checks.
                </div>
            `;
        }

        resultSection.innerHTML = resultHTML;
    }
});
