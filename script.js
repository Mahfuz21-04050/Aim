// --- Quotes Section ---
const quotes = [
  "Push yourself, because no one else is going to do it for you.",
  "Success doesn’t just find you, you have to go out and get it.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Stay focused, stay positive, stay strong."
];

function newQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quoteText").innerText = quotes[randomIndex];
}
newQuote(); // show first quote

// --- Aim Section ---
function setAim() {
  const aim = document.getElementById("aimInput").value.trim();
  if (aim) {
    localStorage.setItem("todayAim", aim);
    document.getElementById("currentAim").innerText = "👉 " + aim;
    document.getElementById("aimInput").value = "";
  }
}
document.getElementById("currentAim").innerText =
  localStorage.getItem("todayAim") ? "👉 " + localStorage.getItem("todayAim") : "";

// --- Task Section ---
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
  const taskText = document.getElementById("taskInput").value.trim();
  const taskType = document.getElementById("taskType").value;
  if (taskText) {
    const task = {
      text: taskText,
      type: taskType,
      date: new Date().toLocaleDateString()
    };
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.getElementById("taskInput").value = "";
    renderTasks();
    updateCharts();
  }
}

// --- Render Task History ---
function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  tasks.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `[${t.date}] ${t.text} - ${t.type.toUpperCase()}`;
    taskList.appendChild(li);
  });
}
renderTasks();

// --- Charts ---
let progressChart, pieChart, weeklyChart;

function updateCharts() {
  // Count tasks
  const goodCount = tasks.filter(t => t.type === "good").length;
  const badCount = tasks.filter(t => t.type === "bad").length;
  const missCount = tasks.filter(t => t.type === "miss").length;

  // Progress Line Chart (Good vs Bad vs Missed)
  const dates = [...new Set(tasks.map(t => t.date))];
  const goodData = dates.map(d => tasks.filter(t => t.date === d && t.type === "good").length);
  const badData = dates.map(d => tasks.filter(t => t.date === d && t.type === "bad").length);
  const missData = dates.map(d => tasks.filter(t => t.date === d && t.type === "miss").length);

  if (progressChart) progressChart.destroy();
  progressChart = new Chart(document.getElementById("progressChart"), {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        { label: "Good", data: goodData, borderColor: "#06d6a0", fill: false },
        { label: "Bad", data: badData, borderColor: "#ef476f", fill: false },
        { label: "Missed", data: missData, borderColor: "#ffd166", fill: false }
      ]
    },
    options: { responsive: true, plugins: { legend: { position: "top" } } }
  });

  // Good vs Bad Pie Chart
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: ["Good", "Bad", "Missed"],
      datasets: [
        {
          data: [goodCount, badCount, missCount],
          backgroundColor: ["#06d6a0", "#ef476f", "#ffd166"]
        }
      ]
    },
    options: { responsive: true }
  });

  // Weekly Summary Bar Chart
  const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const weekData = new Array(7).fill(0);
  tasks.forEach(t => {
    const dayIndex = new Date(t.date).getDay();
    if (t.type === "good") weekData[dayIndex] += 1;
  });

  if (weeklyChart) weeklyChart.destroy();
  weeklyChart = new Chart(document.getElementById("weeklyChart"), {
    type: "bar",
    data: {
      labels: weekDays,
      datasets: [
        {
          label: "Good Tasks",
          data: weekData,
          backgroundColor: "#118ab2"
        }
      ]
    },
    options: { responsive: true }
  });
}
updateCharts();
