const showSlider = (
  type: string,
  carouselDom: HTMLElement,
  nextDom: HTMLElement,
  prevDom: HTMLElement,
  timeRunning: number,
  timeAutoNext: number,
  runTimeOut: React.MutableRefObject<NodeJS.Timeout | null>,
  runNextAuto: React.MutableRefObject<NodeJS.Timeout | null>
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

  if (runTimeOut.current) {
    clearTimeout(runTimeOut.current);
  }

  runTimeOut.current = setTimeout(() => {
    carouselDom.classList.remove("next");
    carouselDom.classList.remove("prev");
  }, timeRunning);

  if (runNextAuto.current) {
    clearTimeout(runNextAuto.current);
  }
  runNextAuto.current = setTimeout(() => {
    nextDom.click();
  }, timeAutoNext);

  resetAutoNext(runNextAuto, nextDom, timeAutoNext);
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
  runNextAuto: React.MutableRefObject<NodeJS.Timeout | null>
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
      runNextAuto
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
      runNextAuto
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
