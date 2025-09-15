const quotes = [
            "Push yourself, because no one else is going to do it for you.",
            "Success doesn't just find you, you have to go out and get it.",
            "Great things never come from comfort zones.",
            "Dream it. Wish it. Do it.",
            "Stay focused, stay positive, stay strong.",
            "The only impossible journey is the one you never begin.",
            "Your limitation—it's only your imagination.",
            "Don't stop when you're tired. Stop when you're done.",
            "Wake up with determination. Go to bed with satisfaction.",
            "Do something today that your future self will thank you for."
        ];

        // Use in-memory storage instead of localStorage
        let tasks = [];
        let steps = [];
        let progressChart;
        let currentAim = "";

        function newQuote() {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            document.getElementById("quoteText").innerHTML = quotes[randomIndex];
        }

        // ================= AIM =================
        function setAim() {
            const aim = document.getElementById("aimInput").value.trim();
            if (!aim) return;
            
            currentAim = aim;
            document.getElementById("currentAim").innerText = "👉 " + aim;
            document.getElementById("aimInput").value = "";
        }

        // ================= TASKS =================
        function addTask() {
            const taskText = document.getElementById("taskInput").value.trim();
            if (!taskText) return;
            
            tasks.push({ 
                text: taskText, 
                completed: true,
                timestamp: new Date().toLocaleTimeString()
            });
            document.getElementById("taskInput").value = "";
            renderTasks();
            updateCharts();
        }

        function renderTasks() {
            const taskList = document.getElementById("taskList");
            taskList.innerHTML = "";
            tasks.forEach((task, index) => {
                const li = document.createElement("li");
                li.className = "completed";
                li.innerHTML = `
                    <div>${task.text}</div>
                    <small style="opacity: 0.7;">Completed at ${task.timestamp}</small>
                `;
                li.addEventListener('click', () => removeTask(index));
                li.style.cursor = 'pointer';
                li.title = 'Click to remove';
                taskList.appendChild(li);
            });
        }

        function removeTask(index) {
            if (confirm('Remove this completed task?')) {
                tasks.splice(index, 1);
                renderTasks();
                updateCharts();
            }
        }

        // ================= STEPS =================
        function renderSteps() {
            const stepsList = document.getElementById("stepsList");
            stepsList.innerHTML = "";
            steps.forEach((step, index) => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span>${step.text}</span>
                    <button onclick="completeStep(${index})" style="float: right; padding: 5px 10px; font-size: 0.8rem;">✓ Complete</button>
                `;
                stepsList.appendChild(li);
            });
        }

        function completeStep(index) {
            const step = steps[index];
            tasks.push({
                text: step.text,
                completed: true,
                timestamp: new Date().toLocaleTimeString()
            });
            steps.splice(index, 1);
            renderSteps();
            renderTasks();
            updateCharts();
        }

        document.getElementById("stepsForm").addEventListener("submit", e => {
            e.preventDefault();
            const stepInput = document.getElementById("stepInput");
            const stepText = stepInput.value.trim();
            if (!stepText) return;
            
            steps.push({
                text: stepText,
                created: new Date().toLocaleTimeString()
            });
            renderSteps();
            stepInput.value = "";
            updateCharts();
        });

        // ================= CHART & STATS =================
        function updateCharts() {
            const completedCount = tasks.length;
            const remainingCount = steps.length;
            const totalSteps = completedCount + remainingCount;
            const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

            // Update stats
            document.getElementById("totalSteps").textContent = totalSteps;
            document.getElementById("completedTasks").textContent = completedCount;
            document.getElementById("remainingSteps").textContent = remainingCount;
            document.getElementById("progressPercent").textContent = progressPercent + "%";

            // Update chart
            if (progressChart) progressChart.destroy();

            const ctx = document.getElementById("progressChart").getContext('2d');
            
            Chart.register(ChartDataLabels);
            
            progressChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Remaining Steps', 'Completed Tasks'],
                    datasets: [{
                        data: [remainingCount, completedCount],
                        backgroundColor: ['#06d6a0', '#ffd166'],
                        borderColor: '#fff',
                        borderWidth: 3,
                        hoverOffset: 10,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { 
                                usePointStyle: true, 
                                pointStyle: 'circle', 
                                padding: 20,
                                font: { size: 14 }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const value = context.parsed;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                    return `${context.label}: ${value} (${percent}%)`;
                                }
                            }
                        },
                        datalabels: {
                            color: '#fff',
                            formatter: (value, context) => {
                                if (value === 0) return '';
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${percent}%`;
                            },
                            font: { weight: 'bold', size: 16 }
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                        duration: 1000
                    }
                }
            });
        }

        // ================= INITIALIZE =================
        window.onload = () => {
            // Set initial quote
            newQuote();
            
            // Initialize displays
            renderSteps();
            renderTasks();
            updateCharts();
            
            // Set initial aim display
            document.getElementById("currentAim").innerText = currentAim || "Set your aim for today!";
        };

        // Auto-save functionality simulation (since we can't use localStorage)
        setInterval(() => {
            console.log('Auto-saving data...', {
                aim: currentAim,
                steps: steps.length,
                tasks: tasks.length
            });
        }, 30000); // Every 30 seconds