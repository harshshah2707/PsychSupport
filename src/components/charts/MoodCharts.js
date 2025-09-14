import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useMoodData } from '../../hooks/useLocalStorage';
import './MoodCharts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MoodCharts = () => {
  const { moodEntries } = useMoodData();
  const [timeRange, setTimeRange] = useState('week'); // week, month, all
  const [chartType, setChartType] = useState('line'); // line, bar, doughnut

  // Filter data based on time range
  const getFilteredData = () => {
    const now = new Date();
    let cutoffDate;

    switch (timeRange) {
      case 'week':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = new Date(0); // All time
    }

    return moodEntries.filter(entry => new Date(entry.date) >= cutoffDate);
  };

  const filteredData = getFilteredData();

  // Prepare data for line/bar charts
  const prepareTimeSeriesData = () => {
    const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      labels: sortedData.map(entry => 
        new Date(entry.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      ),
      datasets: [
        {
          label: 'Daily Mood',
          data: sortedData.map(entry => entry.mood),
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderWidth: 3,
          fill: chartType === 'line',
          tension: 0.4,
          pointBackgroundColor: 'rgb(79, 70, 229)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
        }
      ]
    };
  };

  // Prepare data for mood distribution (doughnut)
  const prepareMoodDistribution = () => {
    const moodCounts = {};
    const moodLabels = {
      '1-2': 'Very Low',
      '3-4': 'Low', 
      '5-6': 'Moderate',
      '7-8': 'Good',
      '9-10': 'Excellent'
    };

    // Initialize counts
    Object.keys(moodLabels).forEach(key => moodCounts[key] = 0);

    // Count moods
    filteredData.forEach(entry => {
      const mood = entry.mood;
      if (mood <= 2) moodCounts['1-2']++;
      else if (mood <= 4) moodCounts['3-4']++;
      else if (mood <= 6) moodCounts['5-6']++;
      else if (mood <= 8) moodCounts['7-8']++;
      else moodCounts['9-10']++;
    });

    return {
      labels: Object.values(moodLabels),
      datasets: [
        {
          data: Object.values(moodCounts),
          backgroundColor: [
            '#ef4444', // Very Low - Red
            '#f97316', // Low - Orange  
            '#eab308', // Moderate - Yellow
            '#22c55e', // Good - Green
            '#06d6a0', // Excellent - Teal
          ],
          borderWidth: 2,
          borderColor: '#fff',
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Mood Trends - ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (chartType === 'doughnut') {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed * 100) / total).toFixed(1);
              return `${context.label}: ${context.parsed} days (${percentage}%)`;
            }
            return `Mood: ${context.parsed}/10`;
          }
        }
      }
    },
    scales: chartType !== 'doughnut' ? {
      y: {
        beginAtZero: true,
        max: 10,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 1,
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    } : {}
  };

  const getInsights = () => {
    if (filteredData.length === 0) return null;

    const moods = filteredData.map(entry => entry.mood);
    const average = (moods.reduce((sum, mood) => sum + mood, 0) / moods.length).toFixed(1);
    const highest = Math.max(...moods);
    const lowest = Math.min(...moods);
    const trend = getTrend();

    return { average, highest, lowest, trend, totalEntries: filteredData.length };
  };

  const getTrend = () => {
    if (filteredData.length < 2) return 'stable';
    
    const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstHalf = sortedData.slice(0, Math.floor(sortedData.length / 2));
    const secondHalf = sortedData.slice(Math.floor(sortedData.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length;
    
    const diff = secondAvg - firstAvg;
    
    if (diff > 0.5) return 'improving';
    if (diff < -0.5) return 'declining';
    return 'stable';
  };

  const insights = getInsights();

  if (moodEntries.length === 0) {
    return (
      <div className="mood-charts">
        <div className="empty-charts">
          <h3>📊 Mood Analytics</h3>
          <p>Start logging your mood to see beautiful visualizations and insights!</p>
          <div className="chart-placeholder">
            <div className="placeholder-chart"></div>
            <p>Your mood trends will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mood-charts">
      <div className="charts-header">
        <h3>📊 Mood Analytics</h3>
        <div className="chart-controls">
          <div className="time-range-selector">
            <label>Time Range:</label>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </div>
          <div className="chart-type-selector">
            <label>Chart Type:</label>
            <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="doughnut">Distribution</option>
            </select>
          </div>
        </div>
      </div>

      {insights && (
        <div className="mood-insights">
          <div className="insight-card">
            <span className="insight-label">Average</span>
            <span className="insight-value">{insights.average}/10</span>
          </div>
          <div className="insight-card">
            <span className="insight-label">Highest</span>
            <span className="insight-value">{insights.highest}/10</span>
          </div>
          <div className="insight-card">
            <span className="insight-label">Lowest</span>
            <span className="insight-value">{insights.lowest}/10</span>
          </div>
          <div className="insight-card">
            <span className="insight-label">Trend</span>
            <span className={`insight-value trend-${insights.trend}`}>
              {insights.trend === 'improving' ? '📈 Up' : 
               insights.trend === 'declining' ? '📉 Down' : '➡️ Stable'}
            </span>
          </div>
          <div className="insight-card">
            <span className="insight-label">Entries</span>
            <span className="insight-value">{insights.totalEntries}</span>
          </div>
        </div>
      )}

      <div className="chart-container">
        {chartType === 'line' && (
          <Line data={prepareTimeSeriesData()} options={chartOptions} />
        )}
        {chartType === 'bar' && (
          <Bar data={prepareTimeSeriesData()} options={chartOptions} />
        )}
        {chartType === 'doughnut' && (
          <Doughnut data={prepareMoodDistribution()} options={chartOptions} />
        )}
      </div>

      <div className="chart-footer">
        <p className="chart-note">
          💡 <strong>Tip:</strong> Regular mood tracking helps identify patterns and triggers. 
          Consider noting what activities or events coincide with your mood changes.
        </p>
      </div>
    </div>
  );
};

export default MoodCharts;
