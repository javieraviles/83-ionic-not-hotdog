"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
// Firebase
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
// Cloud Vision
const vision = require("@google-cloud/vision");
const visionClient = new vision.ImageAnnotatorClient();
const bucketName = 'cloud-vision-c0b23.appspot.com';
exports.imageTagger = functions.storage
    .bucket(bucketName)
    .object()
    .onChange((event) => __awaiter(this, void 0, void 0, function* () {
    try {
        const object = event.data;
        const filePath = object.name;
        const imageUri = `gs://${bucketName}/${filePath}`;
        const docId = filePath.split('.jpg')[0];
        console.log(2, docId);
        const docRef = admin.firestore().collection('photos').doc(docId);
        const labelsResults = yield visionClient.labelDetection(imageUri);
        const faceResults = yield visionClient.faceDetection(imageUri);
        const textResults = yield visionClient.textDetection(imageUri);
        const labels = labelsResults[0].labelAnnotations.map(obj => obj.description);
        const text = textResults[0].textAnnotations.map(obj => obj.description);
        const face = faceResults[0].faceAnnotations;
        console.log(3, labels);
        console.log(4, text);
        console.log(5, face);
        return docRef.set({ labels , face, text });
    }
    catch (err) {
        console.log(err);
        return null;
    }
}));
//# sourceMappingURL=index.js.map