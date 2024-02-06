document.addEventListener("DOMContentLoaded", (e) => {
    e.stopImmediatePropagation();

    const imageList =  document.querySelector(".carrousel-list");
    const slideButtons = document.querySelectorAll(".carrousel-container button");
    
    slideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id === "prev-slider" ? -1 : 1;
            const scrollAmount = imageList.clientWidth * direction;
            imageList.scrollBy({left: scrollAmount, behavior:"smooth"});
        });
    });
});
