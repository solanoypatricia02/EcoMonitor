// EnviTrack Enhanced Features
// Data Export, Dark Mode, Custom Thresholds, Alert Sounds, Predictions

// ========== CONFIGURATION ==========
let thresholds = {
    tempMin: 15,
    tempMax: 35,
    humidityMin: 30,
    humidityMax: 80,
    airMax: 600,
    alertSound: 'default',
    heartbeatSound: true
};

// Make thresholds globally accessible
window.thresholds = thresholds;

let darkMode = false;
let allDataHistory = [];

// ========== INITIALIZATION ==========
function initializeFeatures() {
    loadSettings();
    loadDarkMode();
    registerServiceWorker();
    requestNotificationPermission();
    
    // Initialize audio context on first user interaction
    const enableAudio = () => {
        getAudioContext();
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
        console.log('Audio context initialized');
    };
    
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
}

// ========== PWA & NOTIFICATIONS ==========
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('✓ Service Worker registered'))
            .catch(err => console.log('✗ SW registration failed:', err));
    }
}

async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
    }
}

// ========== DARK MODE ==========
function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    document.getElementById('darkModeIcon').textContent = darkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', darkMode);
    
    // Update chart colors
    if (window.mainChart) {
        updateChartForTheme();
    }
}

function loadDarkMode() {
    darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const icon = document.getElementById('darkModeIcon');
        if (icon) icon.textContent = '☀️';
    }
}

function updateChartForTheme() {
    const gridColor = darkMode ? '#334155' : '#f1f5f9';
    const textColor = darkMode ? '#94a3b8' : '#64748b';
    
    if (window.mainChart) {
        window.mainChart.options.scales.y.grid.color = gridColor;
        window.mainChart.options.scales.y.ticks.color = textColor;
        window.mainChart.options.scales.y1.ticks.color = textColor;
        window.mainChart.options.scales.x.ticks.color = textColor;
        window.mainChart.update();
    }
}

// ========== SETTINGS ==========
function openSettings() {
    document.getElementById('settingsPanel').classList.add('active');
    document.getElementById('settingsOverlay').classList.add('active');
}

function closeSettings() {
    document.getElementById('settingsPanel').classList.remove('active');
    document.getElementById('settingsOverlay').classList.remove('active');
}

function loadSettings() {
    const saved = localStorage.getItem('thresholds');
    if (saved) {
        thresholds = JSON.parse(saved);
    }
    // Update global reference
    window.thresholds = thresholds;
    updateSettingsUI();
}

function updateSettingsUI() {
    const fields = ['tempMin', 'tempMax', 'humidityMin', 'humidityMax', 'airMax', 'alertSound'];
    fields.forEach(field => {
        const el = document.getElementById(field);
        if (el) el.value = thresholds[field];
    });
    
    // Handle checkbox for heartbeat sound
    const heartbeatEl = document.getElementById('heartbeatSound');
    if (heartbeatEl) heartbeatEl.checked = thresholds.heartbeatSound;
}

function saveSettings() {
    thresholds = {
        tempMin: parseFloat(document.getElementById('tempMin').value),
        tempMax: parseFloat(document.getElementById('tempMax').value),
        humidityMin: parseFloat(document.getElementById('humidityMin').value),
        humidityMax: parseFloat(document.getElementById('humidityMax').value),
        airMax: parseFloat(document.getElementById('airMax').value),
        alertSound: document.getElementById('alertSound').value,
        heartbeatSound: document.getElementById('heartbeatSound').checked
    };
    
    // Update global reference
    window.thresholds = thresholds;
    
    localStorage.setItem('thresholds', JSON.stringify(thresholds));
    closeSettings();
    
    showToast('✓ Settings saved successfully!', 'success');
}

