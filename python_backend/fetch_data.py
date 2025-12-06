"""
EcoMonitor - Fetch sensor data from Firebase
Retrieves historical data and saves to CSV
"""

import requests
import json
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

FIREBASE_URL = os.getenv('FIREBASE_DATABASE_URL', 'https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com')

def fetch_all_data():
    """Fetch all sensor data from Firebase"""
    try:
        url = f"{FIREBASE_URL}/sensor_data.json"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if not data:
            print("No data found in database")
            return None
        
        # Convert to list of records
        records = []
        for key, value in data.items():
            record = value.copy()
            record['firebase_key'] = key
            records.append(record)
        
        df = pd.DataFrame(records)
        
        # Convert timestamp to datetime
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df = df.sort_values('timestamp')
        
        print(f"✓ Fetched {len(df)} records")
        return df
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Error fetching data: {e}")
        return None

def fetch_recent_data(limit=100):
    """Fetch recent sensor data with limit"""
    try:
        url = f"{FIREBASE_URL}/sensor_data.json?orderBy=\"$key\"&limitToLast={limit}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if not data:
            print("No data found")
            return None
        
        records = []
        for key, value in data.items():
            record = value.copy()
            record['firebase_key'] = key
            records.append(record)
        
        df = pd.DataFrame(records)
        
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df = df.sort_values('timestamp')
        
        print(f"✓ Fetched {len(df)} recent records")
        return df
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Error fetching data: {e}")
        return None

def save_to_csv(df, filename='sensor_data.csv'):
    """Save dataframe to CSV file"""
    if df is not None and not df.empty:
        df.to_csv(filename, index=False)
        print(f"✓ Data saved to {filename}")
    else:
        print("✗ No data to save")

def get_statistics(df):
    """Calculate basic statistics"""
    if df is None or df.empty:
        return None
    
    stats = {
        'temperature': {
            'mean': df['temperature'].mean(),
            'min': df['temperature'].min(),
            'max': df['temperature'].max(),
            'std': df['temperature'].std()
        },
        'humidity': {
            'mean': df['humidity'].mean(),
            'min': df['humidity'].min(),
            'max': df['humidity'].max(),
            'std': df['humidity'].std()
        },
        'air_quality': {
            'mean': df['air_quality'].mean(),
            'min': df['air_quality'].min(),
            'max': df['air_quality'].max(),
            'std': df['air_quality'].std()
        }
    }
    
    return stats

if __name__ == '__main__':
    print("=== EnviTrack Data Fetcher ===\n")
    
    # Fetch all data
    df = fetch_all_data()
    
    if df is not None:
        # Display basic info
        print(f"\nData range: {df['timestamp'].min()} to {df['timestamp'].max()}")
        print(f"\nFirst few records:")
        print(df.head())
        
        # Calculate statistics
        stats = get_statistics(df)
        if stats:
            print("\n=== Statistics ===")
            for sensor, values in stats.items():
                print(f"\n{sensor.upper()}:")
                print(f"  Mean: {values['mean']:.2f}")
                print(f"  Min:  {values['min']:.2f}")
                print(f"  Max:  {values['max']:.2f}")
                print(f"  Std:  {values['std']:.2f}")
        
        # Save to CSV
        save_to_csv(df)
