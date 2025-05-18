// travel_recommendation.js

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const searchBtn = document.querySelector('.search-btn');
    const clearBtn = document.querySelector('.clear-btn');
    const searchInput = document.querySelector('.search-container input');
    
    // Create results container if it doesn't exist in HTML
    let resultsContainer = document.querySelector('.recommendation-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'recommendation-results';
        document.querySelector('main').appendChild(resultsContainer);
    }

    // Fetch travel recommendations
    async function fetchRecommendations() {
        try {
            const response = await fetch('travel_recommendation_api.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            alert('Failed to load travel recommendations. Please try again later.');
            return null;
        }
    }

    // Display recommendations
    function displayRecommendations(recommendations) {
        resultsContainer.innerHTML = '';
        
        if (!recommendations || recommendations.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No recommendations found. Try a different search term.</p>';
            return;
        }

        const recommendationsHTML = recommendations.map(item => `
            <div class="recommendation-card">
                <div class="recommendation-image">
                    <img src="${item.imageUrl}" alt="${item.name}">
                </div>
                <div class="recommendation-info">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <button class="visit-btn">Visit</button>
                </div>
            </div>
        `).join('');

        resultsContainer.innerHTML = recommendationsHTML;
    }

    // Handle search
    async function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (!searchTerm) {
            alert('Please enter a search term');
            return;
        }

        const data = await fetchRecommendations();
        if (!data) return;

        let results = [];

        // Search logic
        if (searchTerm.includes('beach') || searchTerm.includes('beaches') || 
            searchTerm.includes('coast') || searchTerm.includes('shore')) {
            results = data.beaches;
        } 
        else if (searchTerm.includes('temple') || searchTerm.includes('temples') || 
                 searchTerm.includes('religious') || searchTerm.includes('worship')) {
            results = data.temples;
        } 
        else if (searchTerm.includes('country') || searchTerm.includes('countries') || 
                 searchTerm.includes('nation')) {
            data.countries.forEach(country => {
                results = results.concat(country.cities);
            });
        }
        else if (searchTerm.includes('australia')) {
            const australia = data.countries.find(c => c.name.toLowerCase() === 'australia');
            if (australia) results = australia.cities;
        }
        else if (searchTerm.includes('japan')) {
            const japan = data.countries.find(c => c.name.toLowerCase() === 'japan');
            if (japan) results = japan.cities;
        }
        else if (searchTerm.includes('brazil')) {
            const brazil = data.countries.find(c => c.name.toLowerCase() === 'brazil');
            if (brazil) results = brazil.cities;
        }
        else {
            // Search across all categories
            data.countries.forEach(country => {
                results = results.concat(country.cities.filter(city => 
                    city.name.toLowerCase().includes(searchTerm) || 
                    city.description.toLowerCase().includes(searchTerm)
                );
            });

            results = results.concat(
                data.temples.filter(temple => 
                    temple.name.toLowerCase().includes(searchTerm) || 
                    temple.description.toLowerCase().includes(searchTerm)
                ),
                data.beaches.filter(beach => 
                    beach.name.toLowerCase().includes(searchTerm) || 
                    beach.description.toLowerCase().includes(searchTerm)
                )
            );
        }

        displayRecommendations(results);
    }

    // Clear results
    function clearResults() {
        searchInput.value = '';
        resultsContainer.innerHTML = '';
    }

    // Event listeners
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    } else {
        console.error('Search button not found');
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearResults);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});