function resetSettings() {
    if (confirm('Reset all settings to defaults?')) {
        thresholds = {
            tempMin: 15,
            tempMax: 35,
            humidityMin: 30,
            humidityMax: 80,
            airMax: 600,
            alertSound: 'default',
            heartbeatSound: true
        };
        // Update global reference
        window.thresholds = thresholds;
        localStorage.setItem('thresholds', JSON.stringify(thresholds));
        updateSettingsUI();
        showToast('✓ Settings reset to defaults', 'success');
    }
}

// ========== ALERT SOUNDS ==========
const alertSounds = {
    default: function(audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 900;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        
        setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.frequency.value = 700;
            osc2.type = 'sine';
            gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 0.3);
        }, 200);
    },
    
    chime: function(audioContext) {
        [523.25, 659.25, 783.99].forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.2, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                osc.start(audioContext.currentTime);
                osc.stop(audioContext.currentTime + 0.5);
            }, i * 100);
        });
    },
    
    bell: function(audioContext) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = 800;
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0.4, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 1);
    },
    
    siren: function(audioContext) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.5);
        osc.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 1);
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 1);
    }
};

// ========== HEARTBEAT SOUNDS ==========
let heartbeatIntervals = {};
let globalAudioContext = null;

// Initialize audio context once
function getAudioContext() {
    if (!globalAudioContext) {
        globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Resume context if suspended
    if (globalAudioContext.state === 'suspended') {
        globalAudioContext.resume();
    }
    
    return globalAudioContext;
}

function createHeartbeatSound(type = 'warning') {
    try {
        const audioContext = getAudioContext();
    
    if (type === 'warning') {
        // Warning heartbeat: Two beats every 2 seconds (matching CSS animation)
        const beat1 = () => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = 400;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.15, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.1);
        };
        
        const beat2 = () => {
            setTimeout(() => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = 350;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.12, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
                osc.start(audioContext.currentTime);
                osc.stop(audioContext.currentTime + 0.08);
            }, 200);
        };
        
        beat1();
        beat2();
        
    } else if (type === 'critical') {
        // Critical heartbeat: Two beats every 1 second (matching CSS animation)
        const beat1 = () => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = 500;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.2, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.12);
        };
        
        const beat2 = () => {
            setTimeout(() => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = 450;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.18, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                osc.start(audioContext.currentTime);
                osc.stop(audioContext.currentTime + 0.1);
            }, 200);
        };
        
        beat1();
        beat2();
    }
    } catch (error) {
        console.log('Heartbeat sound error:', error);
    }
}

function startHeartbeatSound(cardType, severity) {
    // Check if heartbeat sound is enabled
    const currentThresholds = window.thresholds || thresholds;
    if (!currentThresholds.heartbeatSound) {
        console.log('Heartbeat sound disabled in settings');
        return;
    }
    
    console.log(`Starting heartbeat sound for ${cardType} with severity ${severity}`);
    
    // Stop any existing heartbeat for this card
    stopHeartbeatSound(cardType);
    
    if (severity === 'warning') {
        // Start warning heartbeat every 2 seconds
        heartbeatIntervals[cardType] = setInterval(() => {
            console.log(`Playing warning heartbeat for ${cardType}`);
            createHeartbeatSound('warning');
        }, 2000);
        // Play immediately
        createHeartbeatSound('warning');
        
    } else if (severity === 'critical') {
        // Start critical heartbeat every 1 second
        heartbeatIntervals[cardType] = setInterval(() => {
            console.log(`Playing critical heartbeat for ${cardType}`);
            createHeartbeatSound('critical');
        }, 1000);
        // Play immediately
        createHeartbeatSound('critical');
    }
}

function stopHeartbeatSound(cardType) {
    if (heartbeatIntervals[cardType]) {
        console.log(`Stopping heartbeat sound for ${cardType}`);
        clearInterval(heartbeatIntervals[cardType]);
        delete heartbeatIntervals[cardType];
    }
}

function stopAllHeartbeatSounds() {
    Object.keys(heartbeatIntervals).forEach(cardType => {
        stopHeartbeatSound(cardType);
    });
}

