const admin = require("firebase-admin");

const serviceAccount = JSON.parse(
process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function run(){

console.log("Deleting Firebase videos...");

const snapshot =
await db
.collection("videos")
.get();

if(snapshot.empty){

console.log("No videos found.");

return;

}

const batch = db.batch();

snapshot.forEach(doc=>{

batch.delete(doc.ref);

});

await batch.commit();

console.log(
`Deleted ${snapshot.size} videos`
);

}

run()
.then(()=>{

console.log("Done");

process.exit(0);

})
.catch(err=>{

console.error(err);

process.exit(1);

});
