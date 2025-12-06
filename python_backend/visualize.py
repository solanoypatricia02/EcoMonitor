"""
EcoMonitor - Data Visualization
Creates plots and charts from sensor data
"""

import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from fetch_data import fetch_all_data, fetch_recent_data
import pandas as pd
from datetime import datetime, timedelta

def plot_sensor_trends(df, hours=24):
    """Plot temperature, humidity, and air quality trends"""
    if df is None or df.empty:
        print("No data to plot")
        return
    
    # Filter to recent hours
    cutoff_time = datetime.now() - timedelta(hours=hours)
    df_filtered = df[df['timestamp'] >= cutoff_time]
    
    if df_filtered.empty:
        print(f"No data in the last {hours} hours")
        df_filtered = df  # Use all data instead
    
    # Create figure with subplots
    fig, axes = plt.subplots(3, 1, figsize=(12, 10))
    fig.suptitle(f'EnviTrack - Sensor Data (Last {hours}h)', fontsize=16, fontweight='bold')
    
    # Temperature plot
    axes[0].plot(df_filtered['timestamp'], df_filtered['temperature'], 
                 color='#FF6B6B', linewidth=2, marker='o', markersize=4)
    axes[0].set_ylabel('Temperature (°C)', fontsize=12, fontweight='bold')
    axes[0].grid(True, alpha=0.3)
    axes[0].set_title('Temperature', fontsize=11)
    
    # Add threshold lines
    axes[0].axhline(y=35, color='red', linestyle='--', alpha=0.5, label='Max threshold')
    axes[0].axhline(y=15, color='blue', linestyle='--', alpha=0.5, label='Min threshold')
    axes[0].legend(loc='upper right', fontsize=9)
    
    # Humidity plot
    axes[1].plot(df_filtered['timestamp'], df_filtered['humidity'], 
                 color='#4ECDC4', linewidth=2, marker='o', markersize=4)
    axes[1].set_ylabel('Humidity (%)', fontsize=12, fontweight='bold')
    axes[1].grid(True, alpha=0.3)
    axes[1].set_title('Humidity', fontsize=11)
    
    # Add threshold lines
    axes[1].axhline(y=80, color='red', linestyle='--', alpha=0.5, label='Max threshold')
    axes[1].axhline(y=30, color='orange', linestyle='--', alpha=0.5, label='Min threshold')
    axes[1].legend(loc='upper right', fontsize=9)
    
    # Air Quality plot
    axes[2].plot(df_filtered['timestamp'], df_filtered['air_quality'], 
                 color='#95E1D3', linewidth=2, marker='o', markersize=4)
    axes[2].set_ylabel('Air Quality (ppm)', fontsize=12, fontweight='bold')
    axes[2].set_xlabel('Time', fontsize=12, fontweight='bold')
    axes[2].grid(True, alpha=0.3)
    axes[2].set_title('Air Quality', fontsize=11)
    
    # Add threshold line
    axes[2].axhline(y=600, color='red', linestyle='--', alpha=0.5, label='Alert threshold')
    axes[2].legend(loc='upper right', fontsize=9)
    
    # Format x-axis
    for ax in axes:
        ax.xaxis.set_major_formatter(mdates.DateFormatter('%H:%M'))
        ax.xaxis.set_major_locator(mdates.HourLocator(interval=2))
        plt.setp(ax.xaxis.get_majorticklabels(), rotation=45, ha='right')
    
    plt.tight_layout()
    
    # Save figure
    filename = f'envitrack_plot_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png'
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    print(f"✓ Plot saved as {filename}")
    
    plt.show()

def plot_correlation_matrix(df):
    """Plot correlation between sensors"""
    if df is None or df.empty:
        print("No data to plot")
        return
    
    # Calculate correlation
    corr_data = df[['temperature', 'humidity', 'air_quality']].corr()
    
    fig, ax = plt.subplots(figsize=(8, 6))
    im = ax.imshow(corr_data, cmap='coolwarm', aspect='auto', vmin=-1, vmax=1)
    
    # Set ticks and labels
    ax.set_xticks(range(len(corr_data.columns)))
    ax.set_yticks(range(len(corr_data.columns)))
    ax.set_xticklabels(['Temperature', 'Humidity', 'Air Quality'])
    ax.set_yticklabels(['Temperature', 'Humidity', 'Air Quality'])
    
    # Add correlation values
    for i in range(len(corr_data.columns)):
        for j in range(len(corr_data.columns)):
            text = ax.text(j, i, f'{corr_data.iloc[i, j]:.2f}',
                          ha="center", va="center", color="black", fontsize=14)
    
    ax.set_title('Sensor Correlation Matrix', fontsize=14, fontweight='bold', pad=20)
    fig.colorbar(im, ax=ax, label='Correlation Coefficient')
    
    plt.tight_layout()
    filename = f'correlation_matrix_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png'
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    print(f"✓ Correlation matrix saved as {filename}")
    
    plt.show()

def plot_daily_summary(df):
    """Plot daily averages"""
    if df is None or df.empty:
        print("No data to plot")
        return
    
    # Group by date
    df['date'] = df['timestamp'].dt.date
    daily = df.groupby('date').agg({
        'temperature': 'mean',
        'humidity': 'mean',
        'air_quality': 'mean'
    }).reset_index()
    
    fig, axes = plt.subplots(3, 1, figsize=(12, 10))
    fig.suptitle('EnviTrack - Daily Averages', fontsize=16, fontweight='bold')
    
    axes[0].bar(daily['date'], daily['temperature'], color='#FF6B6B', alpha=0.7)
    axes[0].set_ylabel('Avg Temperature (°C)', fontsize=11, fontweight='bold')
    axes[0].grid(True, alpha=0.3, axis='y')
    
    axes[1].bar(daily['date'], daily['humidity'], color='#4ECDC4', alpha=0.7)
    axes[1].set_ylabel('Avg Humidity (%)', fontsize=11, fontweight='bold')
    axes[1].grid(True, alpha=0.3, axis='y')
    
    axes[2].bar(daily['date'], daily['air_quality'], color='#95E1D3', alpha=0.7)
    axes[2].set_ylabel('Avg Air Quality (ppm)', fontsize=11, fontweight='bold')
    axes[2].set_xlabel('Date', fontsize=11, fontweight='bold')
    axes[2].grid(True, alpha=0.3, axis='y')
    
    for ax in axes:
        plt.setp(ax.xaxis.get_majorticklabels(), rotation=45, ha='right')
    
    plt.tight_layout()
    filename = f'daily_summary_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png'
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    print(f"✓ Daily summary saved as {filename}")
    
    plt.show()

if __name__ == '__main__':
    print("=== EnviTrack Visualizer ===\n")
    
    # Fetch data
    df = fetch_all_data()
    
    if df is not None and not df.empty:
        print(f"\nGenerating visualizations for {len(df)} records...\n")
        
        # Generate plots
        plot_sensor_trends(df, hours=24)
        plot_correlation_matrix(df)
        
        # Only plot daily summary if we have multiple days
        if len(df['timestamp'].dt.date.unique()) > 1:
            plot_daily_summary(df)
        
        print("\n✓ All visualizations complete")
    else:
        print("✗ No data available for visualization")
