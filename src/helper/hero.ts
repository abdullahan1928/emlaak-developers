const showSlider = (
  type: string,
  carouselDom: HTMLElement,
  nextDom: HTMLElement,
  prevDom: HTMLElement,
  timeRunning: number,
  timeAutoNext: number,
  runTimeOut: React.MutableRefObject<NodeJS.Timeout | null>,
  runNextAuto: React.MutableRefObject<NodeJS.Timeout | null>,
  manualInteractionDelay: number = 5000 // Delay after manual click (5 seconds)
) => {
  if (!carouselDom) return;

  const SliderDom = carouselDom.querySelector(".carousel .list") as HTMLElement;
  const thumbnailBorderDom = carouselDom.querySelector(
    ".carousel .thumbnail"
  ) as HTMLElement;
  const SliderItemsDom = SliderDom.querySelectorAll(".carousel .list .item");
  const thumbnailItemsDom = carouselDom.querySelectorAll(
    ".carousel .thumbnail .item"
  );

  if (type === "next") {
    SliderDom.appendChild(SliderItemsDom[0]);
    thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
    carouselDom.classList.add("next");
  }

  if (type === "prev") {
    SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
    thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
    carouselDom.classList.add("prev");
  }

  // Clear any ongoing animations
  if (runTimeOut.current) {
    clearTimeout(runTimeOut.current);
  }

  // Clear auto-run timeout to prevent it from triggering immediately after a manual click
  if (runNextAuto.current) {
    clearTimeout(runNextAuto.current);
  }

  // Remove next/prev class after a set duration
  runTimeOut.current = setTimeout(() => {
    carouselDom.classList.remove("next");
    carouselDom.classList.remove("prev");
  }, timeRunning);

  // Restart the auto-run but with a delay after manual interaction
  runNextAuto.current = setTimeout(() => {
    nextDom.click();
  }, timeAutoNext + manualInteractionDelay); // Delay auto-run after manual interaction

  resetAutoNext(runNextAuto, nextDom, timeAutoNext + manualInteractionDelay); // Include delay
};

const resetAutoNext = (
  runNextAuto: React.MutableRefObject<NodeJS.Timeout | null>,
  nextDom: HTMLElement | null,
  timeAutoNext: number
) => {
  if (runNextAuto.current) {
    clearTimeout(runNextAuto.current);
  }
  runNextAuto.current = setTimeout(() => {
    if (nextDom) {
      nextDom.click();
    }
  }, timeAutoNext);
};

const setupEventListeners = (
  carouselDom: HTMLElement,
  nextDom: HTMLElement,
  prevDom: HTMLElement,
  timeAutoNext: number,
  runTimeOut: React.MutableRefObject<NodeJS.Timeout | null>,
  runNextAuto: React.MutableRefObject<NodeJS.Timeout | null>,
  timeOut: number = 5000
) => {
  nextDom.onclick = () =>
    showSlider(
      "next",
      carouselDom,
      nextDom,
      prevDom,
      3000,
      timeAutoNext,
      runTimeOut,
      runNextAuto,
      timeOut
    );
  prevDom.onclick = () =>
    showSlider(
      "prev",
      carouselDom,
      nextDom,
      prevDom,
      3000,
      timeAutoNext,
      runTimeOut,
      runNextAuto,
      timeOut
    );

  resetAutoNext(runNextAuto, nextDom, timeAutoNext);

  runNextAuto.current = setTimeout(() => {
    nextDom.click();
  }, timeAutoNext);

  carouselDom.addEventListener("mouseenter", () => {
    resetAutoNext(runNextAuto, nextDom, timeAutoNext);
  });

  carouselDom.addEventListener("mouseleave", () => {
    runNextAuto.current = setTimeout(() => {
      nextDom.click();
    }, timeAutoNext);
  });

  return () => {
    carouselDom.removeEventListener("mouseenter", () => {
      resetAutoNext(runNextAuto, nextDom, timeAutoNext);
    });

    carouselDom.removeEventListener("mouseleave", () => {
      runNextAuto.current = setTimeout(() => {
        nextDom.click();
      }, timeAutoNext);
    });
  };
};

export { setupEventListeners };
