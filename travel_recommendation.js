// travel_recommendation.js

document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            console.log('Form submitted:', formData);
            alert('Thank you for your message! We will get back to you soon.');
            event.target.reset();
        });
    }

    // Travel Recommendations System
    const searchBtn = document.querySelector('.search-btn');
    const clearBtn = document.querySelector('.clear-btn');
    const searchInput = document.querySelector('.search-container input');
    const recommendationContainer = document.querySelector('.recommendation-overlay');
    
    // Cria um container principal para o layout
    const mainContent = document.querySelector('.hero').parentElement;
    mainContent.classList.add('main-container');
    let resultsContainer = document.querySelector('.recommendation-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('aside'); // Mudamos para <aside>
        resultsContainer.className = 'recommendation-results';
        document.querySelector('.hero').insertAdjacentElement('afterend', resultsContainer);
    }
    
document.querySelector('.hero').insertAdjacentElement('afterend', resultsContainer);
    // Fetch recommendations from JSON
    async function fetchRecommendations() {
        try {
            const response = await fetch('travel_recommendation_api.json');
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return null;
        }
    }

    // Display recommendations
    function displayRecommendations(recommendations) {
        recommendationContainer.innerHTML = '';
        
        if (!recommendations || recommendations.length === 0) {
            recommendationContainer.innerHTML = `
                <div class="no-results">
                    <p>No recommendations found. Try a different search term.</p>
                </div>
            `;
            return;
        }

        recommendations.forEach(item => {
            const card = document.createElement('div');
            card.className = 'recommendation-card';
            card.innerHTML = `
                <div class="recommendation-image">
                    <img src="${item.imageUrl}" alt="${item.name}">
                </div>
                <div class="recommendation-info">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <button class="visit-btn">Visit</button>
                </div>
            `;
            recommendationContainer.appendChild(card);
        });
    }

    

    // Handle search functionality
    async function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (!searchTerm) {
            alert('Please enter a search term');
            return;
        }

        const data = await fetchRecommendations();
        if (!data) return;

        let results = [];

        // Check for beach-related keywords
        if (/beach|beaches|coast|shore/i.test(searchTerm)) {
            results = data.beaches;
        } 
        // Check for temple-related keywords
        else if (/temple|temples|religious|worship/i.test(searchTerm)) {
            results = data.temples;
        } 
        // Check for country-related keywords
        else if (/country|countries|nation/i.test(searchTerm)) {
            data.countries.forEach(country => {
                results = results.concat(country.cities);
            });
        } 
        // Check for specific countries
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
        // Search across all categories
        else {
            data.countries.forEach(country => {
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(searchTerm) || 
                        city.description.toLowerCase().includes(searchTerm)) {
                        results.push(city);
                    }
                });
            });

            data.temples.forEach(temple => {
                if (temple.name.toLowerCase().includes(searchTerm) || 
                    temple.description.toLowerCase().includes(searchTerm)) {
                    results.push(temple);
                }
            });

            data.beaches.forEach(beach => {
                if (beach.name.toLowerCase().includes(searchTerm) || 
                    beach.description.toLowerCase().includes(searchTerm)) {
                    results.push(beach);
                }
            });
        }

        displayRecommendations(results);
    }

    // Clear search results
    function clearSearchResults() {
        searchInput.value = '';
        resultsContainer.innerHTML = '';
        searchInput.focus();
    }

    // Event listeners
    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (clearBtn) clearBtn.addEventListener('click', clearSearchResults);
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});
