// public/bookings.js

// This function runs automatically when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchBookings();
});

// This is the main function to get the data
async function fetchBookings() {
    const list = document.getElementById('bookings-list');
    
    try {
        // 1. "Fetch" the data from our new API route
        const response = await fetch('/api/bookings');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        // 2. Get the JSON data (the array of bookings)
        const bookings = await response.json();

        // 3. Clear the "Loading..." message
        list.innerHTML = '';

        // 4. Check if there are any bookings
        if (bookings.length === 0) {
            list.innerHTML = '<li>No bookings found.</li>';
            return;
        }

        // 5. Loop through each booking and create an HTML list item
        bookings.forEach(booking => {
            const item = document.createElement('li');
            
            // Format the date to be more readable
            const checkInDate = new Date(booking.checkIn).toLocaleDateString();
            
            // Use innerHTML to structure the content of the list item
            item.innerHTML = `
                <strong>${booking.name}</strong> (${booking.email})
                <br>
                Room: ${booking.roomType} | Check-in: ${checkInDate}
            `;
            
            list.appendChild(item);
        });

    } catch (error) {
        // Show an error message if the fetch fails
        console.error('Error fetching bookings:', error);
        list.innerHTML = '<li>Error: Could not load bookings.</li>';
    }
}