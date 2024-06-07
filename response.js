
// import { GoogleGenerativeAIEmbeddings } from './@langchain/google-genai';
// import { TaskType } from './@google/generative-ai';
// import { MemoryVectorStore } from "./langchain/vectorstores/memory";

// import readTags from './script.js';

// const dotenv = require("dotenv");

// // Load environment variables from .env file
// dotenv.config();
// /*
//  * Before running this, you should make sure you have created a
//  * Google Cloud Project that has `generativelanguage` API enabled.
//  *
//  * You will also need to generate an API key and set
//  * an environment variable GOOGLE_API_KEY
//  *
//  */

// const embeddings = new GoogleGenerativeAIEmbeddings({
//   model: "embedding-001", // 768 dimensions
//   taskType: TaskType.RETRIEVAL_DOCUMENT,
//   title: "Document title",
// });


// // const res = await embeddings.embedQuery("OK Google");

// // console.log(res, res.length);

// // console.log("Done");


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'displayData') {
      console.log(message.data);
  }
});
