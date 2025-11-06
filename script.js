document.addEventListener('DOMContentLoaded', function() {
    const checkBtn = document.getElementById('check-btn');
    const discordInput = document.getElementById('discord-username');
    const resultSection = document.getElementById('result');

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
            
            // Removed the 100-hour requirement - all users are now eligible
            if (userData) {
                showResult(`Congratulations! You are eligible for the Sentient airdrop.`, 'eligible', userData.hoursPlayed);
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

    // Simulate API call - replace with actual API integration
    function simulateApiCall(username) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate different users with different hours
                const users = {
                    'user1#1234': { hoursPlayed: 150 },
                    'sentientfan#5678': { hoursPlayed: 250 },
                    'cryptoenthusiast#9012': { hoursPlayed: 75 },
                    'web3dev#3456': { hoursPlayed: 300 },
                    'blockchainlover#7890': { hoursPlayed: 45 }
                };
                
                // For demo purposes, if user not in list, generate random hours
                const userData = users[username] || { hoursPlayed: Math.floor(Math.random() * 300) };
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

    function showResult(message, status, hours = null) {
        let resultHTML = `
            <div class="allocation-info ${status === 'eligible' ? 'status-eligible' : status === 'error' ? 'status-not-eligible' : 'status-not-eligible'}">
                ${message}
            </div>
        `;

        if (hours && status === 'eligible') {
            // Calculate allocation based on hours (example: 10 tokens per hour)
            const allocation = hours * 10;
            resultHTML += `
                <div class="allocation-amount">
                    ${allocation.toLocaleString()} SENT
                </div>
                <div class="allocation-details">
                    Based on ${hours} hours played. Your tokens will be distributed to your wallet after the airdrop event.
                </div>
            `;
        }

        resultSection.innerHTML = resultHTML;
    }
});