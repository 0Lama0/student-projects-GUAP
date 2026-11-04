/* 
 * Скрипты для ИП Филюта — профессиональная уборка помещений
 * Перенесено из index_GPT.html (строки 1976-2307)
 */
        "use strict";

        // Автоматическое обновление года в подвале.
        document.getElementById("current-year").textContent =
            new Date().getFullYear();

        // Мобильная навигация.
        const menuToggle = document.getElementById("menu-toggle");
        const mainNav = document.getElementById("main-nav");

        function closeMenu() {
            mainNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Открыть меню");
            menuToggle.querySelector("span").textContent = "☰";
            document.body.classList.remove("menu-open");
        }

        menuToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Закрыть меню" : "Открыть меню"
            );
            menuToggle.querySelector("span").textContent = isOpen ? "✕" : "☰";
            document.body.classList.toggle("menu-open", isOpen);
        });

        mainNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 800) {
                closeMenu();
            }
        });

        // Плавная прокрутка к разделам.
        // CSS scroll-behavior обеспечивает плавность, а этот обработчик
        // дополнительно закрывает мобильное меню перед переходом.
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener("click", function (event) {
                const targetId = link.getAttribute("href");

                if (!targetId || targetId === "#") {
                    return;
                }

                const target = document.querySelector(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();
                closeMenu();

                target.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "start"
                });

                if (history.replaceState) {
                    history.replaceState(null, "", targetId);
                }
            });
        });

        // Анимация появления блоков при прокрутке.
        const revealElements = document.querySelectorAll(".reveal");
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if ("IntersectionObserver" in window && !reducedMotion) {
            const revealObserver = new IntersectionObserver(
                function (entries, observer) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("visible");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.12
                }
            );

            revealElements.forEach(function (element) {
                revealObserver.observe(element);
            });
        } else {
            revealElements.forEach(function (element) {
                element.classList.add("visible");
            });
        }

        // Карусель изображений.
        const carousel = document.getElementById("portfolio-carousel");
        const carouselTrack = document.getElementById("carousel-track");
        const carouselSlides = Array.from(
            carouselTrack.querySelectorAll(".carousel-slide")
        );
        const carouselDots = Array.from(
            document.querySelectorAll(".carousel-dot")
        );
        const carouselPrev = document.getElementById("carousel-prev");
        const carouselNext = document.getElementById("carousel-next");

        let currentSlide = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        function showSlide(index) {
            currentSlide =
                (index + carouselSlides.length) % carouselSlides.length;

            carouselTrack.style.transform =
                "translateX(-" + currentSlide * 100 + "%)";

            carouselSlides.forEach(function (slide, slideIndex) {
                slide.setAttribute("aria-label",
                    (slideIndex + 1) + " из " + carouselSlides.length
                );
                slide.setAttribute(
                    "aria-hidden",
                    String(slideIndex !== currentSlide)
                );
            });

            carouselDots.forEach(function (dot, dotIndex) {
                const isActive = dotIndex === currentSlide;

                dot.classList.toggle("active", isActive);

                if (isActive) {
                    dot.setAttribute("aria-current", "true");
                } else {
                    dot.removeAttribute("aria-current");
                }
            });
        }

        carouselPrev.addEventListener("click", function () {
            showSlide(currentSlide - 1);
        });

        carouselNext.addEventListener("click", function () {
            showSlide(currentSlide + 1);
        });

        carouselDots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });

        carousel.addEventListener("keydown", function (event) {
            if (event.key === "ArrowLeft") {
                showSlide(currentSlide - 1);
            }

            if (event.key === "ArrowRight") {
                showSlide(currentSlide + 1);
            }
        });

        carousel.addEventListener("touchstart", function (event) {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener("touchend", function (event) {
            touchEndX = event.changedTouches[0].screenX;

            const difference = touchEndX - touchStartX;

            if (Math.abs(difference) < 45) {
                return;
            }

            showSlide(
                difference < 0 ? currentSlide + 1 : currentSlide - 1
            );
        }, { passive: true });

        showSlide(0);

        // При выборе услуги автоматически заполняем поле в форме.
        document.querySelectorAll("[data-service]").forEach(function (link) {
            link.addEventListener("click", function () {
                const serviceSelect = document.getElementById("client-service");
                const selectedService = link.dataset.service;

                const matchingOption = Array.from(serviceSelect.options).find(
                    function (option) {
                        return option.value === selectedService;
                    }
                );

                if (matchingOption) {
                    serviceSelect.value = selectedService;
                }
            });
        });

        // Проверка формы.
        // Демонстрационный режим: данные никуда не отправляются.
        const contactForm = document.getElementById("contact-form");
        const formStatus = document.getElementById("form-status");

        function showFormStatus(message, type) {
            formStatus.textContent = message;
            formStatus.className = "form-status " + type;
            formStatus.hidden = false;
        }

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            formStatus.hidden = true;

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();

                showFormStatus(
                    "Проверьте обязательные поля и исправьте ошибки.",
                    "error"
                );

                return;
            }

            const name = document.getElementById("client-name").value.trim();
            const contact = document.getElementById("client-phone").value.trim();

            if (name.length < 2 || contact.length < 3) {
                showFormStatus(
                    "Укажите корректное имя и контакт для связи.",
                    "error"
                );
                return;
            }

            const service = document.getElementById("client-service").value;
            const message = document.getElementById("client-message").value.trim();

            const requestText = [
                "Заявка на клининговые услуги — ИП Филюта",
                "",
                "Имя: " + name,
                "Контакт: " + contact,
                "Услуга: " + (service || "Не указана"),
                "Комментарий: " + (message || "Нет")
            ].join("\n");

            showFormStatus(
                "Форма заполнена. В демонстрационной версии заявка не отправлена. " +
                "Ниже можно скопировать её текст и передать компании вручную.",
                "success"
            );

            const copyButton = document.createElement("button");
            copyButton.type = "button";
            copyButton.className = "btn btn-outline";
            copyButton.style.marginTop = "12px";
            copyButton.textContent = "Скопировать заявку";

            copyButton.addEventListener("click", async function () {
                try {
                    if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(requestText);
                    } else {
                        const textArea = document.createElement("textarea");
                        textArea.value = requestText;
                        textArea.setAttribute("readonly", "");
                        textArea.style.position = "fixed";
                        textArea.style.opacity = "0";

                        document.body.appendChild(textArea);
                        textArea.select();

                        const copied = document.execCommand("copy");
                        textArea.remove();

                        if (!copied) {
                            throw new Error("Копирование недоступно");
                        }
                    }

                    copyButton.textContent = "Заявка скопирована";
                } catch (error) {
                    showFormStatus(
                        "Не удалось автоматически скопировать заявку. " +
                        "Попробуйте выделить и скопировать текст вручную.",
                        "error"
                    );

                    const requestPreview = document.createElement("textarea");
                    requestPreview.value = requestText;
                    requestPreview.readOnly = true;
                    requestPreview.rows = 7;
                    requestPreview.style.width = "100%";
                    requestPreview.style.marginTop = "12px";
                    requestPreview.setAttribute(
                        "aria-label",
                        "Текст подготовленной заявки"
                    );

                    copyButton.replaceWith(requestPreview);
                    requestPreview.focus();
                    requestPreview.select();
                }
            });

            formStatus.appendChild(document.createElement("br"));
            formStatus.appendChild(copyButton);
        });