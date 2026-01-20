import updateInfo from "../data/update";

/**
 * Initializes the drag-to-scroll functionality for the diary cards section.
 * Handles mouse events to allow dragging the scroll container.
 */
export const initDragScroll = (): void => {
  const slider = document.getElementById('scroll-container') as HTMLElement | null;
  
  if (!slider) return;

  let isDown = false;
  let startX: number;
  let scrollLeft: number;
  let isDragging = false; // Flag to track if the user is actually dragging vs clicking

  // Prevent default drag behavior on images and links to avoid interference
  const preventDefaultDrag = (e: Event) => e.preventDefault();
  slider.querySelectorAll('a, img').forEach(el => {
    el.addEventListener('dragstart', preventDefaultDrag);
  });

  // Intercept click events during the capture phase
  // If a drag occurred, prevent the click from triggering navigation
  slider.addEventListener('click', (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  const onMouseDown = (e: MouseEvent) => {
    isDown = true;
    isDragging = false; // Reset drag status
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown = false;
    slider.classList.remove('active');
  };

  const onMouseUp = () => {
    isDown = false;
    slider.classList.remove('active');
    // Delay resetting isDragging so the click event handler can check it
    setTimeout(() => {
      isDragging = false;
    }, 0);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    slider.scrollLeft = scrollLeft - walk;
    
    // If moved more than 5px, consider it a drag operation
    if (Math.abs(x - startX) > 5) {
      isDragging = true;
    }
  };

  slider.addEventListener('mousedown', onMouseDown);
  slider.addEventListener('mouseleave', onMouseLeave);
  slider.addEventListener('mouseup', onMouseUp);
  slider.addEventListener('mousemove', onMouseMove);
};

/**
 * Updates the follower counts by fetching data from external APIs.
 * Targets elements based on class names defined in updateInfo.
 */
export const initFollowerUpdate = (): void => {
  updateInfo.forEach((item) => {
    fetch(item.updateUrl)
      .then((response) => response.json())
      .then((data: { count?: number | string }) => {
        const element = document.querySelector(`.${item.className}`);
        if (data.count == null) return;
        if (element) {
          element.textContent = data.count + " Followers";
        }
      })
      .catch((error) => console.error("Error fetching follower count:", error));
  });
};
