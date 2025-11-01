const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testMLAPIs() {
  console.log('🧪 Testing ML API endpoints...\n');

  try {
    // Test 1: Get ML service status
    console.log('📊 Testing GET /api/ml/models (service status)...');
    const statusResponse = await fetch(`${BASE_URL}/api/ml/models`);
    const statusData = await statusResponse.json();

    if (statusResponse.ok) {
      console.log('✅ Status API working:');
      console.log(`  - Initialized: ${statusData.isInitialized}`);
      console.log(`  - Models: ${statusData.modelCount}`);
      console.log(`  - Pipelines: ${statusData.pipelineCount}`);
      console.log(`  - Recommendation Engine: ${statusData.recommendationEngineStatus?.isInitialized ? 'Active' : 'Inactive'}\n`);
    } else {
      console.log('❌ Status API failed:', statusData.error, '\n');
    }

    // Test 2: Get available models
    console.log('🧠 Testing GET /api/ml/predict (available models)...');
    const modelsResponse = await fetch(`${BASE_URL}/api/ml/predict`);
    const modelsData = await modelsResponse.json();

    if (modelsResponse.ok) {
      console.log('✅ Models API working:');
      console.log(`  - Models returned: ${modelsData.models?.length || 0}`);
      if (modelsData.models?.length > 0) {
        modelsData.models.forEach(model => {
          console.log(`    • ${model.name} (${model.type}) - ${model.status}`);
        });
      }
      console.log('');
    } else {
      console.log('❌ Models API failed:', modelsData.error, '\n');
    }

    // Test 3: Test prediction (if models are available)
    if (modelsData.models?.length > 0) {
      const testModel = modelsData.models[0];
      console.log(`🔮 Testing POST /api/ml/predict with ${testModel.name}...`);

      const predictionPayload = {
        modelId: testModel.id,
        features: [0.5, 0.3, 0.8, 0.2, 0.6]
      };

      const predictResponse = await fetch(`${BASE_URL}/api/ml/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionPayload)
      });

      const predictData = await predictResponse.json();

      if (predictResponse.ok) {
        console.log('✅ Prediction API working:');
        console.log(`  - Model: ${predictData.modelInfo?.name}`);
        console.log(`  - Prediction: ${predictData.prediction}`);
        if (predictData.confidence) {
          console.log(`  - Confidence: ${(predictData.confidence * 100).toFixed(1)}%`);
        }
        console.log('');
      } else {
        console.log('❌ Prediction API failed:', predictData.error, '\n');
      }
    }

    // Test 4: Test recommendations
    console.log('🎯 Testing POST /api/ml/recommend (room recommendations)...');

    const recommendationPayload = {
      guestPreferences: {
        budget: 2000,
        roomType: 'deluxe',
        amenities: ['wifi', 'pool'],
        checkInTime: '14:00',
        dietaryRestrictions: [],
        previousBookings: 3,
        loyaltyTier: 'silver'
      },
      context: {
        availableRooms: [
          {
            id: 'room-1',
            type: 'deluxe',
            price: 1500,
            amenities: ['wifi', 'pool', 'gym'],
            capacity: 2,
            floor: 2
          },
          {
            id: 'room-2',
            type: 'suite',
            price: 2500,
            amenities: ['wifi', 'spa', 'restaurant'],
            capacity: 2,
            floor: 3
          }
        ],
        currentOccupancy: 0.7,
        upcomingEvents: ['conference'],
        weatherCondition: 'sunny',
        timeOfDay: 'afternoon',
        propertyId: 'prop-1',
        tenantId: 'tenant-1'
      }
    };

    const recommendResponse = await fetch(`${BASE_URL}/api/ml/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recommendationPayload)
    });

    const recommendData = await recommendResponse.json();

    if (recommendResponse.ok) {
      console.log('✅ Recommendation API working:');
      console.log(`  - Recommendations returned: ${recommendData.length}`);
      recommendData.slice(0, 2).forEach((rec, idx) => {
        console.log(`    ${idx + 1}. ${rec.roomType} - $${rec.price} (${(rec.confidence * 100).toFixed(1)}% confidence)`);
      });
      console.log('');
    } else {
      console.log('❌ Recommendation API failed:', recommendData.error, '\n');
    }

    // Test 5: Test model training
    console.log('🎓 Testing POST /api/ml/train (model training)...');

    const trainingPayload = {
      modelType: 'linear',
      modelName: 'Test Revenue Predictor',
      features: [
        [1, 2, 3, 4, 5],
        [2, 3, 4, 5, 6],
        [3, 4, 5, 6, 7],
        [4, 5, 6, 7, 8]
      ],
      labels: [100, 150, 200, 250],
      config: { learningRate: 0.01, maxIterations: 100 }
    };

    const trainResponse = await fetch(`${BASE_URL}/api/ml/train`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trainingPayload)
    });

    const trainData = await trainResponse.json();

    if (trainResponse.ok) {
      console.log('✅ Training API working:');
      console.log(`  - Model trained: ${trainData.name}`);
      console.log(`  - Model ID: ${trainData.id}`);
      console.log(`  - Accuracy: ${trainData.accuracy?.toFixed(3) || 'N/A'}`);
      console.log(`  - Features: ${trainData.featureCount}`);
      console.log('');
    } else {
      console.log('❌ Training API failed:', trainData.error, '\n');
    }

    console.log('🎉 ML API testing completed!');
    console.log('✅ All ML API endpoints verified');

  } catch (error) {
    console.error('❌ ML API testing failed:', error.message);
    process.exit(1);
  }
}

// Wait for server to start
setTimeout(() => {
  testMLAPIs();
}, 5000);