function testHeartbeatSound() {
    showToast('💓 Testing heartbeat sounds...', 'info');
    
    // Test warning heartbeat
    console.log('Testing warning heartbeat');
    createHeartbeatSound('warning');
    
    // Test critical heartbeat after 2 seconds
    setTimeout(() => {
        console.log('Testing critical heartbeat');
        createHeartbeatSound('critical');
    }, 2000);
    
    // Start a temporary continuous heartbeat for 10 seconds
    let testInterval = setInterval(() => {
        createHeartbeatSound('warning');
    }, 2000);
    
    setTimeout(() => {
        clearInterval(testInterval);
        showToast('💓 Heartbeat test completed', 'success');
    }, 10000);
}

// Cleanup heartbeat sounds when page is closed
window.addEventListener('beforeunload', () => {
    stopAllHeartbeatSounds();
});

// Resume audio context on user interaction
document.addEventListener('click', () => {
    if (globalAudioContext && globalAudioContext.state === 'suspended') {
        globalAudioContext.resume();
    }
});

// Debug function to check heartbeat status
window.debugHeartbeat = function() {
    console.log('Active heartbeat intervals:', Object.keys(heartbeatIntervals));
    console.log('Thresholds:', window.thresholds);
    console.log('AudioContext state:', globalAudioContext ? globalAudioContext.state : 'not created');
};

function playCustomAlertSound() {
    try {
        const audioContext = getAudioContext();
        const soundType = thresholds.alertSound || 'default';
        
        if (alertSounds[soundType]) {
            alertSounds[soundType](audioContext);
        }
    } catch (error) {
        console.log('Alert sound error:', error);
    }
}

function testAlertSound() {
    playCustomAlertSound();
    showToast('🔊 Playing selected alert sound', 'info');
}

