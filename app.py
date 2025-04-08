from flask import Flask, render_template, request, jsonify
import pickle
import requests
import numpy as np
import os

app = Flask(__name__)

# Load the model and scaler
model_path = 'rainfall_prediction_model.pkl'
scaler_path = 'scaler.pkl'

# Check if model and scaler files exist
if os.path.exists(model_path) and os.path.exists(scaler_path):
    model = pickle.load(open(model_path, 'rb'))
    scaler = pickle.load(open(scaler_path, 'rb'))
else:
    print("Warning: Model or scaler file not found. Predictions will not work.")
    model = None
    scaler = None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        city = request.form['city']
        
        # Weather API URL
        api_url = f"http://api.weatherapi.com/v1/current.json?key=b40b897381f04a2a87c75149250704&q={city}&aqi=yes"
        
        # Get data from Weather API
        response = requests.get(api_url)
        
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch weather data. Please try again.'})
        
        weather_data = response.json()
        
        # Extract required features
        current = weather_data['current']
        
        # Extract the features needed for prediction
        pressure = current.get('pressure_mb', 0)
        dewpoint = current.get('dewpoint_c', 0)
        humidity = current.get('humidity', 0)
        cloud = current.get('cloud', 0)
        wind_direction = current.get('wind_degree', 0)
        wind_speed = current.get('wind_kph', 0)
        
        # Collect all weather data for display
        display_data = {
            'city': city,
            'pressure': pressure,
            'dewpoint': dewpoint,
            'humidity': humidity,
            'cloud': cloud,
            'wind_direction': wind_direction,
            'wind_speed': wind_speed,
            'temperature': current.get('temp_c', 0),
            'condition': current.get('condition', {}).get('text', ''),
            'condition_icon': current.get('condition', {}).get('icon', '')
        }
        
        # Prepare features for model prediction
        features = np.array([[pressure, dewpoint, humidity, cloud, wind_direction, wind_speed]])
        
        # Scale the features
        if model is not None and scaler is not None:
            scaled_features = scaler.transform(features)
            
            # Make prediction
            prediction = model.predict(scaled_features)
            
            # Get prediction result
            result = "Yes, Rainfall Expected" if prediction[0] == 1 else "No Rainfall Expected"
            
            return render_template('result.html', 
                                  prediction=result,
                                  weather_data=display_data)
        else:
            return render_template('result.html', 
                                  prediction="Model not available",
                                  weather_data=display_data)
            
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True) 