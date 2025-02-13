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
        // Se a roleta personalizada estiver vazia, exibe "Adicione Itens"
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
                        font: { size: 11, family: "Poppins", weight: "bold"},                
                        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                    },
                },
            },
        });
    }

    document.querySelectorAll(".spin-btn").forEach(button => {
        button.addEventListener("click", () => {
            let roleta = button.dataset.wheel;
            let wheelElement = document.getElementById(`wheel-${roleta}`);
            let resultElement = document.getElementById(`result-${roleta}`);
            let tabButtons = document.querySelectorAll(".tab-btn");
    
            let numItens = roletas[roleta].length;
            let anglePerItem = 360 / numItens; // Quantos graus cada fatia ocupa
    
            // 🔥 Pegamos a rotação atual para sempre girar no sentido horário
            let currentRotation = parseFloat(wheelElement.style.transform.replace(/[^0-9]/g, "")) || 0;
    
            // 🔥 Criamos um deslocamento aleatório para garantir que pare em qualquer lugar
            let randomOffset = Math.random() * anglePerItem; // Pequeno deslocamento aleatório dentro da fatia
    
            // 🔥 Calcula a nova rotação incluindo o deslocamento aleatório
            let baseRotations = 7; // Sempre gira pelo menos 5 voltas completas
            let extraRotations = Math.floor(Math.random() * 6) + 2; // Rotação aleatória extra (2 a 5 voltas)
            let finalRotation = currentRotation + (360 * (baseRotations + extraRotations)) + randomOffset;
    
            // 🔥 Calcula o índice correto com base na rotação final
            let stopAngle = finalRotation % 360; // Ângulo final após todas as rotações
            let selectedIndex = Math.floor(((360 - stopAngle) + anglePerItem / 2) / anglePerItem) % numItens; // Índice correto
    
            // 🔥 Desabilita o botão e as abas enquanto gira
            button.disabled = true;
            tabButtons.forEach(tab => tab.disabled = true);
    
            // 🔥 Aplica a rotação sempre no mesmo sentido (horário)
            wheelElement.style.transition = "transform 4s ease-out";
            wheelElement.style.transform = `rotate(${finalRotation}deg)`;
    
            // 🔥 Exibe o resultado após a roleta parar e reativa os botões
            setTimeout(() => {
                let resultadoFinal = roletas[roleta][selectedIndex];
                resultElement.innerHTML = `🎉 Escolhido: <strong>${resultadoFinal}</strong>`;
    
                button.disabled = false; // Reativa o botão "Rodar"
                tabButtons.forEach(tab => tab.disabled = false); // Reativa a navegação entre abas
            }, 4000);
        });
    });
    
    
    
    

    document.getElementById("add-btn").addEventListener("click", () => {
        let newItem = document.getElementById("new-item").value.trim();
        if (newItem) {
            // 🔥 Garante que "Adicione Itens" não permaneça na roleta
            if (roletas.custom.length === 1 && roletas.custom[0] === "Adicione Itens") {
                roletas.custom = [];
            }

            roletas.custom.push(newItem);
            document.getElementById("new-item").value = "";
            
            let wheelElement = document.getElementById("wheel-custom");
            updateWheel("custom", wheelElement);
        }
    });

    updateWheel("places", document.getElementById("wheel-places"));
    updateWheel("foodin", document.getElementById("wheel-foodin"));
    updateWheel("foodout", document.getElementById("wheel-foodout"));
    updateWheel("custom", document.getElementById("wheel-custom"));
});