// ========== DATA EXPORT ==========
function exportToCSV() {
    if (allDataHistory.length === 0) {
        showToast('⚠️ No data available to export', 'warning');
        return;
    }
    
    let csv = 'Timestamp,Temperature (°C),Humidity (%),Air Quality (ppm),Device ID\n';
    
    allDataHistory.forEach(entry => {
        csv += `${entry.timestamp},${entry.temperature},${entry.humidity},${entry.air_quality},${entry.device_id || 'ESP32_001'}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `envitrack_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    showToast('✓ CSV exported successfully!', 'success');
}

// Generate AI insights based on data analysis
function generateAIInsights(stats, recentData) {
    const insights = [];
    
    // Temperature analysis
    if (stats.avgTemp > thresholds.tempMax) {
        insights.push({
            icon: '[TEMP]',
            title: 'High Temperature Detected',
            text: `Average temperature (${stats.avgTemp}C) exceeds the maximum threshold (${thresholds.tempMax}C). This may indicate inadequate cooling, increased heat sources, or HVAC system issues. Recommend immediate inspection and potential adjustment of cooling systems.`
        });
    } else if (stats.avgTemp < thresholds.tempMin) {
        insights.push({
            icon: '[COLD]',
            title: 'Low Temperature Alert',
            text: `Average temperature (${stats.avgTemp}C) is below minimum threshold (${thresholds.tempMin}C). This could affect equipment performance and occupant comfort. Consider adjusting heating systems or checking for drafts.`
        });
    } else {
        insights.push({
            icon: '[OK]',
            title: 'Temperature Optimal',
            text: `Temperature levels are within acceptable range (${stats.avgTemp}C). Current conditions are suitable for normal operations and occupant comfort.`
        });
    }
    
    // Humidity analysis
    if (stats.avgHumidity > thresholds.humidityMax) {
        insights.push({
            icon: '[H2O]',
            title: 'High Humidity Warning',
            text: `Average humidity (${stats.avgHumidity}%) exceeds maximum threshold (${thresholds.humidityMax}%). Elevated humidity can promote mold growth, damage equipment, and reduce air quality. Recommend improving ventilation or deploying dehumidification systems.`
        });
    } else if (stats.avgHumidity < thresholds.humidityMin) {
        insights.push({
            icon: '[DRY]',
            title: 'Low Humidity Notice',
            text: `Average humidity (${stats.avgHumidity}%) is below minimum threshold (${thresholds.humidityMin}%). Low humidity can cause discomfort, static electricity, and respiratory issues. Consider using humidifiers or adjusting HVAC settings.`
        });
    } else {
        insights.push({
            icon: '[OK]',
            title: 'Humidity Balanced',
            text: `Humidity levels are well-maintained at ${stats.avgHumidity}%. Current conditions prevent mold growth while maintaining comfort.`
        });
    }
    
    // Air quality analysis
    if (stats.avgAir > thresholds.airMax) {
        insights.push({
            icon: '[AIR]',
            title: 'Poor Air Quality Alert',
            text: `Average air quality (${stats.avgAir} ppm) exceeds safe threshold (${thresholds.airMax} ppm). This indicates elevated pollutant levels that may affect health and productivity. Immediate actions: improve ventilation, identify pollution sources, and consider air filtration systems.`
        });
    } else if (stats.avgAir > thresholds.airMax * 0.7) {
        insights.push({
            icon: '[!]',
            title: 'Air Quality Monitoring',
            text: `Air quality (${stats.avgAir} ppm) is approaching threshold levels. While currently acceptable, continued monitoring is recommended. Consider preventive measures to maintain optimal air quality.`
        });
    } else {
        insights.push({
            icon: '[OK]',
            title: 'Excellent Air Quality',
            text: `Air quality is excellent at ${stats.avgAir} ppm, well below the threshold of ${thresholds.airMax} ppm. Current ventilation and environmental controls are effective.`
        });
    }
    
    // Trend analysis
    if (recentData && recentData.length >= 10) {
        const recent10 = recentData.slice(-10);
        const tempTrend = recent10[recent10.length - 1].temperature - recent10[0].temperature;
        const humidityTrend = recent10[recent10.length - 1].humidity - recent10[0].humidity;
        
        if (Math.abs(tempTrend) > 2) {
            insights.push({
                icon: '[TREND]',
                title: 'Temperature Trend Alert',
                text: `Temperature has ${tempTrend > 0 ? 'increased' : 'decreased'} by ${Math.abs(tempTrend).toFixed(1)}C in recent readings. ${tempTrend > 0 ? 'Rising temperatures may require cooling system adjustment.' : 'Falling temperatures may indicate cooling system overcorrection or external factors.'}`
            });
        }
        
        if (Math.abs(humidityTrend) > 5) {
            insights.push({
                icon: '[TREND]',
                title: 'Humidity Trend Notice',
                text: `Humidity has ${humidityTrend > 0 ? 'increased' : 'decreased'} by ${Math.abs(humidityTrend).toFixed(1)}% recently. Monitor for continued changes and adjust environmental controls as needed.`
            });
        }
    }
    
    // Compliance assessment
    const complianceScore = calculateComplianceScore(stats);
    insights.push({
        icon: '[COMPLIANCE]',
        title: 'Compliance Status',
        text: `Environmental compliance score: ${complianceScore}%. ${complianceScore >= 90 ? 'Excellent compliance with all environmental standards.' : complianceScore >= 70 ? 'Good compliance, minor adjustments recommended.' : 'Compliance issues detected, immediate action required.'}`
    });
    
    // Recommendations
    const recommendations = generateRecommendations(stats);
    if (recommendations.length > 0) {
        insights.push({
            icon: '[AI]',
            title: 'AI Recommendations',
            text: recommendations.join(' ')
        });
    }
    
    return insights;
}

function calculateComplianceScore(stats) {
    let score = 100;
    
    // Temperature compliance
    if (stats.avgTemp > thresholds.tempMax || stats.avgTemp < thresholds.tempMin) {
        score -= 30;
    } else if (Math.abs(stats.avgTemp - (thresholds.tempMax + thresholds.tempMin) / 2) > 5) {
        score -= 10;
    }
    
    // Humidity compliance
    if (stats.avgHumidity > thresholds.humidityMax || stats.avgHumidity < thresholds.humidityMin) {
        score -= 30;
    } else if (Math.abs(stats.avgHumidity - (thresholds.humidityMax + thresholds.humidityMin) / 2) > 10) {
        score -= 10;
    }
    
    // Air quality compliance
    if (stats.avgAir > thresholds.airMax) {
        score -= 40;
    } else if (stats.avgAir > thresholds.airMax * 0.8) {
        score -= 15;
    }
    
    return Math.max(0, score);
}

function generateRecommendations(stats) {
    const recommendations = [];
    
    if (stats.avgTemp > thresholds.tempMax - 2) {
        recommendations.push('Consider increasing cooling capacity or improving insulation.');
    }
    
    if (stats.avgHumidity > thresholds.humidityMax - 5) {
        recommendations.push('Enhance ventilation or install dehumidification systems.');
    }
    
    if (stats.avgAir > thresholds.airMax * 0.6) {
        recommendations.push('Implement air filtration and identify pollution sources.');
    }
    
    if (recommendations.length === 0) {
        recommendations.push('Current environmental controls are effective. Continue regular monitoring and maintenance.');
    }
    
    return recommendations;
}

async function exportToPDF() {
    if (typeof jspdf === 'undefined') {
        showToast('⚠️ PDF library not loaded', 'warning');
        return;
    }
    
    showToast('📄 Generating AI-powered report...', 'info');
    
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        let yPos = 20;
        
        // Title
        pdf.setFontSize(24);
        pdf.setTextColor(16, 185, 129);
        pdf.text('EnviTrack', 20, yPos);
        
        yPos += 10;
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Environmental Monitoring Report', 20, yPos);
        
        yPos += 8;
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, yPos);
        
        yPos += 12;
        
        // Statistics
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Summary Statistics', 20, yPos);
        
        yPos += 8;
        const stats = calculateStatistics();
        pdf.setFontSize(10);
        pdf.text(`Total Data Points: ${stats.count}`, 30, yPos);
        yPos += 7;
        pdf.text(`Average Temperature: ${stats.avgTemp}°C`, 30, yPos);
        yPos += 7;
        pdf.text(`Average Humidity: ${stats.avgHumidity}%`, 30, yPos);
        yPos += 7;
        pdf.text(`Average Air Quality: ${stats.avgAir} ppm`, 30, yPos);
        
        yPos += 12;
        
        // Capture chart
        const chartCanvas = document.getElementById('mainChart');
        if (chartCanvas) {
            const chartImage = chartCanvas.toDataURL('image/png');
            pdf.addImage(chartImage, 'PNG', 15, yPos, 180, 90);
            yPos += 95;
        }
        
        // AI Insights Section
        pdf.addPage();
        yPos = 20;
        
        pdf.setFontSize(16);
        pdf.setTextColor(16, 185, 129);
        pdf.text('AI-Generated Insights', 20, yPos);
        
        yPos += 10;
        
        const insights = generateAIInsights(stats, allDataHistory);
        
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        
        insights.forEach((insight, index) => {
            if (yPos > 270) {
                pdf.addPage();
                yPos = 20;
            }
            
            // Insight title
            pdf.setFontSize(12);
            pdf.setTextColor(16, 185, 129);
            pdf.text(`${insight.icon} ${insight.title}`, 20, yPos);
            
            yPos += 7;
            
            // Insight text (wrap text)
            pdf.setFontSize(10);
            pdf.setTextColor(60, 60, 60);
            const lines = pdf.splitTextToSize(insight.text, 170);
            pdf.text(lines, 25, yPos);
            
            yPos += (lines.length * 5) + 8;
        });
        
        // Footer on last page
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('EnviTrack - AI-Powered Environmental Monitoring System', 20, 285);
        
        pdf.save(`envitrack_ai_report_${new Date().toISOString().split('T')[0]}.pdf`);
        showToast('✓ AI-powered report generated!', 'success');
    } catch (error) {
        console.error('PDF generation error:', error);
        showToast('✗ PDF generation failed', 'error');
    }
}

