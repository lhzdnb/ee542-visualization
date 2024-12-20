// 加载 JSON 数据的函数
async function fetchData() {
  const predictedResponse = await fetch('predicted_data.json');
  const trainResponse = await fetch('train_data.json');
  const futurePredictionResponse = await fetch('future_predictions.json');

  const predictedData = await predictedResponse.json();
  const trainData = await trainResponse.json();
  const futurePredictionData = await futurePredictionResponse.json();

  return { predictedData, trainData, futurePredictionData };
}

function processPredictedData(predictedData) {
  const labels = [];
  const predictedValues = [];

  predictedData.forEach(item => {
    const label = `Day ${item.sequential_day}, Hour ${item.hour}`;
    labels.push(label);
    predictedValues.push(item["Predicted Values"]);
  });

  return { labels, predictedValues };
}

function processTrainData(trainData) {
  const labels = [];
  const trainValues = [];

  trainData.forEach(item => {
    const label = `Day ${item.sequential_day}, Hour ${item.hour}`;
    labels.push(label);
    trainValues.push(item.occupancy);
  });

  return { labels, trainValues };
}

function processFuturePredictionData(data) {
  const labels = [];
  const predictedOccupancy = [];

  data.forEach(item => {
    const label = `Day ${item.sequential_day}, Hour ${item.hour}`;
    labels.push(label);
    predictedOccupancy.push(item.predicted_occupancy);
  });

  return { labels, predictedOccupancy };
}

fetchData().then(({ predictedData, trainData, futurePredictionData }) => {
  const { labels: predictedLabels, predictedValues } = processPredictedData(predictedData);
  const { labels: trainLabels, trainValues } = processTrainData(trainData);

  const trainCtx = document.getElementById('trainChart').getContext('2d');
  new Chart(trainCtx, {
    type: 'line',
    data: {
      labels: trainLabels,
      datasets: [
        {
          label: 'Train Data (Occupancy)',
          data: trainValues,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: false,
        }
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        zoom: {
          pan: { enabled: true, mode: 'x' },
          zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
        },
      },
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { display: true, title: { display: true, text: 'Time (Day and Hour)' } },
        y: { display: true, title: { display: true, text: 'Occupancy' } },
      },
    },
  });

  const predictedCtx = document.getElementById('predictedChart').getContext('2d');
  new Chart(predictedCtx, {
    type: 'line',
    data: {
      labels: predictedLabels,
      datasets: [
        {
          label: 'Predicted Values',
          data: predictedValues,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
        },
        {
          label: 'Train Data (Occupancy)',
          data: trainValues, // 添加 trainData 对应的数据
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          fill: false,
        }
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        zoom: {
          pan: { enabled: true, mode: 'x' },
          zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
        },
      },
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { display: true, title: { display: true, text: 'Time (Day and Hour)' } },
        y: { display: true, title: { display: true, text: 'Values' } },
      },
    },
  });

  const { labels: futureLabels, predictedOccupancy } = processFuturePredictionData(futurePredictionData);

  const futureCtx = document.getElementById('futurePredictionChart').getContext('2d');
  new Chart(futureCtx, {
    type: 'line',
    data: {
      labels: futureLabels,
      datasets: [
        {
          label: 'Future Predicted Occupancy',
          data: predictedOccupancy,
          borderColor: 'rgba(0, 128, 0, 1)',
          borderWidth: 2,
          fill: false,
        }
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        zoom: {
          pan: { enabled: true, mode: 'x' },
          zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
        },
      },
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { display: true, title: { display: true, text: 'Time (Day and Hour)' } },
        y: { display: true, title: { display: true, text: 'Predicted Occupancy' } },
      },
    },
  });
}).catch(error => console.error('Error loading or processing data:', error));
