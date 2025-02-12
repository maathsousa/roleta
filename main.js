const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const newValueInput = document.getElementById("new-value");
const addBtn = document.getElementById("add-btn");

let items = [];
let data = [];
let pieColors = [];
let myChart = null;

// Tons mais suaves
const originalColors = ["#ff9999", "#ff6666", "#ff4d4d", "#ff3333", "#ff1a1a", "#cc0000"];

function updateWheel() {
    if (items.length === 0) return;

    let sliceSize = 100 / items.length;
    data = new Array(items.length).fill(sliceSize);
    pieColors = items.map((_, i) => originalColors[i % originalColors.length]);

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(wheel, {
        plugins: [ChartDataLabels],
        type: "pie",
        data: {
            labels: items.map((item) => item.value),
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
                    font: { size: 20 },
                    formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                },
            },
        },
    });
}

addBtn.addEventListener("click", () => {
    let newValue = newValueInput.value.trim();
    if (newValue) {
        let index = items.length;
        items.push({ index, value: newValue });
        newValueInput.value = "";
        updateWheel();
    }
});

let count = 0;
let resultValue = 101;

spinBtn.addEventListener("click", () => {
    if (items.length === 0) {
        finalValue.innerHTML = `<p>Adicione valores antes de rodar!</p>`;
        return;
    }

    spinBtn.disabled = true;
    finalValue.innerHTML = "";

    let randomIndex = Math.floor(Math.random() * items.length);
    let randomDegree = (360 / items.length) * randomIndex;

    let rotationInterval = setInterval(() => {
        myChart.options.rotation += resultValue;
        myChart.update();

        if (myChart.options.rotation >= 360) {
            count += 1;
            resultValue -= 5;
            myChart.options.rotation = 0;
        } else if (count > 15 && Math.abs(myChart.options.rotation - randomDegree) < 5) {
            clearInterval(rotationInterval);
            count = 0;
            resultValue = 101;
            spinBtn.disabled = false;

            startConfetti();
            setTimeout(stopConfetti, 3000);
        }
    }, 10);
});

/* === Confetes Atualizados === */
function startConfetti() {
    const confettiContainer = document.createElement("div");
    confettiContainer.classList.add("confetti-container");
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 200; i++) {
        let confetti = document.createElement("div");
        confetti.classList.add("confetti");

        // Posicionamento e tamanhos aleatórios
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.width = Math.random() * 10 + 5 + "px";
        confetti.style.height = Math.random() * 20 + 10 + "px";
        confetti.style.opacity = Math.random() * 0.9 + 0.1;

        // Cor aleatória
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        // Animações com tempos aleatórios
        confetti.style.animationDuration = Math.random() * 5 + 3 + "s"; // Entre 3s e 8s
        confetti.style.animationDelay = Math.random() * 2 + "s"; // Pequeno atraso

        confettiContainer.appendChild(confetti);
    }
}

function stopConfetti() {
    setTimeout(() => {
        const confettiContainer = document.querySelector(".confetti-container");
        if (confettiContainer) {
            confettiContainer.remove();
        }
    }, 8000);
}

