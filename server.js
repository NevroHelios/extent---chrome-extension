const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());


async function main(
    project,
    model = 'text-embedding-004',
    texts = 'banana bread?;banana muffins?',
    task = 'QUESTION_ANSWERING',
    outputDimensionality = 0,
    apiEndpoint = 'us-central1-aiplatform.googleapis.com'
  ) {
    const aiplatform = require('@google-cloud/aiplatform');
    const {PredictionServiceClient} = aiplatform.v1;
    const {helpers} = aiplatform; // helps construct protobuf.Value objects.
    const clientOptions = {apiEndpoint: apiEndpoint};
    const location = 'us-central1';
    const endpoint = `projects/${project}/locations/${location}/publishers/google/models/${model}`;
    const parameters =
      outputDimensionality > 0
        ? helpers.toValue(outputDimensionality)
        : helpers.toValue(256);
    console.log('Calling predict');
    async function callPredict() {
      const instances = texts
        .split(';')
        .map(e => helpers.toValue({content: e, taskType: task}));
      const request = {endpoint, instances, parameters};
      const client = new PredictionServiceClient(clientOptions);
      const [response] = await client.predict(request);
      console.log('Got predict response');
      const predictions = response.predictions;
      for (const prediction of predictions) {
        const embeddings = prediction.structValue.fields.embeddings;
        const values = embeddings.structValue.fields.values.listValue.values;
        console.log('Got prediction: ' + JSON.stringify(values));
      }
    }
  
    callPredict();
  }
const port = 3000;
app.listen(port, () => {
    main();
    console.log(`Server running at http://localhost:${port}`);
});




// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const aiplatform = require('@google-cloud/aiplatform');
// const { PredictionServiceClient } = aiplatform.v1;
// const { helpers } = aiplatform;

// const app = express();
// const port = 3000;
// const project = process.env.GCP_PROJECT;
// const apiEndpoint = 'us-central1-aiplatform.googleapis.com';
// const location = 'us-central1';
// const model = 'embedding-001';
// const clientOptions = { apiEndpoint: apiEndpoint };
// const endpoint = `projects/${project}/locations/${location}/publishers/google/models/${model}`;

// app.use(express.json());
// app.use(cors());

// app.post('/predict', async (req, res) => {
//     const { texts, task, outputDimensionality } = req.body;
//     const parameters = outputDimensionality > 0
//         ? helpers.toValue(outputDimensionality)
//         : helpers.toValue(768);
    
//     console.log(parameters)

//     const instances = texts
//         .split(';')
//         .map(e => helpers.toValue({ content: e, taskType: task }));
    
//     const request = { endpoint, instances, parameters };
//     const client = new PredictionServiceClient(clientOptions);
    
//     try {
//         console.log("try")
//         const response = await client.predict(request);
//         console.log("response")
//         const predictions = response.predictions.map(prediction => {
//             console.log("prediction")
//             const embeddings = prediction.structValue.fields.embeddings;
//             console.log("embeddings")
//             const values = embeddings.structValue.fields.values.listValue.values;
//             console.log("values")
//             return values;
//         });
//         return res.json(predictions);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });
