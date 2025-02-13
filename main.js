document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetTab = button.dataset.tab;
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(tab => tab.classList.remove("active"));
            button.classList.add("active");
            document.getElementById(targetTab).classList.add("active");
        });
    });

    const roletas = {
        places: ["Cinema", "Parque", "Shopping", "Restaurante", "Pizzaria", "Teatro", "Museu", "Praia"],
        foodin: ["Nhoque", "Fazer Pizza", "Batata Rústica", "Hot Dog", "Massa", "Brusqueta", "Tábua de Frios", "Guacamole"],
        foodout: ["Pizza", "Japonês", "Hamburguer", "Churrasco", "Italiano", "Barzinho", "Mexicano", "Podrão"],
        custom: []
    };

    let myCharts = {};

    function updateWheel(roleta, wheelElement) {
        if (roleta === "custom" && roletas.custom.length === 0) {
            roletas.custom = ["Adicione Itens"];
        }

        let sliceSize = 100 / roletas[roleta].length;
        let data = new Array(roletas[roleta].length).fill(sliceSize);
        let colors = ["#ff3131", "#9f1717"];
        let pieColors = roletas[roleta].map((_, i) => colors[i % colors.length]);

        if (myCharts[roleta]) {
            myCharts[roleta].destroy();
        }

        myCharts[roleta] = new Chart(wheelElement, {
            plugins: [ChartDataLabels],
            type: "pie",
            data: {
                labels: roletas[roleta],
                datasets: [{ backgroundColor: pieColors, data: data }],
            },
            options: {
                responsive: true,
                animation: { duration: 0 },
                plugins: {
                    tooltip: false,
                    legend: { display: false },
                    datalabels: {
                        color: "#ffffff",
                        font: { size: 11, family: "Poppins", weight: "bold" },
                        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                    },
                },
            },
        });
    }

    function startConfetti() {
        const confettiContainer = document.createElement("div");
        confettiContainer.classList.add("confetti-container");
        document.body.appendChild(confettiContainer);

        for (let i = 0; i < 200; i++) {
            let confetti = document.createElement("div");
            confetti.classList.add("confetti");
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.top = Math.random() * -100 + "px";
            confetti.style.width = Math.random() * 10 + 5 + "px";
            confetti.style.height = Math.random() * 20 + 10 + "px";
            confetti.style.opacity = Math.random() * 0.9 + 0.1;
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.animationDuration = Math.random() * 5 + 3 + "s";
            confetti.style.animationDelay = Math.random() * 2 + "s";
            confettiContainer.appendChild(confetti);
        }

        requestAnimationFrame(() => {
            document.querySelectorAll(".confetti").forEach(confetti => {
                confetti.style.top = "100vh";
            });
        });

        setTimeout(() => {
            confettiContainer.remove();
        }, 8000);
    }

    document.querySelectorAll(".spin-btn").forEach(button => {
        button.addEventListener("click", () => {
            let roleta = button.dataset.wheel;
            let wheelElement = document.getElementById(`wheel-${roleta}`);
            let resultElement = document.getElementById(`result-${roleta}`);
            let numItens = roletas[roleta].length;
            let anglePerItem = 360 / numItens;
            let currentRotation = parseFloat(wheelElement.style.transform.replace(/[^0-9]/g, "")) || 0;
            let randomOffset = Math.random() * anglePerItem;
            let baseRotations = 7;
            let extraRotations = Math.floor(Math.random() * 6) + 2;
            let finalRotation = currentRotation + (360 * (baseRotations + extraRotations)) + randomOffset;
            let stopAngle = finalRotation % 360;
            let selectedIndex = Math.floor(((360 - stopAngle) + anglePerItem / 2) / anglePerItem) % numItens;
            button.disabled = true;
            tabButtons.forEach(tab => tab.disabled = true);
            wheelElement.style.transition = "transform 4s ease-out";
            wheelElement.style.transform = `rotate(${finalRotation}deg)`;
            setTimeout(() => {
                let resultadoFinal = roletas[roleta][selectedIndex];
                resultElement.innerHTML = `🎉 Escolhido: <strong>${resultadoFinal}</strong>`;
                startConfetti();
                button.disabled = false;
                tabButtons.forEach(tab => tab.disabled = false);
            }, 4000);
        });
    });

    document.getElementById("add-btn").addEventListener("click", () => {
        let newItem = document.getElementById("new-item").value.trim();
        if (newItem) {
            if (roletas.custom.length === 1 && roletas.custom[0] === "Adicione Itens") {
                roletas.custom = [];
            }
            roletas.custom.push(newItem);
            document.getElementById("new-item").value = "";
            updateWheel("custom", document.getElementById("wheel-custom"));
        }
    });

    updateWheel("places", document.getElementById("wheel-places"));
    updateWheel("foodin", document.getElementById("wheel-foodin"));
    updateWheel("foodout", document.getElementById("wheel-foodout"));
    updateWheel("custom", document.getElementById("wheel-custom"));
});
