document.addEventListener("DOMContentLoaded", () => {

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  /* ========================================
     HERO TYPE
  ======================================== */

  const terminalLines =
    document.querySelectorAll(
      ".hero-code span[data-text]"
    );


  const heroContent =
    document.querySelector(
      ".hero-content"
    );


  function typeText(
    element,
    text,
    speed = 24
  ) {

    return new Promise((resolve) => {

      let index = 0;


      const typing =
        setInterval(() => {

          element.textContent +=
            text[index];

          index += 1;


          if (index >= text.length) {

            clearInterval(typing);

            setTimeout(
              resolve,
              150
            );

          }

        }, speed);

    });

  }


  async function startHero() {

    for (
      const line
      of terminalLines
    ) {

      await typeText(
        line,
        line.dataset.text || ""
      );

    }


    setTimeout(() => {

      heroContent?.classList.add(
        "visible"
      );

    }, 150);

  }


  if (reducedMotion) {

    terminalLines.forEach(
      (line) => {

        line.textContent =
          line.dataset.text || "";

      }
    );


    heroContent?.classList.add(
      "visible"
    );

  } else {

    startHero();

  }



  /* ========================================
     NETWORK
  ======================================== */

  const canvas =
    document.getElementById(
      "networkCanvas"
    );


  if (canvas) {

    const ctx =
      canvas.getContext("2d");


    let width = 0;
    let height = 0;

    let nodes = [];


    function createNodes() {

      const isMobile =
        window.innerWidth <= 760;


      const count =
        isMobile
          ? 16
          : 32;


      nodes =
        Array.from(
          {
            length: count
          },

          () => ({

            x:
              Math.random() *
              width,

            y:
              Math.random() *
              height,

            vx:
              (
                Math.random() -
                0.5
              ) *
              0.12,

            vy:
              (
                Math.random() -
                0.5
              ) *
              0.12,

            radius:
              Math.random() *
              1.4 +
              1.1

          })
        );

    }


    function resizeCanvas() {

      const rect =
        canvas.getBoundingClientRect();


      const dpr =
        Math.min(
          window.devicePixelRatio || 1,
          2
        );


      width =
        rect.width;

      height =
        rect.height;


      canvas.width =
        width *
        dpr;

      canvas.height =
        height *
        dpr;


      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );


      createNodes();

    }


    function drawNetwork() {

      ctx.clearRect(
        0,
        0,
        width,
        height
      );


      const maxDistance =
        window.innerWidth <= 760
          ? 120
          : 175;


      for (
        let i = 0;
        i < nodes.length;
        i += 1
      ) {

        for (
          let j = i + 1;
          j < nodes.length;
          j += 1
        ) {

          const dx =
            nodes[i].x -
            nodes[j].x;


          const dy =
            nodes[i].y -
            nodes[j].y;


          const distance =
            Math.sqrt(
              dx * dx +
              dy * dy
            );


          if (
            distance <
            maxDistance
          ) {

            const opacity =
              (
                1 -
                distance /
                maxDistance
              ) *
              0.24;


            ctx.beginPath();


            ctx.moveTo(
              nodes[i].x,
              nodes[i].y
            );


            ctx.lineTo(
              nodes[j].x,
              nodes[j].y
            );


            ctx.strokeStyle =
              `rgba(84,112,255,${opacity})`;


            ctx.lineWidth =
              1;


            ctx.stroke();

          }

        }

      }


      nodes.forEach(
        (node) => {

          ctx.beginPath();


          ctx.arc(
            node.x,
            node.y,
            node.radius,
            0,
            Math.PI * 2
          );


          ctx.fillStyle =
            "rgba(84,112,255,0.58)";


          ctx.fill();


          if (!reducedMotion) {

            node.x +=
              node.vx;

            node.y +=
              node.vy;


            if (
              node.x < 0 ||
              node.x > width
            ) {

              node.vx *= -1;

            }


            if (
              node.y < 0 ||
              node.y > height
            ) {

              node.vy *= -1;

            }

          }

        }
      );


      if (!reducedMotion) {

        requestAnimationFrame(
          drawNetwork
        );

      }

    }


    window.addEventListener(
      "resize",
      resizeCanvas
    );


    resizeCanvas();

    drawNetwork();

  }



  /* ========================================
     MOBILE BOTTOM NAV
  ======================================== */

  const bottomNav =
    document.querySelector(
      ".bottom-nav"
    );


  const bottomNavTrack =
    document.querySelector(
      ".bottom-nav-track"
    );


  const bottomNavLinks = [
    ...document.querySelectorAll(
      ".bottom-nav a[data-section]"
    )
  ];


  const trackedSections =
    bottomNavLinks
      .map(
        (link) =>
          document.getElementById(
            link.dataset.section
          )
      )
      .filter(Boolean);


  const hero =
    document.querySelector(
      ".hero"
    );


  function centerActiveNavItem(
    link
  ) {

    if (
      !bottomNavTrack ||
      !link
    ) {

      return;

    }


    const targetLeft =
      link.offsetLeft -
      (
        bottomNavTrack.clientWidth -
        link.offsetWidth
      ) /
      2;


    bottomNavTrack.scrollTo({

      left:
        Math.max(
          0,
          targetLeft
        ),

      behavior:
        reducedMotion
          ? "auto"
          : "smooth"

    });

  }


  function setActiveSection(
    sectionId
  ) {

    bottomNavLinks.forEach(
      (link) => {

        const active =
          link.dataset.section ===
          sectionId;


        link.classList.toggle(
          "is-active",
          active
        );


        if (active) {

          link.setAttribute(
            "aria-current",
            "true"
          );

        } else {

          link.removeAttribute(
            "aria-current"
          );

        }

      }
    );


    const activeLink =
      bottomNavLinks.find(
        (link) =>
          link.dataset.section ===
          sectionId
      );


    centerActiveNavItem(
      activeLink
    );

  }


  function updateBottomNav() {

    


    const heroHeight =
      hero?.offsetHeight ||
      window.innerHeight;


    


    const marker =
      window.innerHeight *
      0.34;


    let currentSection =
      trackedSections[0] ||
      null;


    trackedSections.forEach(
      (section) => {

        const rect =
          section.getBoundingClientRect();


        if (
          rect.top <= marker &&
          rect.bottom > marker
        ) {

          currentSection =
            section;

        }

      }
    );


    if (currentSection) {

      setActiveSection(
        currentSection.id
      );

    }

  }


  bottomNavLinks.forEach(
    (link) => {

      link.addEventListener(
        "click",
        (event) => {

          const target =
            document.getElementById(
              link.dataset.section
            );


          if (!target) {

            return;

          }


          event.preventDefault();


          target.scrollIntoView({

            behavior:
              reducedMotion
                ? "auto"
                : "smooth",

            block:
              "start"

          });


          setActiveSection(
            link.dataset.section
          );

        }
      );

    }
  );


  let navTicking =
    false;


  function requestNavUpdate() {

    if (navTicking) {

      return;

    }


    navTicking =
      true;


    requestAnimationFrame(
      () => {

        updateBottomNav();

        navTicking =
          false;

      }
    );

  }


  window.addEventListener(
    "scroll",
    requestNavUpdate,
    {
      passive: true
    }
  );


  window.addEventListener(
    "resize",
    requestNavUpdate
  );


  updateBottomNav();



  /* ========================================
     SIMPLE SCROLL REVEAL
  ======================================== */

  const revealTargets =
    document.querySelectorAll(
      `
      .text-wrap,
      .vision-inner,
      .ministry-item,
      .prayer-list article
      `
    );


  revealTargets.forEach(
    (item) => {

      item.classList.add(
        "reveal"
      );

    }
  );


  if (reducedMotion) {

    revealTargets.forEach(
      (item) => {

        item.classList.add(
          "visible"
        );

      }
    );

  } else {

    const observer =
      new IntersectionObserver(

        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                !entry.isIntersecting
              ) {

                return;

              }


              entry.target.classList.add(
                "visible"
              );


              observer.unobserve(
                entry.target
              );

            }
          );

        },

        {

          threshold:
            0.08,

          rootMargin:
            "0px 0px -5% 0px"

        }

      );


    revealTargets.forEach(
      (item) => {

        observer.observe(
          item
        );

      }
    );

  }

});