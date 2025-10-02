// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot, 
    Timestamp,
    query,
    orderBy
} from "firebase/firestore";
// FIX: Switched to a namespace import for firebase/storage to resolve module resolution errors.
// FIX: Corrected firebase/storage import to use named exports for modular SDK.
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AttendanceRecord, UserData, LocationData } from '../types';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4sWxXrfYoxTpliI1Y9wLyzrTQEdhFiA0",
  authDomain: "attendance-app-e6851.firebaseapp.com",
  projectId: "attendance-app-e6851",
  storageBucket: "attendance-app-e6851.appspot.com",
  messagingSenderId: "1061353365113",
  appId: "1:1061353365113:web:1a719e6fdd629f83707ea8"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// FIX: Used the namespaced import to get the storage instance.
// FIX: Used the modular SDK function to get the storage instance.
const storage = getStorage(app);

const RECORDS_COLLECTION = 'attendanceRecords';

interface RecordToSave {
    userData: UserData;
    timestamp: Date;
    location: LocationData;
    imageBlob: Blob;
}

// Function to upload image and save record
export async function saveRecord(recordData: RecordToSave): Promise<AttendanceRecord> {
    const { userData, timestamp, location, imageBlob } = recordData;

    // 1. Upload the image to Firebase Storage
    // FIX: Corrected property access to use `employeeId` as defined in the UserData type, instead of the non-existent `email`.
    const imageFileName = `${timestamp.getTime()}-${userData.employeeId}.jpg`;
    // FIX: Used the namespaced import to create a storage reference.
    // FIX: Used the modular SDK function to create a storage reference.
    const imageRef = ref(storage, `attendance_images/${imageFileName}`);
    
    // FIX: Used the namespaced import to upload bytes.
    // FIX: Used the modular SDK function to upload bytes.
    await uploadBytes(imageRef, imageBlob);
    
    // 2. Get the public URL for the uploaded image
    // FIX: Used the namespaced import to get the download URL.
    // FIX: Used the modular SDK function to get the download URL.
    const imageUrl = await getDownloadURL(imageRef);

    // 3. Create the record object to save in Firestore
    const newRecord: Omit<AttendanceRecord, 'id'> = {
        ...userData,
        checkInTime: timestamp, // Store as native Date object temporarily
        location: location,
        imageDataUrl: imageUrl, // Use the public URL from Storage
    };

    // 4. Save the record to Firestore, converting the JS Date to a Firestore Timestamp
    const docRef = await addDoc(collection(db, RECORDS_COLLECTION), {
        ...newRecord,
        checkInTime: Timestamp.fromDate(newRecord.checkInTime)
    });

    // 5. Return the full record including the new ID
    return {
        ...newRecord,
        id: docRef.id,
    };
}

// Function to listen for real-time updates to the records collection
export function listenToRecords(callback: (records: AttendanceRecord[]) => void): () => void {
    const recordsQuery = query(collection(db, RECORDS_COLLECTION), orderBy("checkInTime", "desc"));
    
    const unsubscribe = onSnapshot(recordsQuery, (snapshot) => {
        const records = snapshot.docs.map(doc => {
            const data = doc.data();
            // FIX: Corrected the object structure to match the AttendanceRecord type by using `employeeId` and removing `name` and `email`.
            return {
                id: doc.id,
                employeeId: data.employeeId,
                // Convert Firestore Timestamp back to JavaScript Date object
                checkInTime: (data.checkInTime as Timestamp).toDate(), 
                location: data.location,
                imageDataUrl: data.imageDataUrl
            } as AttendanceRecord;
        });
        callback(records);
    });

    // Return the unsubscribe function to be called on cleanup
    return unsubscribe;
}