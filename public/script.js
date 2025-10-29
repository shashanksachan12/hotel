// public/script.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  const responseMessage = document.getElementById("response-message");
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get form data
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const roomType = document.getElementById("room-type").value;
    const checkIn = document.getElementById("check-in").value;

    // Simple validation before sending
    if (!name || !email || !checkIn) {
      showMessage("Please fill in all required fields.", "error");
      return;
    }

    // Disable the button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = "Booking...";
    responseMessage.className = "";
    responseMessage.style.display = "none";

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, roomType, checkIn }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(data.message || "Booking successful!", "success");
        form.reset();
      } else {
        showMessage(`Error: ${data.message || "Something went wrong."}`, "error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showMessage("Network error. Please check your connection.", "error");
    } finally {
      // Restore button state
      submitBtn.disabled = false;
      submitBtn.textContent = "Book Now";
    }
  });

  // Helper: display messages with animation
  function showMessage(message, type) {
    responseMessage.textContent = message;
    responseMessage.className = type;
    responseMessage.style.display = "block";
    responseMessage.style.opacity = "0";

    // Fade-in animation
    setTimeout(() => (responseMessage.style.opacity = "1"), 100);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      responseMessage.style.opacity = "0";
      setTimeout(() => {
        responseMessage.style.display = "none";
      }, 500);
    }, 5000);
  }
});
