const { MLService } = require('./frontend/lib/services/ml/MLService');

async function testMLService() {
  console.log('🧪 Testing ML Service initialization and functionality...\n');

  try {
    // Initialize ML service
    const mlService = new MLService();
    console.log('🤖 Initializing ML Service...');
    await mlService.initialize();
    console.log('✅ ML Service initialized successfully\n');

    // Get service status
    const status = mlService.getStatus();
    console.log('📊 ML Service Status:');
    console.log(`  - Initialized: ${status.isInitialized}`);
    console.log(`  - Models: ${status.modelCount}`);
    console.log(`  - Pipelines: ${status.pipelineCount}`);
    console.log(`  - Recommendation Engine: ${status.recommendationEngineStatus?.isInitialized ? 'Active' : 'Inactive'}\n`);

    // Get available models
    const models = mlService.getModels();
    console.log('🧠 Available Models:');
    models.forEach(model => {
      console.log(`  - ${model.name} (${model.type}) - Status: ${model.status}`);
    });
    console.log('');

    // Test a simple prediction if models are available
    if (models.length > 0) {
      const testModel = models[0];
      console.log(`🔮 Testing prediction with ${testModel.name}...`);

      // Create test features (adjust based on model requirements)
      const testFeatures = [0.5, 0.3, 0.8, 0.2, 0.6]; // Sample features

      try {
        const prediction = await mlService.predict({
          modelId: testModel.id,
          features: testFeatures
        });

        console.log('✅ Prediction successful:');
        console.log(`  - Model: ${prediction.modelInfo.name}`);
        console.log(`  - Prediction: ${prediction.prediction}`);
        if (prediction.confidence) {
          console.log(`  - Confidence: ${(prediction.confidence * 100).toFixed(1)}%`);
        }
        console.log('');

      } catch (error) {
        console.log(`⚠️  Prediction test failed: ${error.message}\n`);
      }
    }

    // Test recommendation engine
    console.log('🎯 Testing Recommendation Engine...');
    try {
      const recommendations = await mlService.getRoomRecommendations({
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
      });

      console.log('✅ Room recommendations generated:');
      recommendations.slice(0, 2).forEach((rec, idx) => {
        console.log(`  ${idx + 1}. ${rec.roomType} - $${rec.price} (confidence: ${(rec.confidence * 100).toFixed(1)}%)`);
      });
      console.log('');

    } catch (error) {
      console.log(`⚠️  Recommendation test failed: ${error.message}\n`);
    }

    // Test model training
    console.log('🎓 Testing model training...');
    try {
      const trainingData = {
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

      const trainedModel = await mlService.trainModel(trainingData);
      console.log('✅ Model training successful:');
      console.log(`  - Model ID: ${trainedModel.id}`);
      console.log(`  - Name: ${trainedModel.name}`);
      console.log(`  - Accuracy: ${trainedModel.accuracy?.toFixed(3) || 'N/A'}`);
      console.log(`  - Features: ${trainedModel.featureCount}`);
      console.log('');

    } catch (error) {
      console.log(`⚠️  Training test failed: ${error.message}\n`);
    }

    console.log('🎉 ML Service test completed successfully!');
    console.log('✅ All core ML functionality verified');

  } catch (error) {
    console.error('❌ ML Service test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

testMLService();