function calculateStatistics() {
    if (allDataHistory.length === 0) {
        return { count: 0, avgTemp: 0, avgHumidity: 0, avgAir: 0 };
    }
    
    const sum = allDataHistory.reduce((acc, entry) => ({
        temp: acc.temp + entry.temperature,
        humidity: acc.humidity + entry.humidity,
        air: acc.air + entry.air_quality
    }), { temp: 0, humidity: 0, air: 0 });
    
    const count = allDataHistory.length;
    
    return {
        count: count,
        avgTemp: (sum.temp / count).toFixed(1),
        avgHumidity: (sum.humidity / count).toFixed(1),
        avgAir: Math.round(sum.air / count)
    };
}

// ========== PREDICTIVE ANALYTICS ==========
function predictNextValue(data, periods = 6) {
    if (data.length < 10) return null;
    
    const recent = data.slice(-20);
    const n = recent.length;
    
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    recent.forEach((value, index) => {
        sumX += index;
        sumY += value;
        sumXY += index * value;
        sumX2 += index * index;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const predictions = [];
    for (let i = 1; i <= periods; i++) {
        predictions.push(slope * (n + i) + intercept);
    }
    
    return predictions;
}

function runPredictiveAnalysis() {
    if (allDataHistory.length < 20) return;
    
    const recentTemps = allDataHistory.slice(-20).map(e => e.temperature);
    const recentHumidity = allDataHistory.slice(-20).map(e => e.humidity);
    const recentAir = allDataHistory.slice(-20).map(e => e.air_quality);
    
    const tempPred = predictNextValue(recentTemps);
    const humidityPred = predictNextValue(recentHumidity);
    const airPred = predictNextValue(recentAir);
    
    if (tempPred && tempPred[0] > thresholds.tempMax) {
        showPredictionAlert('Temperature', tempPred[0], '📈', 'will exceed maximum threshold');
    } else if (tempPred && tempPred[0] < thresholds.tempMin) {
        showPredictionAlert('Temperature', tempPred[0], '📉', 'will drop below minimum threshold');
    }
    
    if (humidityPred && humidityPred[0] > thresholds.humidityMax) {
        showPredictionAlert('Humidity', humidityPred[0], '📈', 'will exceed maximum threshold');
    }
    
    if (airPred && airPred[0] > thresholds.airMax) {
        showPredictionAlert('Air Quality', airPred[0], '📈', 'will exceed safe threshold');
    }
}

function showPredictionAlert(metric, value, trend, message) {
    const container = document.getElementById('alertPopupContainer');
    const popup = document.createElement('div');
    popup.className = 'alert-popup prediction';
    
    popup.innerHTML = `
        <div class="alert-popup-header">
            <div class="alert-popup-icon">🔮</div>
            <div class="alert-popup-content">
                <div class="alert-popup-title">Prediction Alert</div>
                <div class="alert-popup-desc">
                    ${metric} ${message}<br>
                    <strong>Predicted: ${value.toFixed(1)} ${trend}</strong>
                </div>
                <div class="alert-popup-time">
                    <span>⏱️</span>
                    <span>Next 10 minutes</span>
                </div>
            </div>
        </div>
        <button class="alert-popup-close" onclick="this.parentElement.remove()">✕</button>
        <div class="alert-popup-progress"></div>
    `;
    
    container.appendChild(popup);
    
    setTimeout(() => {
        if (popup.parentElement) {
            popup.classList.add('closing');
            setTimeout(() => popup.remove(), 300);
        }
    }, 8000);
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== RUN PREDICTIONS PERIODICALLY ==========
setInterval(runPredictiveAnalysis, 120000); // Every 2 minutes

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFeatures);
} else {
    initializeFeatures();
}
